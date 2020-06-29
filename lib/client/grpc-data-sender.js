'use strict'

const grpc = require('grpc')
const log = require('../utils/logger')
const services = require('../data/grpc/Service_grpc_pb')
const dataConvertor = require('../data/grpc-data-convertor')
const AgentInfo = require('../data/dto/agent-info')
const TypedValue = require('../data/typed-value')
const pingIdGenerator = require('../context/sequence-generator').pingIdGenerator

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
    this.initializeClients(collectorIp, collectorTcpPort, collectorStatPort, collectorSpanPort, headerInterceptor)
    this.initializeProfilerStream(collectorIp, collectorTcpPort, headerInterceptor)
    this.initializeSpanStream(collectorIp, collectorSpanPort, headerInterceptor)
    this.initializeStatStream(collectorIp, collectorStatPort, headerInterceptor)
  }

  initializeClients(collectorIp, collectorTcpPort, collectorStatPort, collectorSpanPort, headerInterceptor) {
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
    this.profilerCommandClient = new services.ProfilerCommandServiceClient(
      collectorIp + ":" + collectorTcpPort,
      grpc.credentials.createInsecure(), {
        interceptors: [headerInterceptor]
      }
    )

    this.profilerStream = this.profilerCommandClient.handleCommand()
    this.profilerStream.on('data', function (cmdRequest) {
      log.debug(`sendControlHandshake on(data) : ${JSON.stringify(cmdRequest.toObject())}`)
    })
    this.profilerStream.on('end', function () {
      log.debug(`sendControlHandshake on(end)`)
    })
    this.profilerStream.on('error', function (e) {
      log.debug(`sendControlHandshake on(error): ${JSON.stringify(e)}`)
    })
    this.profilerStream.on('status', function (status) {
      log.debug(`sendControlHandshake on(status): ${JSON.stringify(status)}`)
    })
  }

  initializeSpanStream(collectorIp, collectorSpanPort, headerInterceptor) {
    this.spanClient = new services.SpanClient(
      collectorIp + ":" + collectorSpanPort,
      grpc.credentials.createInsecure(), {
        interceptors: [headerInterceptor]
      }
    )

    this.spanStream = this.spanClient.sendSpan((err, response) => {
      if (err) {
        log.error(err)
      }
    })
    this.spanStream.on('end', function () {
      log.debug(`spanStream on(end)`)
    })
    this.spanStream.on('error', function (e) {
      log.debug(`spanStream on(error): ${JSON.stringify(e)}`)
    })
    this.spanStream.on('status', function (status) {
      log.debug(`spanStream on(status): ${JSON.stringify(status)}`)
    })
  }

  initializeStatStream(collectorIp, collectorStatPort, headerInterceptor) {
    this.statClient = new services.StatClient(
      collectorIp + ":" + collectorStatPort,
      grpc.credentials.createInsecure(), {
        interceptors: [headerInterceptor]
      }
    )
    this.statStream = this.statClient.sendAgentStat((err, response) => {
      if (err) {
        log.error(err)
      }
    })
    this.statStream.on('end', function () {
      log.debug(`spanStream on(end)`)
    })
    this.statStream.on('error', function (e) {
      log.debug(`spanStream on(error): ${JSON.stringify(e)}`)
    })
    this.statStream.on('status', function (status) {
      log.debug(`spanStream on(status): ${JSON.stringify(status)}`)
    })
  }

  sendAgentInfo(agentInfo) {
    const pAgentInfo = dataConvertor.convertAgentInfo(agentInfo)
    log.debug(`sendAgentInfo pAgentInfo: ${JSON.stringify(pAgentInfo.toObject())}`)
    this.agentClient.requestAgentInfo(pAgentInfo, (err, response) => {
      if (err) {
        log.error(err)
      }
    })
  }

  sendApiMetaInfo(apiMetaInfo) {
    const pApiMetaData = dataConvertor.convertApiMetaInfo(apiMetaInfo)
    log.debug(`sendApiMetaInfo pApiMetaData: ${JSON.stringify(pApiMetaData.toObject())}`)
    this.metadataClient.requestApiMetaData(pApiMetaData, (err, response) => {
      if (err) {
        log.error(err)
      }
    })
  }

  sendStringMetaInfo(stringMetaInfo) {
    const pStringMetaData = dataConvertor.convertStringMetaInfo(stringMetaInfo)
    log.debug(`sendStringMetaInfo pStringMetaData: ${JSON.stringify(pStringMetaData.toObject())}`)
    this.metadataClient.requestStringMetaData(pStringMetaData, (err, response) => {
      if (err) {
        log.error(err)
      }
    })
  }

  sendSpan(span) {
    const pSpan = span.spanMessage
    log.debug(`sendSpan pSpan: ${JSON.stringify(pSpan.toObject())}`)
    this.spanStream.write(pSpan)
  }

  sendSpanChunk(spanChunk) {
    const pSpanChunk = spanChunk.spanMessage
    log.debug(`sendSpanChunk pSpanChunk: ${JSON.stringify(pSpanChunk.toObject())}`)
    this.spanStream.write(pSpanChunk)
  }

  sendStat(stat) {
    const pStatMessage = dataConvertor.convertStat(stat)
    log.debug(`sendStats pStatMessage: ${JSON.stringify(stat)}`)
    this.statStream.write(pStatMessage)
  }

  sendControlHandshake(params) {
    const pCmdMessage = dataConvertor.convertCmdMessage(params)
    log.debug(`sendControlHandshake pCmdMessage: ${JSON.stringify(pCmdMessage.toObject())}`)
    this.profilerStream.write(pCmdMessage)
  }

  sendPing() {
    const pPing = dataConvertor.convertPing()
    log.debug(`sendPing pPing: ${JSON.stringify(pPing)}`)

    var call = this.agentClient.pingSession()
    call.on('data', function (data) {
      log.debug(`sendPing on(data) : ${JSON.stringify(data)}`)
    })
    call.on('end', function () {
      log.debug(`sendPing on(end)`)
    })
    call.on('error', function (e) {
      log.debug(`sendPing on(error): ${JSON.stringify(e)}`)
    })
    call.on('status', function (status) {
      log.debug(`sendPing on(status): ${JSON.stringify(status)}`)
    })
    call.write(pPing)
    call.end()
  }
}

module.exports = GrpcDataSender