const os = require('os');

const instManager = require('instrumentation/inst-manager')
const traceContext = require('context/trace-context')
const TAgentInfo = require('data/dto/Pinpoint_types').TAgentInfo
const networkUtils = require('utils/network');
const DataSender = require('sender/data-sender')

const getConfig = require('config').get

class Agent {
  constructor (agentConfig) {
    this.config = getConfig(agentConfig)

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

    instManager.init(this)
  }

  createTraceObject (traceId) {
    if (traceId) {
      return this.traceContext.continueTraceObject(traceId)
    } else {
      return this.traceContext.newTraceObject()
    }
  }

  currentTraceObject (j) {
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
    console.debug('set Loaded module : ' + moduleName)
    this.loadedModule.push(moduleName)
  }

  sendAgentInfo () {
    try {
      this.dataSender.send(this.getAgentInfo())
    } catch (e) {
      console.log(e)
      throw new Error()
    }
    return true
  }

  getAgentInfo () {
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

}

module.exports = Agent
