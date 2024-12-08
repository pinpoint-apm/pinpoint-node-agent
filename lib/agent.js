/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const ModuleHook = require('./instrumentation/module-hook')
const TraceContext = require('./context/trace-context')
const log = require('./utils/logger')
const stringMetaService = require('./context/string-meta-service')
const apiMetaService = require('./context/api-meta-service')
const Scheduler = require('./utils/scheduler')
const AgentStatsMonitor = require('./metric/agent-stats-monitor')
const { initializeConfig, getConfig } = require('./config')
const PinpointClient = require('./client/pinpoint-client')
const dataSenderFactory = require('./client/data-sender-factory')
const AgentInfo = require('./data/dto/agent-info')
const PinScheduler = require('./metric/ping-scheduler')

class Agent {
  constructor(initOptions) {
    initializeConfig(initOptions)
    this.config = getConfig()

    log.init(this.config.logLevel)
    log.warn('[Pinpoint Agent] Configuration', this.config)

    if (!this.config || !this.config.enable || this.config.enable.toString() !== 'true') {
      log.warn('[Pinpoint Agent][' + this.config.agentId + '] Disabled')
      return
    }
    log.warn('[Pinpoint Agent][' + this.config.agentId + '] Init Started')

    const agentId = this.config.agentId
    const agentStartTime = Date.now()
    this.agentInfo = this.createAgentInfo(this.config, agentStartTime)

    this.initializeDataSender()
    this.initializePinpointClient()

    this.traceContext = new TraceContext(this.agentInfo, this.dataSender, this.config)

    stringMetaService.init(this.dataSender)
    apiMetaService.init(this.dataSender)

    this.startSchedule(agentId, agentStartTime)
    this.initializeSupportModules()

    this.dataSender.sendSupportedServicesCommand()

    log.warn('[Pinpoint Agent][' + agentId + '] Init Completed')
  }

  initializeDataSender() {
    this.dataSender = dataSenderFactory.create(this.config, this.agentInfo)
    this.dataSender.send(this.agentInfo)
  }

  initializeSupportModules() {
    this.moduleHook = new ModuleHook(this)
  }

  initializePinpointClient() {
    this.pinpointClient = new PinpointClient(this.config, this.agentInfo, this.dataSender)
  }

  createTraceObject(requestData) {
    return this.traceContext.newTraceObject2()
  }

  currentTraceObject() {
    return this.traceContext.currentTraceObject()
  }

  completeTraceObject(trace) {
    this.traceContext.completeTraceObject(trace)
  }

  createAgentInfo(config, agentStartTime) {
    return AgentInfo.create(config, '' + agentStartTime)
  }

  getAgentInfo() {
    return this.agentInfo
  }

  getTraceContext() {
    return this.traceContext
  }

  startSchedule(agentId, agentStartTime) {
    if (this.config.enabledStatsMonitor) {
      this.mainScheduler = new Scheduler(5000)
      const agentStatsMonitor = new AgentStatsMonitor(this.pinpointClient.dataSender, agentId, agentStartTime)
      this.mainScheduler.addJob(() => { agentStatsMonitor.run() })
      this.mainScheduler.start()
    }
    this.pingScheduler = new PinScheduler(this.dataSender)
  }

  shutdown() {
    this.mainScheduler?.stop()
    this.pingScheduler?.stop()
  }
}

module.exports = Agent
