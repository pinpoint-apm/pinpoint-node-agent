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

    this.spanClient = new services.SpanClient(
      collectorIp + ":" + collectorSpanPort,
      grpc.credentials.createInsecure(), {
        interceptors: [headerInterceptor]
      }
    )
  }

  sendAgentInfo(agentInfo) {
    const pAgentInfo = dataConvertor.convertAgentInfo(agentInfo)
    this.agentClient.requestAgentInfo(pAgentInfo, (err, response) => {
      //TODO handle response
      log.debug('response', response, err)
    })
  }

  sendApiMetaInfo(apiMetaInfo) {
    const pApiMetaData = dataConvertor.convertApiMetaInfo(apiMetaInfo)
    this.metadataClient.requestApiMetaData(pApiMetaData, (err, response) => {
      //TODO handle response
      log.debug('response', response, err)
    })
  }

  sendStringMetaInfo(stringMetaInfo) {
    const pStringMetaData = dataConvertor.convertStringMetaInfo(stringMetaInfo)
    this.metadataClient.requestStringMetaData(pStringMetaData, (err, response) => {
      //TODO handle response
      log.debug('response', response, err)
    })
  }

  sendSpan(span) {
    const pSpan = dataConvertor.convertSpan(span)
    this.spanClient.sendSpan(pSpan, (err, response) => {
      //TODO handle response
      log.debug('stream response', response, err)
    })
  }

  sendSpanChunk(spanChunk) {
    const pSpanChunk = dataConvertor.convertSpanChunk(spanChunk)
    this.spanClient.sendSpan(pSpanChunk, (err, response) => {
      if (err) {
        log.error(err)
      }
    })
  }
}

module.exports = GrpcDataSender