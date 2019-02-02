'use strict'

const os = require('os');
const internalIp = require('internal-ip');
const defaultAgentInfo = require('./agent-info')
const instManager = require('./instrumentation/inst-manager')
const traceContext = require('./context/trace-context')
const log = require('./utils/logger')
const stringMetaService = require('./context/string-meta-service')
const apiMetaService = require('./context/api-meta-service')
const sampler = require('./sampler/sampler')
const Scheduler = require('./utils/scheduler')
const AgentStatsMonitor = require('./metric/agent-stats-monitor')
const getConfig = require('./config').getConfig
const PinpointClient = require('./client/pinpoint-client')

class Agent {
  constructor (initOptions) {
    this.config = getConfig(initOptions)
    log.init(this.config.logLevel)

    log.info('[Pinpoint Agent] Init Started')
    log.debug('[Pinpoint Agent] Configuration', this.config)

    this.agentId = this.config.agentId
    this.agentStartTime = Date.now()
    this.agentInfo = this.createAgentInfo(this.config, this.agentStartTime)

    this.loadedModule = []
    instManager.init(this)

    this.isSampling = sampler.getIsSampling(this.config.sampling, this.config.sampleRate)
    this.traceContext = traceContext.init(this.agentInfo)

    this.pinpointClient = new PinpointClient(this.config, this.agentInfo)
    this.pinpointClient.sendAgentInfo()

    stringMetaService.init(this.agentInfo, this.pinpointClient.dataSender)
    apiMetaService.init(this.agentInfo, this.pinpointClient.dataSender)

    this.scheduler = new Scheduler(3000)
    this.registerSchedulingJobs()

    this.scheduler.start()

    log.info('[Pinpoint Agent] Init Finished')
  }

  createTraceObject (requestData) {
    if (!requestData || requestData.isRoot) {
      return this.traceContext.newTraceObject(this.isSampling())
    } else {
      return this.traceContext.continueTraceObject(requestData)
    }
  }

  currentTraceObject () {
    return this.traceContext.currentTraceObject()
  }

  completeTraceObject (trace) {
    this.traceContext.completeTraceObject(trace)
    if (trace.span) {
      this.pinpointClient.dataSender.sendSpan(trace.span)
    }
  }

  includedModules (moduleName) {
    return !this.loadedModule.includes(moduleName)
  }

  setModules (moduleName) {
    log.debug('set Loaded module : ' + moduleName)
    this.loadedModule.push(moduleName)
  }

  registerSchedulingJobs () {
    if (this.config.statsMonitorSending) {
      const agentStatsMonitor = new AgentStatsMonitor(this.pinpointClient.dataSender, this.agentId, this.agentStartTime)
      this.scheduler.addJob(() => { agentStatsMonitor.run() })
    }
    this.scheduler.addJob(() => { this.pinpointClient.sendAgentInfo() })
    this.scheduler.addJob(() => { this.pinpointClient.sendPing() })
  }

  createAgentInfo (config, agentStartTime) {
    return {
      agentId: config.agentId,
      applicationName: config.applicationName,
      serviceType: config.serviceType,
      applicationServiceType: config.serviceType,
      startTimestamp: agentStartTime,
      agentStartTime: agentStartTime,
      agentVersion: defaultAgentInfo.version,
      hostname: os.hostname(),
      ip: internalIp.v4.sync(),
      pid: process.pid,
      ports: '',
      vmVerson: '',
    }
  }

}

module.exports = Agent
