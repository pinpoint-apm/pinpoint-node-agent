/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const os = require('os')
const internalIp = require('internal-ip')
const agentPackage = require('../../../package')
const ServiceType = require('../../context/service-type')

class AgentInfo {
  constructor(config, agentStartTime) {
    this.agentId = config.getAgentId()
    this.agentName = config.getAgentName()
    this.applicationName = config.getApplicationName()
    this.applicationServiceType = ServiceType.node.getCode()
    this.container = config.isContainerEnvironment()
    this.agentStartTime = agentStartTime
    this.agentVersion = agentPackage.version
    this.hostname = os.hostname()
    this.ip = internalIp.v4.sync()
    this.pid = process.pid
    this.ports = ''
    this.vmVersion = process.versions.node
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

  getApplicationName() {
    return this.applicationName
  }

  getApplicationServiceType() {
    return this.applicationServiceType
  }
}

module.exports = AgentInfo
