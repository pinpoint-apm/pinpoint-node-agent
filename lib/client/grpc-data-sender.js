/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const grpc = require('grpc')
const log = require('../utils/logger')
const services = require('../data/grpc/Service_grpc_pb')
const dataConvertor = require('../data/grpc-data-convertor')
const pingIdGenerator = require('../context/sequence-generator').pingIdGenerator
const GrpcStream = require('./grpc-stream')

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

    this.metadataClient = new services.MetadataClient(
      collectorIp + ":" + collectorTcpPort,
      grpc.credentials.createInsecure(), {
        interceptors: [headerInterceptor]
      }
    )
  }

  initializeProfilerStream(collectorIp, collectorTcpPort, headerInterceptor) {
  }

  initializeSpanStream(collectorIp, collectorSpanPort, headerInterceptor) {
    this.spanClient = new services.SpanClient(
      collectorIp + ":" + collectorSpanPort,
      grpc.credentials.createInsecure(), {
        interceptors: [headerInterceptor]
      }
    )
  }

  initializeStatStream(collectorIp, collectorStatPort, headerInterceptor) {
    this.statClient = new services.StatClient(
      collectorIp + ":" + collectorStatPort,
      grpc.credentials.createInsecure(), {
        interceptors: [headerInterceptor]
      }
    )

    this.statStream = new GrpcStream("statStream", () => {
      return this.statClient.sendAgentStat((err, response) => {
        if (err) {
          this.statStream.end()
          log.debug(`GrpcStream statStream callback err: ${err}`)
        }
      })
    })
  }

  initializePingStream() {
    this.pingStram = new GrpcStream('pingStream', () => {
      return this.agentClient.pingSession()
    })
  }

  sendAgentInfo(agentInfo) {
    const pAgentInfo = dataConvertor.convertAgentInfo(agentInfo)
    if (log.isDebug()) {
      log.debug(`sendAgentInfo pAgentInfo: ${JSON.stringify(pAgentInfo.toObject())}`)
    }
    this.agentClient.requestAgentInfo(pAgentInfo, (err, response) => {
      if (err) {
        log.error(err)
      }
    })
  }

  sendApiMetaInfo(apiMetaInfo) {
    const pApiMetaData = dataConvertor.convertApiMetaInfo(apiMetaInfo)
    if (log.isDebug()) {
      log.debug(`sendApiMetaInfo pApiMetaData: ${JSON.stringify(pApiMetaData.toObject())}`)
    }
    this.metadataClient.requestApiMetaData(pApiMetaData, (err, response) => {
      if (err) {
        log.error(err)
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
      const spanStream = new GrpcStream("spanStream", () => {
        return this.spanClient.sendSpan((err, response) => {
          if (err) {
            log.debug(`GrpcStream spanStream callback err: ${err}`)
          }
        })
      })
      spanStream.write(pSpan)
      spanStream.end()
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
    const pStatMessage = dataConvertor.convertStat(stat)
    if (log.isDebug()) {
      log.debug(`sendStats pStatMessage: ${JSON.stringify(stat)}`)
    }
    this.statStream.write(pStatMessage)
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
    this.pingStram.write(pPing)
  }
}

module.exports = GrpcDataSender