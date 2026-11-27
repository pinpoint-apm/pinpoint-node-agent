/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const grpc = require('@grpc/grpc-js')
const log = require('../utils/log/logger')
const services = require('../data/v1/Service_grpc_pb')
const dataConvertor = require('../data/grpc-data-convertor')
const Scheduler = require('../utils/scheduler')
const socketIdInterceptor = require('./interceptor/socketid-interceptor')
const grpcBuiltInRetryHeaderInterceptor = require('./interceptor/grpc-built-in-retry-header-interceptor')
const OptionsBuilder = require('./retry/options-builder')
const CommandType = require('./command/command-type')
const GrpcReadableStream = require('./grpc-readable-stream')
const cmdMessages = require('../data/v1/Cmd_pb')
const wrappers = require('google-protobuf/google/protobuf/wrappers_pb')
const activeRequestRepository = require('../metric/active-request-repository')
const { setInterval } = require('node:timers/promises')
const { logError, initializeLogger } = require('./grpc-errors')
const StreamDeadlineOptionsBuilder = require('./stream-deadline-options-builder')
const GrpcReadableStreamBuilder = require('./grpc-readable-stream-builder')
const UnaryDeadlineOptionsBuilder = require('./unary-deadline-options-builder')
const SpanBatchSender = require('./span-batch-sender')
const StatsStreamClient = require('./stats-stream-client')
const { LogBuilder } = require('../utils/log/log-builder')

// AgentInfoSender.java
// refresh daily
const DEFAULT_AGENT_INFO_REFRESH_INTERVAL_MS = 24 * 60 * 60 * 1000

class GrpcDataSender {
  constructor(config, interceptors = []) {
    const collector = config.getCollector()
    this.collectorIp = collector.ip
    this.collectorAgentPort = collector.agentPort
    this.collectorStatsPort = collector.statsPort
    this.collectorSpanPort = collector.spanPort
    this.config = config
    this.interceptors = interceptors
    this.logger = log.getLogger(LogBuilder.createGrpcLogBuilder().setConfig(config).build())
    initializeLogger(this.logger)

    this.unaryDeadlineOptionsBuilder = new UnaryDeadlineOptionsBuilder()
    this.initializeClients()
    this.initializeMetadataClients()
    this.initializePingStream()
    this.initializeAgentInfoScheduler()
    this.initializeProfilerClients()

    this.clientSideStreamDeadlineOptionsBuilder = new StreamDeadlineOptionsBuilder(config)
    this.initializeSpanBatchSender()
    this.initializeStatsStreams()
  }

  close() {
    this.closeScheduler()
    if (this.spanBatchSender) {
      this.spanBatchSender.end()
    }
    if (this.agentStatsStream) {
      this.agentStatsStream.end()
    }
    if (this.uriStatsStream) {
      this.uriStatsStream.end()
    }
    if (this.pingStream) {
      this.pingStream.end()
    }
    if (this.agentClient) {
      this.agentClient.close()
    }
    if (this.metadataClient) {
      this.metadataClient.close()
    }
    if (this.spanClient) {
      this.spanClient.close()
    }
    if (this.uncompressedSpanClient) {
      this.uncompressedSpanClient.close()
    }
    if (this.statsClient) {
      this.statsClient.close()
    }
    if (this.uncompressedStatsClient) {
      this.uncompressedStatsClient.close()
    }

    if (this.profilerClient) {
      this.profilerClient.close()
    }
    if (this.commandStream) {
      this.commandStream.end()
    }
  }

  initializeClients() {
    const agentBuilder = this.agentClientOptionsBuilder()

    if (this.config && this.config.grpcServiceConfig && typeof this.config.grpcServiceConfig.getAgent === 'function') {
      agentBuilder.setGrpcServiceConfig(this.config.grpcServiceConfig.getAgent())
    }
    this.agentClient = new services.AgentClient(this.collectorIp + ":" + this.collectorAgentPort, grpc.credentials.createInsecure(), agentBuilder.build())
  }

  agentClientOptionsBuilder() {
    return this.headersOptionsBuilder()
      .addInterceptor(socketIdInterceptor)
      .addInterceptor(grpcBuiltInRetryHeaderInterceptor)
  }

  initializeMetadataClients() {
    const metadataBuilder = this.metadataClientOptionsBuilder()

    if (this.config && this.config.grpcServiceConfig && typeof this.config.grpcServiceConfig.getMetadata === 'function') {
      metadataBuilder.setGrpcServiceConfig(this.config.grpcServiceConfig.getMetadata())
    }
    this.metadataClient = new services.MetadataClient(this.collectorIp + ":" + this.collectorAgentPort, grpc.credentials.createInsecure(), metadataBuilder.build())
  }

  metadataClientOptionsBuilder() {
    return this.headersOptionsBuilder()
      .addInterceptor(grpcBuiltInRetryHeaderInterceptor)
  }

  headersOptionsBuilder() {
    const builder = new OptionsBuilder()
    this.interceptors.forEach(interceptor => builder.addInterceptor(interceptor))
    return builder
  }

  initializeSpanBatchSender() {
    const spanBatch = this.config.getSpanBatch()
    const address = this.collectorIp + ":" + this.collectorSpanPort
    this.uncompressedSpanClient = new services.SpanClient(address, grpc.credentials.createInsecure(), this.headersOptionsBuilder().build())
    this.spanClient = spanBatch.compression === 'gzip'
      ? new services.SpanClient(address, grpc.credentials.createInsecure(), this.headersOptionsBuilder().setCompression(spanBatch.compression).build())
      : this.uncompressedSpanClient
    this.spanBatchSender = new SpanBatchSender(this.spanClient, spanBatch, this.unaryDeadlineOptionsBuilder, this.logger, this.uncompressedSpanClient)
  }

  // A single agent stat of about 100 bytes does not shrink with gzip, so only URI stats go on the compressed stream.
  initializeStatsStreams() {
    const compression = this.config.getStatsCompression()
    const address = this.collectorIp + ":" + this.collectorStatsPort
    this.uncompressedStatsClient = new services.StatClient(address, grpc.credentials.createInsecure(), this.headersOptionsBuilder().build())
    this.statsClient = compression === 'gzip'
      ? new services.StatClient(address, grpc.credentials.createInsecure(), this.headersOptionsBuilder().setCompression(compression).build())
      : this.uncompressedStatsClient
    this.agentStatsStreamBuilder = new GrpcReadableStreamBuilder(this.uncompressedStatsClient, 'sendAgentStat')
    this.agentStatsStreamBuilder.setDeadlineOptionsBuilder(this.clientSideStreamDeadlineOptionsBuilder)
    this.uriStatsStreamBuilder = new GrpcReadableStreamBuilder(new StatsStreamClient(this.statsClient, this.uncompressedStatsClient), 'sendAgentStat')
    this.uriStatsStreamBuilder.setDeadlineOptionsBuilder(this.clientSideStreamDeadlineOptionsBuilder)
  }

  initializePingStream() {
    this.pingStream = new GrpcReadableStreamBuilder(this.agentClient, 'pingSession')
                          .setWritableStreamWritableAndEnded({
                            writable: (writableStream) => {
                              return writableStream?.writable === true && writableStream?.readable === true
                            },
                            ended: (writableStream) => {
                              return writableStream.writableEnded === true && writableStream.readableEnded === true
                            }
                          })
                          .build()
  }

  initializeAgentInfoScheduler() {
    if (this.agentInfoDailyScheduler) {
      this.agentInfoDailyScheduler.stop()
    }

    this.agentInfoDailyScheduler = new Scheduler(this.agentInfoRefreshInterval())
  }

  agentInfoRefreshInterval() {
    return DEFAULT_AGENT_INFO_REFRESH_INTERVAL_MS
  }

  initializeProfilerClients() {
    const profilerBuilder = this.headersOptionsBuilder()

    this.profilerClient = new services.ProfilerCommandServiceClient(this.collectorIp + ":" + this.collectorAgentPort, grpc.credentials.createInsecure(), profilerBuilder.build())
  }

  sendAgentInfo(agentInfo, callback) {
    const pAgentInfo = dataConvertor.convertAgentInfo(agentInfo)
    let options = this.unaryDeadlineOptionsBuilder.build()
    this.agentClient.requestAgentInfo(pAgentInfo, options, (err, response) => {
      if (err) {
        logError('sendAgentInfo err: ', err)
      }
      if (typeof callback === 'function') {
        callback(err, response)
      }
    })

    this.closeScheduler()
    if (this.agentInfoDailyScheduler) {
      this.removeJobForAgentInfo = this.agentInfoDailyScheduler.addJob(() => {
        options = this.unaryDeadlineOptionsBuilder.build()
        this.agentClient.requestAgentInfo(pAgentInfo, options, (err, response) => {
          if (err) {
            logError('sendAgentInfo err: ', err)
          }
          if (typeof callback === 'function') {
            callback(err, response)
          }
        })
      })
      this.agentInfoDailyScheduler.start()
    }
  }

  sendApiMetaInfo(apiMetaInfo, callback) {
    const pApiMetaData = dataConvertor.convertApiMetaInfo(apiMetaInfo)
    const options = this.unaryDeadlineOptionsBuilder.build()
    this.metadataClient.requestApiMetaData(pApiMetaData, options, (err, response) => {
      logError(err)
      if (callback) {
        callback(err, response)
      }
    })
  }

  sendStringMetaInfo(stringMetaInfo, callback) {
    const pStringMetaData = dataConvertor.convertStringMetaInfo(stringMetaInfo)
    const options = this.unaryDeadlineOptionsBuilder.build()
    this.metadataClient.requestStringMetaData(pStringMetaData, options, (err, response) => {
      logError(err)
      if (callback) {
        callback(err, response)
      }
    })
  }

  sendSqlMetaInfo(sqlMetaData, callback) {
    const pSqlMetaData = sqlMetaData.valueOfProtocolBuffer()
    const options = this.unaryDeadlineOptionsBuilder.build()
    this.metadataClient.requestSqlMetaData(pSqlMetaData, options, (err, response) => {
      logError(err)
      if (callback) {
        callback(err, response)
      }
    })
  }

  sendSqlUidMetaData(sqlMetaData, callback) {
    const pSqlMetaData = sqlMetaData.valueOfProtocolBuffer()
    const options = this.unaryDeadlineOptionsBuilder.build()
    this.metadataClient.requestSqlUidMetaData(pSqlMetaData, options, (err, response) => {
      logError(err)
      if (callback) {
        callback(err, response)
      }
    })
  }

  sendExceptionMetaData(exceptionMetaData) {
    const pExceptionMetaData = exceptionMetaData.valueOfProtocolBuffer()
    const options = this.unaryDeadlineOptionsBuilder.build()
    this.metadataClient.requestExceptionMetaData(pExceptionMetaData, options, (err) => {
      logError(err)
    })
  }

  sendSpan(span) {
    this.spanBatchSender.push(span)
  }

  sendSpanChunk(spanChunk) {
    this.spanBatchSender.push(spanChunk)
  }

  sendAgentStats(stats) {
    try {
      if (!this.agentStatsStream) {
        this.agentStatsStream = this.agentStatsStreamBuilder.build()
      }
      this.agentStatsStream.push(dataConvertor.convertStat(stats))
    } catch (e) {
      if (e && e.stack) {
        this.logger.error('sendAgentStats(stats) Error: ', e)
      }
    }
  }

  sendUriStats(snapshot) {
    try {
      if (!this.uriStatsStream) {
        this.uriStatsStream = this.uriStatsStreamBuilder.build()
      }
      this.uriStatsStream.push(snapshot.toProtocolBuffer())
    } catch (e) {
      if (e && e.stack) {
        this.logger.error('sendUriStats(snapshot) Error: ', e)
      }
    }
  }

  sendSupportedServicesCommand(callback) {
    if (!this.commandStream) {
      this.makeCommandStream(callback)
    }

    const pCmdMessage = CommandType.supportedServicesCommandMessage()
    if (this.logger.isDebug()) {
      this.logger.debug(`sendControlHandshake pCmdMessage: `, pCmdMessage.toObject())
    }
    this.commandStream.push(pCmdMessage)
  }

  makeCommandStream(callback) {
    this.commandStream = new GrpcReadableStream(() => {
      const writable = this.profilerClient.handleCommand()

      writable.on('data', (cmdRequest) => {
        const requestId = cmdRequest.getRequestid()
        const command = cmdRequest.getCommandCase()
        CommandType.valueOf(command).send({
          'ECHO': () => {
            const response = new cmdMessages.PCmdResponse()
            response.setResponseid(requestId)
            response.setStatus(0)
            const stringValue = new wrappers.StringValue()
            stringValue.setValue('')
            response.setMessage(stringValue) // error message

            const cmdEchoResponse = new cmdMessages.PCmdEchoResponse()
            cmdEchoResponse.setCommonresponse(response)
            const message = cmdRequest.getCommandecho().getMessage()
            cmdEchoResponse.setMessage(message)

            this.sendCommandEcho(cmdEchoResponse, callback)
          },
          // ActiveThreadCountStreamSocket.java
          'ACTIVE_THREAD_COUNT': async () => {
            let activeThreadCountSequenceId = 0
            let breakHistogramInterval = false
            const activeThreadCountStream = new GrpcReadableStream(() => {
              return this.profilerClient.commandStreamActiveThreadCount((err, response) => {
                logError('activeThreadCountStream err: ', err)
                activeThreadCountStream.end()
                breakHistogramInterval = true
                if (callback) {
                  callback(err, response)
                }
              })
            }, { name: 'activeThreadCountStream' })

            for await (const responseId of setInterval(1000, requestId)) {
              if (breakHistogramInterval) {
                break
              }

              const commonStreamResponse = new cmdMessages.PCmdStreamResponse()
              commonStreamResponse.setResponseid(responseId)
              commonStreamResponse.setSequenceid(++activeThreadCountSequenceId)
              const stringValue = new wrappers.StringValue()
              stringValue.setValue('')
              commonStreamResponse.setMessage(stringValue)

              const commandActiveThreadCountResponse = new cmdMessages.PCmdActiveThreadCountRes()
              commandActiveThreadCountResponse.setCommonstreamresponse(commonStreamResponse)
              commandActiveThreadCountResponse.setHistogramschematype(2)

              const histogram = activeRequestRepository.getCurrentActiveTraceHistogram()
              histogram.histogramValues().forEach((value) => {
                commandActiveThreadCountResponse.addActivethreadcount(value)
              })
              commandActiveThreadCountResponse.setTimestamp(Date.now())

              activeThreadCountStream.push(commandActiveThreadCountResponse)
            }
          }
        })
      })
      return writable
    })
  }

  sendCommandEcho(commandEchoResponse, callback) {
    let options = this.unaryDeadlineOptionsBuilder.build()
    this.profilerClient.commandEcho(commandEchoResponse, options, (err, response) => {
      if (err) {
        this.logger.error(err)
      }
      if (callback) {
        callback(err, response)
      }
    })
  }

  sendPing() {
    try {
      const pPing = dataConvertor.convertPing()
      this.pingStream.push(pPing)
    } catch (e) {
      logError('sendPing(ping) Error: ', e)
    }
  }

  closeScheduler() {
    if (this.removeJobForAgentInfo && typeof this.removeJobForAgentInfo === 'function') {
      this.removeJobForAgentInfo()
    }
    if (this.agentInfoDailyScheduler) {
      this.agentInfoDailyScheduler.stop()
    }
  }
}

module.exports = GrpcDataSender