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

// DEFAULT_CLIENT_REQUEST_TIMEOUT in GrpcTransportConfig.java
const DEFAULT_CLIENT_REQUEST_TIMEOUT = 6000

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
    }
    )

    this.metadataClient = new services.MetadataClient(collectorIp + ":" + collectorTcpPort, grpc.credentials.createInsecure(), { interceptors: [headerInterceptor] })
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

  sendAgentInfo(agentInfo, callback) {
    const pAgentInfo = dataConvertor.convertAgentInfo(agentInfo)
    if (log.isDebug()) {
      log.debug(`sendAgentInfo pAgentInfo: ${JSON.stringify(pAgentInfo.toObject())}`)
    }
    const deadline = this.getDeadline()
    this.agentClient.requestAgentInfo(pAgentInfo, { deadline }, (err, response) => {
      if (err) {
        log.error(`requestAgentInfo err: ${err}`)
      }
      if (callback) {
        callback(err, response)
      }
    })
  }

  getDeadline() {
    const deadline = new Date()
    deadline.setMilliseconds(deadline.getMilliseconds() + DEFAULT_CLIENT_REQUEST_TIMEOUT)
    return deadline
  }

  sendApiMetaInfo(apiMetaInfo, callback) {
    const pApiMetaData = dataConvertor.convertApiMetaInfo(apiMetaInfo)
    if (log.isDebug()) {
      log.debug(`sendApiMetaInfo pApiMetaData: ${JSON.stringify(pApiMetaData.toObject())}`)
    }
    const deadline = this.getDeadline()
    this.metadataClient.requestApiMetaData(pApiMetaData, { deadline }, (err, response) => {
      if (err) {
        log.error(err)
      }
      if (callback) {
        callback(err, response)
      }
    })
  }

  sendStringMetaInfo(stringMetaInfo) {
    const pStringMetaData = dataConvertor.convertStringMetaInfo(stringMetaInfo)
    if (log.isDebug()) {
      log.debug(`sendStringMetaInfo pStringMetaData: ${JSON.stringify(pStringMetaData.toObject())}`)
    }
    this.metadataClient.requestStringMetaData(pStringMetaData, (err, response) => {
      if (err) {
        log.error(err)
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