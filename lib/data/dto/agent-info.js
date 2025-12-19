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
  constructor(config, agentStartTime) {
    this.agentId = config.getAgentId()
    this.agentName = config.getAgentName()
    this.applicationName = config.getApplicationName()
    this.serviceType = config.getApplicationServiceType()
    this.applicationServiceType = config.getApplicationServiceType()
    this.container = config.isContainerEnvironment()
    this.agentStartTime = agentStartTime
    this.agentVersion = agentPackage.version
    this.hostname = os.hostname()
    this.ip = internalIp.v4.sync()
    this.pid = process.pid
    this.ports = ''
    this.vmVersion = ''
  }

  static make(config) {
    const agentStartTime = String(Date.now() - Math.floor(process.uptime() * 1000))
    return new AgentInfo(config, agentStartTime)
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
