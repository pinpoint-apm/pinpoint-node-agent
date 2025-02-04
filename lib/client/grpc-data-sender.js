/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const grpc = require('@grpc/grpc-js')
const log = require('../utils/logger')
const services = require('../data/v1/Service_grpc_pb')
const dataConvertor = require('../data/grpc-data-convertor')
const GrpcBidirectionalStream = require('./grpc-bidirectional-stream')
const GrpcClientSideStream = require('./grpc-client-side-stream')
const Scheduler = require('../utils/scheduler')
const makeAgentInformationMetadataInterceptor = require('./interceptor/make-agent-information-metadata-interceptor')
const socketIdInterceptor = require('./interceptor/socketid-interceptor')
const grpcBuiltInRetryHeaderInterceptor = require('./interceptor/grpc-built-in-retry-header-interceptor')
const CallArgumentsBuilder = require('./call-arguments-builder')
const OptionsBuilder = require('./retry/options-builder')
const CommandType = require('./command/command-type')
const GrpcReadableStream = require('./grpc-readable-stream')
const cmdMessages = require('../data/v1/Cmd_pb')
const wrappers = require('google-protobuf/google/protobuf/wrappers_pb')

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

    this.initializeClients()
    this.initializeMetadataClients()
    this.initializeSpanStream(collectorIp, collectorSpanPort, config)
    this.initializeStatStream(collectorIp, collectorStatPort, config)
    this.initializePingStream()
    this.initializeAgentInfoScheduler()
    this.initializeProfilerClients(collectorIp, collectorTcpPort, config)
  }

  close() {
    this.closeScheduler()
    if (this.spanStream) {
      this.spanStream.grpcStream.end()
    }
    if (this.statStream) {
      this.statStream.grpcStream.end()
    }
    if (this.pingStream) {
      this.pingStream.grpcStream.end()
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
    if (this.activeThreadCountStream) {
      this.activeThreadCountStream.end()
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

  initializeSpanStream(collectorIp, collectorSpanPort, config) {
    this.spanClient = new services.SpanClient(collectorIp + ":" + collectorSpanPort, grpc.credentials.createInsecure(), { interceptors: [makeAgentInformationMetadataInterceptor(this.agentInfo)] })

    this.spanStream = new GrpcClientSideStream('spanStream', this.spanClient, this.spanClient.sendSpan)
    if (config && config.streamDeadlineMinutesClientSide) {
      this.spanStream.setDeadlineMinutes(config.streamDeadlineMinutesClientSide)
    }
  }

  initializeStatStream(collectorIp, collectorStatPort, config) {
    this.statClient = new services.StatClient(collectorIp + ":" + collectorStatPort, grpc.credentials.createInsecure(), { interceptors: [makeAgentInformationMetadataInterceptor(this.agentInfo)] })

    this.statStream = new GrpcClientSideStream('statStream', this.statClient, this.statClient.sendAgentStat)
    if (config && config.streamDeadlineMinutesClientSide) {
      this.statStream.setDeadlineMinutes(config.streamDeadlineMinutesClientSide)
    }
  }

  initializePingStream() {
    this.pingStream = new GrpcBidirectionalStream('pingStream', this.agentClient, this.agentClient.pingSession)
  }

  initializeAgentInfoScheduler() {
    if (this.agentInfoDailyScheduler) {
      this.agentInfoDailyScheduler.stop()
    }

    this.agentInfoDailyScheduler = new Scheduler(this.agentInfoRefreshInterval())
  }

  initializeProfilerClients(collectorIp, collectorTcpPort) {
    const profilerBuilder = new OptionsBuilder()
      .addInterceptor(makeAgentInformationMetadataInterceptor(this.agentInfo))

    this.profilerClient = new services.ProfilerCommandServiceClient(collectorIp + ":" + collectorTcpPort, grpc.credentials.createInsecure(), profilerBuilder.build())
  }

  makeCommandStream(callArguments) {
    this.commandStream = new GrpcReadableStream(() => {
      const writable = this.profilerClient.handleCommand()

      let activeThreadCountSequenceId = 0
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

            this.sendCommandEcho(cmdEchoResponse, callArguments)
          },
          // ActiveThreadCountStreamSocket.java
          'ACTIVE_THREAD_COUNT': () => {
            const commonStreamResponse = new cmdMessages.PCmdStreamResponse()
            commonStreamResponse.setResponseid(requestId)
            commonStreamResponse.setSequenceid(++activeThreadCountSequenceId)
            const stringValue = new wrappers.StringValue()
            stringValue.setValue('')
            commonStreamResponse.setMessage(stringValue)

            const commandActiveThreadCountResponse = new cmdMessages.PCmdActiveThreadCountRes()
            commandActiveThreadCountResponse.setCommonstreamresponse(commonStreamResponse)
            commandActiveThreadCountResponse.setHistogramschematype(2)
            commandActiveThreadCountResponse.addActivethreadcount(1)
            commandActiveThreadCountResponse.setTimestamp(Date.now())

            this.sendActiveThreadCount(commandActiveThreadCountResponse, callArguments)
          }
        })
      })
      return writable
    })
  }

  makeActiveThreadCountStream(callArguments) {
    this.activeThreadCountStream = new GrpcReadableStream(() => {
      callArguments = guardCallArguments(callArguments)
      let options = callArguments.getOptions()
      const callback = callArguments.getCallback()
      return this.profilerClient.commandStreamActiveThreadCount(options, (err, response) => {
        if (err) {
          log.error('makeActiveThreadCountStream err: ', err)
        }
        if (callback) {
          callback(err, response)
        }
      })
    })
  }

  agentInfoRefreshInterval() {
    return DEFAULT_AGENT_INFO_REFRESH_INTERVAL_MS
  }

  sendAgentInfo(agentInfo, callArguments) {
    const pAgentInfo = dataConvertor.convertAgentInfo(agentInfo)
    if (log.isDebug()) {
      log.debug(`sendAgentInfo pAgentInfo: ${pAgentInfo}`)
    }

    callArguments = guardCallArguments(callArguments)
    let options = callArguments.getOptions()
    const callback = callArguments.getCallback()
    this.agentClient.requestAgentInfo(pAgentInfo, options, (err, response) => {
      if (typeof callback === 'function') {
        callback(err, response)
      }
    })

    this.closeScheduler()
    if (this.agentInfoDailyScheduler) {
      this.removeJobForAgentInfo = this.agentInfoDailyScheduler.addJob(() => {
        options = callArguments.getOptions()
        this.agentClient.requestAgentInfo(pAgentInfo, options, (err, response) => {
          if (typeof callback === 'function') {
            callback(err, response)
          }
        })
      })
      this.agentInfoDailyScheduler.start()
    }
  }

  sendApiMetaInfo(apiMetaInfo, callArguments) {
    const pApiMetaData = dataConvertor.convertApiMetaInfo(apiMetaInfo)
    if (log.isDebug()) {
      log.debug(`sendApiMetaInfo pApiMetaData: ${JSON.stringify(pApiMetaData.toObject())}`)
    }

    callArguments = guardCallArguments(callArguments)
    const options = callArguments.getOptions()
    const callback = callArguments.getCallback()
    this.metadataClient.requestApiMetaData(pApiMetaData, options, (err, response) => {
      if (err) {
        log.error(err)
      }
      if (callback) {
        callback(err, response)
      }
    })
  }

  sendStringMetaInfo(stringMetaInfo, callArguments) {
    const pStringMetaData = dataConvertor.convertStringMetaInfo(stringMetaInfo)
    if (log.isDebug()) {
      log.debug(`sendStringMetaInfo pStringMetaData: ${JSON.stringify(pStringMetaData.toObject())}`)
    }

    callArguments = guardCallArguments(callArguments)
    let options = callArguments.getOptions()
    const callback = callArguments.getCallback()
    this.metadataClient.requestStringMetaData(pStringMetaData, options, (err, response) => {
      if (err) {
        log.error(err)
      }
      if (callback) {
        callback(err, response)
      }
    })
  }

  sendSqlMetaInfo(sqlMetaData, callArguments) {
    const pSqlMetaData = sqlMetaData.valueOfProtocolBuffer()
    if (log.isDebug()) {
      log.debug(`sendSqlMetaInfo sqlMetaData: ${JSON.stringify(pSqlMetaData.toObject())}`)
    }
    callArguments = guardCallArguments(callArguments)
    let options = callArguments.getOptions()
    const callback = callArguments.getCallback()
    this.metadataClient.requestSqlMetaData(pSqlMetaData, options, (err, response) => {
      if (err) {
        log.error(err)
      }
      if (callback) {
        callback(err, response)
      }
    })
  }

  sendSqlUidMetaData(sqlMetaData, callArguments) {
    const pSqlMetaData = sqlMetaData.valueOfProtocolBuffer()
    if (log.isDebug()) {
      log.debug(`sendSqlMetaInfo sqlMetaData: ${JSON.stringify(pSqlMetaData.toObject())}`)
    }
    callArguments = guardCallArguments(callArguments)
    let options = callArguments.getOptions()
    const callback = callArguments.getCallback()
    this.metadataClient.requestSqlUidMetaData(pSqlMetaData, options, (err, response) => {
      if (err) {
        log.error(err)
      }
      if (callback) {
        callback(err, response)
      }
    })
  }

  sendSpan(span) {
    try {
      const pSpan = span.toProtocolBuffer()
      if (log.isDebug()) {
        log.debug(`sendSpan pSpan: ${pSpan}`)
      }
      this.spanStream.write(pSpan)
    } catch (e) {
      if (e && e.stack) {
        log.error(`sendSpan(span) Error: ${e.stack}`)
      }
    }
  }

  sendSpanChunk(spanChunk) {
    try {
      const pSpanChunk = spanChunk.toProtocolBuffer()
      if (log.isDebug()) {
        log.debug(`sendSpanChunk spanChunk: ${JSON.stringify(spanChunk)}`)
      }
      this.spanStream.write(pSpanChunk)
    } catch (e) {
      if (e && e.stack) {
        log.error(`sendSpanChunk(spanChunk) Error: ${e.stack}`)
      }
    }
  }

  sendStat(stat) {
    try {
      const pStatMessage = dataConvertor.convertStat(stat)
      if (log.isDebug()) {
        log.debug(`sendStats pStatMessage: ${stat}`)
      }
      this.statStream.write(pStatMessage)
    } catch (e) {
      if (e && e.stack) {
        log.error(`sendStat(stat) Error: ${e.stack}`)
      }
    }
  }

  sendSupportedServicesCommand(callArguments) {
    if (!this.commandStream) {
      this.makeCommandStream(callArguments)
    }

    const pCmdMessage = CommandType.supportedServicesCommandMessage()
    if (log.isDebug()) {
      log.debug(`sendControlHandshake pCmdMessage: ${JSON.stringify(pCmdMessage.toObject())}`)
    }
    this.commandStream.push(pCmdMessage)
  }

  sendCommandEcho(commandEchoResponse, callArguments) {
    callArguments = guardCallArguments(callArguments)
    let options = callArguments.getOptions()
    const callback = callArguments.getCallback()
    this.profilerClient.commandEcho(commandEchoResponse, options, (err, response) => {
      if (err) {
        log.error(err)
      }
      if (callback) {
        callback(err, response)
      }
    })
  }

  sendActiveThreadCount(commandActiveThreadCountResponse, callArguments) {
    if (!this.activeThreadCountStream) {
      this.makeActiveThreadCountStream(callArguments)
    }
    this.activeThreadCountStream.push(commandActiveThreadCountResponse)
  }

  sendPing() {
    const pPing = dataConvertor.convertPing()
    if (log.isDebug()) {
      log.debug(`sendPing pPing: ${JSON.stringify(pPing.toObject())}`)
    }
    this.pingStream.write(pPing)
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

function guardCallArguments(callArguments) {
  if (!callArguments) {
    return CallArgumentsBuilder.emptyCallArguments()
  }

  if (typeof callArguments === 'function') {
    return new CallArgumentsBuilder(callArguments).build()
  }

  return callArguments
}
