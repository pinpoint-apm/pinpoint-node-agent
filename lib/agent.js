/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const ModuleHook = require('./instrumentation/module-hook')
const { initializeConfig, getConfig } = require('./config')
const TraceContext = require('./context/trace-context')
const log = require('./utils/logger')
const stringMetaService = require('./context/string-meta-service')
const apiMetaService = require('./context/api-meta-service')
const sqlMetadataService = require('./instrumentation/sql/sql-metadata-service')
const Scheduler = require('./utils/scheduler')
const AgentStatsMonitor = require('./metric/agent-stats-monitor')
const PinpointClient = require('./client/pinpoint-client')
const dataSenderFactory = require('./client/data-sender-factory')
const AgentInfo = require('./data/dto/agent-info')
const PinScheduler = require('./metric/ping-scheduler')

class Agent {
  constructor(initOptions) {
    initializeConfig(initOptions)
    this.config = getConfig()

    log.init(this.config.logLevel)
    log.setEnableLogError(this.config.logError)
    log.warn('[Pinpoint Agent] Configuration', this.config)

    if (!this.config || !this.config.enable || this.config.enable.toString() !== 'true') {
      log.warn('[Pinpoint Agent][' + this.config.agentId + '] Disabled')
      return
    }
    log.warn('[Pinpoint Agent][' + this.config.agentId + '] Init Started')

    const agentId = this.config.agentId
    const agentStartTime = Date.now()
    this.agentInfo = this.createAgentInfo(this.config, agentStartTime)

    const dataSender = this.makeDataSender()
    this.dataSender = dataSender
    this.initializeDataSender(dataSender)
    this.initializePinpointClient(dataSender)

    this.traceContext = new TraceContext(this.agentInfo, this.dataSender, this.config)

    this.startSchedule(agentId, agentStartTime)
    this.initializeSupportModules()

    this.dataSender.sendSupportedServicesCommand()

    log.warn('[Pinpoint Agent][' + agentId + '] Init Completed')
  }

  makeDataSender() {
    return dataSenderFactory.create(this.config, this.agentInfo)
  }

  initializeDataSender(dataSender) {
    dataSender.send(this.agentInfo)
    stringMetaService.init(dataSender)
    apiMetaService.init(dataSender)
    sqlMetadataService.setDataSender(dataSender)
  }

  initializeSupportModules() {
    this.moduleHook = new ModuleHook(this)
    this.moduleHook.loadGlobalFunction(this)
  }

  initializePinpointClient(dataSender) {
    this.pinpointClient = new PinpointClient(this.config, this.agentInfo, dataSender)
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
