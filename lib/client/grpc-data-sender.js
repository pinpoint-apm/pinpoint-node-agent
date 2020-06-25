'use strict'

const grpc = require('grpc')
const log = require('../utils/logger')
const services = require('../data/grpc/Service_grpc_pb')
const dataConvertor = require('../data/grpc-data-convertor')
const AgentInfo = require('../data/dto/agent-info')
const TypedValue = require('../data/typed-value')

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

    this.agentClient = new services.AgentClient(
      collectorIp + ":" + collectorTcpPort,
      grpc.credentials.createInsecure(), {
        interceptors: [headerInterceptor]
      }
    )

    this.metadataClient = new services.MetadataClient(
      collectorIp + ":" + collectorTcpPort,
      grpc.credentials.createInsecure(), {
        interceptors: [headerInterceptor]
      }
    )

    this.profilerCommandClient = new services.ProfilerCommandServiceClient(
      collectorIp + ":" + collectorTcpPort,
      grpc.credentials.createInsecure(), {
        interceptors: [headerInterceptor]
      }
    )

    this.spanClient = new services.SpanClient(
      collectorIp + ":" + collectorSpanPort,
      grpc.credentials.createInsecure(), {
        interceptors: [headerInterceptor]
      }
    )

    this.statClient = new services.StatClient(
      collectorIp + ":" + collectorStatPort,
      grpc.credentials.createInsecure(), {
        interceptors: [headerInterceptor]
      }
    )
  }

  sendAgentInfo(agentInfo) {
    const pAgentInfo = dataConvertor.convertAgentInfo(agentInfo)
    this.agentClient.requestAgentInfo(pAgentInfo, (err, response) => {
      if (err) {
        log.error(err)
      }
      // log.debug('GrpcDataSender.sendAgentInfo response', response, err)
    })
  }

  sendApiMetaInfo(apiMetaInfo) {
    const pApiMetaData = dataConvertor.convertApiMetaInfo(apiMetaInfo)
    log.debug(`sendApiMetaInfo apiMetaInfo: ${JSON.stringify(apiMetaInfo)}`)
    log.debug(`sendApiMetaInfo pApiMetaData: ${JSON.stringify(pApiMetaData)}`)
    this.metadataClient.requestApiMetaData(pApiMetaData, (err, response) => {
      if (err) {
        log.error(err)
      }
    })
  }

  sendStringMetaInfo(stringMetaInfo) {
    const pStringMetaData = dataConvertor.convertStringMetaInfo(stringMetaInfo)
    this.metadataClient.requestStringMetaData(pStringMetaData, (err, response) => {
      if (err) {
        log.error(err)
      }
    })
  }

  sendSpan(span) {
    const pSpan = span.spanMessage
    log.debug(`sendSpan pSpan: ${JSON.stringify(pSpan.toObject())}`)
    var call = this.spanClient.sendSpan((err, response) => {
      if (err) {
        log.error(err)
      }
    })
    call.write(pSpan)
    call.end()
  }

  sendSpanChunk(spanChunk) {
    const pSpanChunk = spanChunk.spanMessage
    log.debug(`sendSpanChunk pSpanChunk: ${JSON.stringify(pSpanChunk.toObject())}`)
    var call = this.spanClient.sendSpan((err, response) => {
      if (err) {
        log.error(err)
      }
    })
    call.write(pSpanChunk)
    call.end()
  }

  sendStats(stats) {

  }

  sendControlHandshake(params) {
    const pCmdMessage = dataConvertor.convertCmdMessage(params)
    var call = this.profilerCommandClient.handleCommand((err, response) => {
      if (err) {
        log.error(err)
      }
    })
    call.write(pCmdMessage)
    call.end()
  }
}

module.exports = GrpcDataSender