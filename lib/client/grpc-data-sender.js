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
const makeAgentInformationMetadataInterceptor = require('./grpc/make-agent-information-metadata-interceptor')
const socketIdInterceptor = require('./grpc/socketid-interceptor')
const CallArgumentsBuilder = require('./call-arguments-builder')
const OptionsBuilder = require('./grpc/options-builder')

// AgentInfoSender.java
// refresh daily
const DEFAULT_AGENT_INFO_REFRESH_INTERVAL_MS = 24 * 60 * 60 * 1000
// retry every 3 seconds
const DEFAULT_AGENT_INFO_SEND_INTERVAL_MS = 3 * 1000
// retry 3 times per attempt
const DEFAULT_MAX_TRY_COUNT_PER_ATTEMPT = 3

// in GrpcTransportConfig.java
const DEFAULT_METADATA_RETRY_MAX_COUNT = 3
const DEFAULT_METADATA_RETRY_DELAY_MILLIS = 1000

class GrpcDataSender {
  constructor(collectorIp, collectorTcpPort, collectorStatPort, collectorSpanPort, agentInfo, config) {
    this.agentInfo = agentInfo
    this.initializeClients(collectorIp, collectorTcpPort, config)
    this.initializeMetadataClients(collectorIp, collectorTcpPort, config)
    this.initializeSpanStream(collectorIp, collectorSpanPort, config)
    this.initializeStatStream(collectorIp, collectorStatPort, config)
    this.initializePingStream()
    this.initializeAgentInfoScheduler()
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
  }

  initializeClients(collectorIp, collectorTcpPort, config) {
    const agentBuilder = new OptionsBuilder()
      .addInterceptor(makeAgentInformationMetadataInterceptor(this.agentInfo))  
      .addInterceptor(socketIdInterceptor)

    if (config && config.grpcServiceConfig && typeof config.grpcServiceConfig.getAgentServiceConfig === 'function') {
      agentBuilder.setGrpcServiceConfig(config.grpcServiceConfig.getAgentServiceConfig())
    }
    this.agentClient = new services.AgentClient(collectorIp + ":" + collectorTcpPort, grpc.credentials.createInsecure(), agentBuilder.build())
  }

  initializeMetadataClients(collectorIp, collectorTcpPort, config) {
    const metadataBuilder = new OptionsBuilder()
      .addInterceptor(makeAgentInformationMetadataInterceptor(this.agentInfo))

    if (config && config.grpcServiceConfig && typeof config.grpcServiceConfig.getMetadataServiceConfig === 'function') {
      metadataBuilder.setGrpcServiceConfig(config.grpcServiceConfig.getMetadataServiceConfig())
    }
    this.metadataClient = new services.MetadataClient(collectorIp + ":" + collectorTcpPort, grpc.credentials.createInsecure(), metadataBuilder.build())
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

  agentInfoRefreshInterval() {
    return DEFAULT_AGENT_INFO_REFRESH_INTERVAL_MS
  }

  sendAgentInfo(agentInfo, callArguments) {
    const pAgentInfo = dataConvertor.convertAgentInfo(agentInfo)
    if (log.isDebug()) {
      log.debug(`sendAgentInfo pAgentInfo: ${pAgentInfo}`)
    }

    callArguments = guardCallArguments(callArguments)
    const metadata = callArguments.getMetadata()
    let options = callArguments.getOptions()
    const callback = callArguments.getCallback()
    this.agentClient.requestAgentInfo(pAgentInfo, metadata, options, (err, response) => {
      if (typeof callback === 'function') {
        callback(err, response)
      }
    })

    this.closeScheduler()
    if (this.agentInfoDailyScheduler) {
      this.removeJobForAgentInfo = this.agentInfoDailyScheduler.addJob(() => {
        options = callArguments.getOptions()
        this.agentClient.requestAgentInfo(pAgentInfo, metadata, options, (err, response) => {
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
    const metadata = callArguments.getMetadata()
    let options = callArguments.getOptions()
    const callback = callArguments.getCallback()
    this.metadataClient.requestApiMetaData(pApiMetaData, metadata, options, (err, response) => {
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
    const metadata = callArguments.getMetadata()
    let options = callArguments.getOptions()
    const callback = callArguments.getCallback()
    this.metadataClient.requestStringMetaData(pStringMetaData, metadata, options, (err, response) => {
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
    const metadata = callArguments.getMetadata()
    let options = callArguments.getOptions()
    const callback = callArguments.getCallback()
    this.metadataClient.requestSqlMetaData(pSqlMetaData, metadata, options, (err, response) => {
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
    const metadata = callArguments.getMetadata()
    let options = callArguments.getOptions()
    const callback = callArguments.getCallback()
    this.metadataClient.requestSqlUidMetaData(pSqlMetaData, metadata, options, (err, response) => {
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
      const pSpan = span.spanMessage
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
      const pSpanChunk = spanChunk.spanMessage
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

  sendControlHandshake(params) {
    const pCmdMessage = dataConvertor.convertCmdMessage(params)
    if (log.isDebug()) {
      log.debug(`sendControlHandshake pCmdMessage: ${JSON.stringify(pCmdMessage.toObject())}`)
    }
    this.profilerStream.write(pCmdMessage)
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
    return CallArgumentsBuilder.emptyCallArguments
  }

  if (typeof callArguments === 'function') {
    return new CallArgumentsBuilder(callArguments).build()
  }

  return callArguments
}
