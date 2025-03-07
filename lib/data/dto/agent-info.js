/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const os = require('os')
const internalIp = require('internal-ip')
const agentPackage = require('../../../package')

class AgentInfo {
  constructor(initData = {}) {
    this.agentId = initData.agentId
    this.agentName = initData.agentName
    this.applicationName = initData.applicationName
    this.serviceType = initData.serviceType
    this.applicationServiceType = initData.serviceType
    this.container = initData.container
    this.startTimestamp = initData.agentStartTime
    this.agentStartTime = initData.agentStartTime
    this.agentVersion = agentPackage.version
    this.hostname = os.hostname()
    this.ip = internalIp.v4.sync()
    this.pid = process.pid
    this.ports = ''
    this.vmVerson = ''
  }

  static create(config, agentStartTime) {
    return new AgentInfo({
      agentId: config.agentId,
      agentName: config.agentName,
      applicationName: config.applicationName,
      serviceType: config.serviceType,
      applicationServiceType: config.serviceType,
      container: config.container,
      startTimestamp: agentStartTime,
      agentStartTime: agentStartTime,
    })
  }

  getAgentId() {
    return this.agentId
  }

  getAgentName() {
    return this.agentName
  }

  getAgentStartTime() {
    return this.agentStartTime
  }

  getServiceType() {
    return this.serviceType
  }

  getApplicationName() {
    return this.applicationName
  }

  getApplicationServiceType() {
    return this.applicationServiceType
  }
}

module.exports = AgentInfo
