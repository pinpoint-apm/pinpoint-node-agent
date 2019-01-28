'use strict'

const os = require('os');
const instManager = require('./instrumentation/inst-manager')
const traceContext = require('./context/trace-context')
const MethodDescriptors = require('./constant/method-descriptor').MethodDescriptors
const TAgentInfo = require('./data/dto/Pinpoint_types').TAgentInfo
const TApiMetaData = require('./data/dto/Trace_types').TApiMetaData
const networkUtils = require('./utils/network');
const DataSender = require('./sender/data-sender')
const log = require('./utils/logger')
const StringMetaCache = require('./context/string-meta-cache')
const sampler = require('./sampler/sampler')
const Scheduler = require('./utils/scheduler')
const AgentStatsMonitor = require('./metric/agent-stats-monitor')
const getConfig = require('./config').getConfig

class Agent {
  constructor (initOptions) {
    this.config = getConfig(initOptions)
    log.init(this.config.logLevel)

    log.info('[Pinpoint] Agent Init Started')
    log.debug('[Pinpoint] Configuration', this.config)

    this.agentId = this.config.agentId
    this.applicationName = this.config.applicationName
    this.serviceType = this.config.serviceType

    this.agentStartTime = Date.now()
    this.loadedModule = []

    this.traceContext = traceContext.init({
      agentId: this.agentId,
      applicationName: this.applicationName,
      agentStartTime: this.agentStartTime,
      serviceType: this.serviceType,
    })

    this.dataSender = new DataSender(this.config)

    this.isSampling = sampler.getIsSampling(this.config.sampling, this.config.sampleRate)

    const agentStatsMonitor = new AgentStatsMonitor(this.dataSender, this.agentId, this.agentStartTime)

    this.scheduler = new Scheduler(1000)
    this.scheduler.addJob(() => agentStatsMonitor.run())
    this.scheduler.start()

    StringMetaCache.init(this.agentId, this.agentStartTime, this.dataSender)
    instManager.init(this)

    this.sendAgentInfo()
    this.sendApiMetaInfo()
    log.info('[Pinpoint] Agent Init Finished')
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
      this.dataSender.sendSpan(trace.span)
    }
  }

  includedModules (moduleName) {
    return !this.loadedModule.includes(moduleName)
  }

  setModules (moduleName) {
    log.debug('set Loaded module : ' + moduleName)
    this.loadedModule.push(moduleName)
  }

  sendAgentInfo () {
    try {
      this.dataSender.send(this.createAgentInfo())
    } catch (e) {
      log.error(e)
      throw new Error()
    }
    return true
  }

  createAgentInfo () {
    const info = {
      agentId: this.agentId,
      applicationName: this.applicationName,
      agentVersion: '1',
      serviceType: this.serviceType,
      applicationServiceType: this.serviceType,
      hostname: os.hostname(),
      ip: networkUtils.getLocalIp(),
      ports: '1',
      pid: process.pid,
      vmVerson: '1',
      startTimestamp: this.agentStartTime
    }
    return new TAgentInfo(info)
  }

  sendApiMetaInfo () {
    try {
      MethodDescriptors.forEach(methodDescriptor => {
        Object.keys(methodDescriptor)
        .filter(key => methodDescriptor[key].apiId !== 0)
        .forEach(key => {
          const apiMetaInfo = this.createApiMetaInfo(methodDescriptor[key])
          this.dataSender.sendMetaInfo(apiMetaInfo)
        })
      })
    } catch (e) {
      log.error(e)
      throw new Error()
    }
    return true
  }

  createApiMetaInfo (methodDescriptor) {
    const info = {
      agentId: this.agentId,
      agentStartTime: this.agentStartTime,
      apiId: methodDescriptor.apiId,
      apiInfo: methodDescriptor.apiInfo,
    }
    return new TApiMetaData(info)
  }
}

module.exports = Agent
