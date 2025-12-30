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
const makeAgentInformationMetadataInterceptor = require('./interceptor/make-agent-information-metadata-interceptor')
const socketIdInterceptor = require('./interceptor/socketid-interceptor')
const grpcBuiltInRetryHeaderInterceptor = require('./interceptor/grpc-built-in-retry-header-interceptor')
const OptionsBuilder = require('./retry/options-builder')
const CommandType = require('./command/command-type')
const GrpcReadableStream = require('./grpc-readable-stream')
const cmdMessages = require('../data/v1/Cmd_pb')
const wrappers = require('google-protobuf/google/protobuf/wrappers_pb')
const activeRequestRepository = require('../metric/active-request-repository')
const { setInterval } = require('node:timers/promises')
const { initializeLogger, logError } = require('./grpc-errors')
const StreamDeadlineOptionsBuilder = require('./stream-deadline-options-builder')
const GrpcReadableStreamBuilder = require('./grpc-readable-stream-builder')
const UnaryDeadlineOptionsBuilder = require('./unary-deadline-options-builder')
const { LogBuilder } = require('../utils/log/log-builder')

// AgentInfoSender.java
// refresh daily
const DEFAULT_AGENT_INFO_REFRESH_INTERVAL_MS = 24 * 60 * 60 * 1000

class GrpcDataSender {
  constructor(collectorIp, collectorTcpPort, collectorStatPort, collectorSpanPort, agentInfo, config) {
    this.agentInfo = agentInfo
    this.config = config
    this.collectorIp = collectorIp
    this.collectorTcpPort = collectorTcpPort
    this.collectorStatPort = collectorStatPort
    this.collectorSpanPort = collectorSpanPort
    this.logger = log.getLogger(LogBuilder.buildGrpcLog(config))
    initializeLogger(this.logger)

    this.unaryDeadlineOptionsBuilder = new UnaryDeadlineOptionsBuilder()
    this.initializeClients()
    this.initializeMetadataClients()
    this.initializePingStream()
    this.initializeAgentInfoScheduler()
    this.initializeProfilerClients(collectorIp, collectorTcpPort, config)

    this.clientSideStreamDeadlineOptionsBuilder = new StreamDeadlineOptionsBuilder(config)
    this.initializeSpanStream(collectorIp, collectorSpanPort, config)
    this.initializeStatStream(collectorIp, collectorStatPort, config)
  }

  close() {
    this.closeScheduler()
    if (this.spanStream) {
      this.spanStream.end()
    }
    if (this.statStream) {
      this.statStream.end()
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
    if (this.statClient) {
      this.statClient.close()
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
    this.agentClient = new services.AgentClient(this.collectorIp + ":" + this.collectorTcpPort, grpc.credentials.createInsecure(), agentBuilder.build())
  }

  agentClientOptionsBuilder() {
    return new OptionsBuilder()
      .addInterceptor(makeAgentInformationMetadataInterceptor(this.agentInfo))
      .addInterceptor(socketIdInterceptor)
      .addInterceptor(grpcBuiltInRetryHeaderInterceptor)
  }

  initializeMetadataClients() {
    const metadataBuilder = this.metadataClientOptionsBuilder()

    if (this.config && this.config.grpcServiceConfig && typeof this.config.grpcServiceConfig.getMetadata === 'function') {
      metadataBuilder.setGrpcServiceConfig(this.config.grpcServiceConfig.getMetadata())
    }
    this.metadataClient = new services.MetadataClient(this.collectorIp + ":" + this.collectorTcpPort, grpc.credentials.createInsecure(), metadataBuilder.build())
  }

  metadataClientOptionsBuilder() {
    return new OptionsBuilder()
      .addInterceptor(makeAgentInformationMetadataInterceptor(this.agentInfo))
      .addInterceptor(grpcBuiltInRetryHeaderInterceptor)
  }

  initializeSpanStream() {
    this.spanClient = new services.SpanClient(this.collectorIp + ":" + this.collectorSpanPort, grpc.credentials.createInsecure(), { interceptors: [makeAgentInformationMetadataInterceptor(this.agentInfo)] })

    this.spanStreamBuilder = new GrpcReadableStreamBuilder(this.spanClient, 'sendSpan')
    this.spanStreamBuilder.setDeadlineOptionsBuilder(this.clientSideStreamDeadlineOptionsBuilder)
  }

  initializeStatStream(collectorIp, collectorStatPort) {
    this.statClient = new services.StatClient(collectorIp + ":" + collectorStatPort, grpc.credentials.createInsecure(), { interceptors: [makeAgentInformationMetadataInterceptor(this.agentInfo)] })

    this.statStreamBuilder = new GrpcReadableStreamBuilder(this.statClient, 'sendAgentStat')
    this.statStreamBuilder.setDeadlineOptionsBuilder(this.clientSideStreamDeadlineOptionsBuilder)
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

  initializeProfilerClients(collectorIp, collectorTcpPort) {
    const profilerBuilder = new OptionsBuilder()
      .addInterceptor(makeAgentInformationMetadataInterceptor(this.agentInfo))

    this.profilerClient = new services.ProfilerCommandServiceClient(collectorIp + ":" + collectorTcpPort, grpc.credentials.createInsecure(), profilerBuilder.build())
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

  sendSpan(span) {
    try {
      const pSpan = span.toProtocolBuffer()

      if (!this.spanStream) {
        this.spanStream = this.spanStreamBuilder.build()
      }
      this.spanStream.push(pSpan)
    } catch (e) {
      logError('sendSpan(span) Error: ', e)
    }
  }

  sendSpanChunk(spanChunk) {
    try {
      const pSpanChunk = spanChunk.toProtocolBuffer()

      if (!this.spanStream) {
        this.spanStream = this.spanStreamBuilder.build()
      }
      this.spanStream.push(pSpanChunk)
    } catch (e) {
      if (e && e.stack) {
        this.logger.error(`sendSpanChunk(spanChunk) Error: ${e.stack}`)
      }
    }
  }

  sendStat(stat) {
    try {
      const pStatMessage = dataConvertor.convertStat(stat)

      if (!this.statStream) {
        this.statStream = this.statStreamBuilder.build()
      }
      this.statStream.push(pStatMessage)
    } catch (e) {
      if (e && e.stack) {
        this.logger.error('sendStat(stat) Error: ', e)
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