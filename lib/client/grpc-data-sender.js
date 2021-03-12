/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const grpc = require('@grpc/grpc-js')
const log = require('../utils/logger')
const services = require('../data/grpc/Service_grpc_pb')
const dataConvertor = require('../data/grpc-data-convertor')
const pingIdGenerator = require('../context/sequence-generator').pingIdGenerator
const GrpcBidirectionalStream = require('./grpc-bidirectional-stream')
const GrpcClientSideStream = require('./grpc-client-side-stream')
const GrpcUnaryRPC = require('./grpc-unary-rpc')
const Scheduler = require('../utils/scheduler')

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
  constructor(
    collectorIp,
    collectorTcpPort,
    collectorStatPort,
    collectorSpanPort,
    agentInfo
  ) {
    const headerInterceptor = function (options, nextCall) {
      return new grpc.InterceptingCall(nextCall(options), {
        start: function (metadata, listener, next) {
          metadata.add('agentid', agentInfo.agentId)
          metadata.add('applicationname', agentInfo.applicationName)
          metadata.add('starttime', String(agentInfo.agentStartTime))
          next(metadata, listener, next)
        },
      })
    }
    this.initializeClients(collectorIp, collectorTcpPort, headerInterceptor)
    this.initializeSpanStream(collectorIp, collectorSpanPort, headerInterceptor)
    this.initializeStatStream(collectorIp, collectorStatPort, headerInterceptor)
    this.initializePingStream()
    this.initializeAgentInfoScheduler()
  }

  initializeClients(collectorIp, collectorTcpPort, headerInterceptor) {
    this.agentClient = new services.AgentClient(
      collectorIp + ":" + collectorTcpPort,
      grpc.credentials.createInsecure(), {
      interceptors: [headerInterceptor, function (options, nextCall) {
        return new grpc.InterceptingCall(nextCall(options), {
          start: function (metadata, listener, next) {
            metadata.add('socketid', `${pingIdGenerator.next}`)
            next(metadata, listener, next)
          }
        })
      }]
    })
    this.requestAgentInfo = new GrpcUnaryRPC('requestAgentInfo', this.agentClient, this.agentClient.requestAgentInfo, DEFAULT_AGENT_INFO_SEND_INTERVAL_MS, DEFAULT_MAX_TRY_COUNT_PER_ATTEMPT)

    this.metadataClient = new services.MetadataClient(collectorIp + ":" + collectorTcpPort, grpc.credentials.createInsecure(), { interceptors: [headerInterceptor] })
    this.requestApiMetaData = new GrpcUnaryRPC('requestApiMetaData', this.metadataClient, this.metadataClient.requestApiMetaData, DEFAULT_METADATA_RETRY_DELAY_MILLIS, DEFAULT_METADATA_RETRY_MAX_COUNT)
    this.requestStringMetaData = new GrpcUnaryRPC('requestStringMetaData', this.metadataClient, this.metadataClient.requestStringMetaData, DEFAULT_METADATA_RETRY_DELAY_MILLIS, DEFAULT_METADATA_RETRY_MAX_COUNT)
  }

  initializeSpanStream(collectorIp, collectorSpanPort, headerInterceptor) {
    this.spanClient = new services.SpanClient(collectorIp + ":" + collectorSpanPort, grpc.credentials.createInsecure(), { interceptors: [headerInterceptor] })

    this.spanStream = new GrpcClientSideStream('spanStream', this.spanClient, this.spanClient.sendSpan)
  }

  initializeStatStream(collectorIp, collectorStatPort, headerInterceptor) {
    this.statClient = new services.StatClient(collectorIp + ":" + collectorStatPort, grpc.credentials.createInsecure(), { interceptors: [headerInterceptor] })

    this.statStream = new GrpcClientSideStream('statStream', this.statClient, this.statClient.sendAgentStat)
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

  sendAgentInfo(agentInfo, callback) {
    const pAgentInfo = dataConvertor.convertAgentInfo(agentInfo)
    if (log.isDebug()) {
      log.debug(`sendAgentInfo pAgentInfo: ${JSON.stringify(pAgentInfo.toObject())}`)
    }
    this.requestAgentInfo.request(pAgentInfo, (err, response) => {
      if (callback) {
        callback(err, response)
      }
    })

    if (this.removeJobForAgentInfo && typeof this.removeJobForAgentInfo === 'function') {
      this.removeJobForAgentInfo()
    }
    if (this.agentInfoDailyScheduler) {
      this.agentInfoDailyScheduler.stop()
    }
    this.removeJobForAgentInfo = this.agentInfoDailyScheduler.addJob(() => { 
      this.sendAgentInfo(agentInfo, callback) 
    })
    // this.agentInfoDailyScheduler.start()
  }

  sendApiMetaInfo(apiMetaInfo, callback) {
    const pApiMetaData = dataConvertor.convertApiMetaInfo(apiMetaInfo)
    if (log.isDebug()) {
      log.debug(`sendApiMetaInfo pApiMetaData: ${JSON.stringify(pApiMetaData.toObject())}`)
    }
    this.requestApiMetaData.request(pApiMetaData, (err, response) => {
      if (err) {
        log.error(err)
      }
      if (callback) {
        callback(err, response)
      }
    })
  }

  sendStringMetaInfo(stringMetaInfo, callback) {
    const pStringMetaData = dataConvertor.convertStringMetaInfo(stringMetaInfo)
    if (log.isDebug()) {
      log.debug(`sendStringMetaInfo pStringMetaData: ${JSON.stringify(pStringMetaData.toObject())}`)
    }
    this.requestStringMetaData.request(pStringMetaData, (err, response) => {
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
        log.debug(`sendSpan pSpan: ${JSON.stringify(pSpan.toObject())}`)
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
        log.debug(`sendSpanChunk pSpanChunk: ${JSON.stringify(pSpanChunk.toObject())}`)
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
        log.debug(`sendStats pStatMessage: ${JSON.stringify(stat)}`)
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
      log.debug(`sendPing pPing: ${JSON.stringify(pPing)}`)
    }
    this.pingStream.write(pPing)
  }
}

module.exports = GrpcDataSender