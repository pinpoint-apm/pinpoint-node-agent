'use strict'

const grpc = require('grpc')
const log = require('../utils/logger')
const services = require('../data/grpc/Service_grpc_pb')
const statMessages = require('../data/grpc/Stat_pb')
const AgentInfo = require('../data/dto/agent-info')

class GrpcDataSender {
  constructor (
    collectorIp,
    collectorTcpPort,
    collectorStatPort,
    collectorSpanPort,
    agentInfo
  ) {
    const interceptor = function(options, nextCall) {
      return new grpc.InterceptingCall(nextCall(options), {
        start: function(metadata, listener, next) {
          metadata.add('agentid', agentInfo.agentId)
          metadata.add('applicationname', agentInfo.applicationName)
          metadata.add('starttime', String(agentInfo.agentStartTime))
          next(metadata, listener, next)
        }
      })
    }

    const options = {interceptors: [interceptor]}

    this.agentClient = new services.AgentClient(
      collectorIp + ":" + collectorTcpPort,
      grpc.credentials.createInsecure(),
      options,
    )
  }

  send (data) {
    if (data instanceof AgentInfo) {
      this.sendAgentInfo(data)
    }
  }

  sendAgentInfo (agentInfo) {
    const pAgentInfo = new statMessages.PAgentInfo(agentInfo)
    this.agentClient.requestAgentInfo(pAgentInfo, (err, response) => {
      log.debug('err', err)
      log.debug('response', response)
    })
  }
}

module.exports = GrpcDataSender
