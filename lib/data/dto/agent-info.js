'use strict'

const os = require('os');
const internalIp = require('internal-ip');
const defaultAgentInfo = require('../../agent-info')

class AgentInfo {
  constructor(initData = {}) {
    this.agentId = initData.agentId
    this.applicationName = initData.applicationName
    this.serviceType = initData.serviceType
    this.applicationServiceType = initData.serviceType
    this.container = initData.container
    this.startTimestamp = initData.agentStartTime
    this.agentStartTime = initData.agentStartTime
    this.agentVersion = defaultAgentInfo.version
    this.hostname = os.hostname()
    this.ip = internalIp.v4.sync()
    this.pid = process.pid
    this.ports = ''
    this.vmVerson = ''
  }

  static create(config, agentStartTime) {
    return new AgentInfo({
      agentId: config.agentId,
      applicationName: config.applicationName,
      serviceType: config.serviceType,
      applicationServiceType: config.serviceType,
      container: config.container,
      startTimestamp: agentStartTime,
      agentStartTime: agentStartTime,
    })
  }
}

module.exports = AgentInfo
