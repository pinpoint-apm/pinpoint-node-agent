/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const logger = require('./utils/log/logger')
const dataSenderFactory = require('./client/data-sender-factory')
const stringMetaService = require('./context/string-meta-service')
const apiMetaService = require('./context/api-meta-service')
const TraceContext = require('./context/trace-context')
const { ModuleHook } = require('./instrumentation/module-hook')
const Scheduler = require('./utils/scheduler')
const AgentStatsMonitor = require('./metric/agent-stats-monitor')
const PingScheduler = require('./metric/ping-scheduler')
const { ConfigBuilder } = require('./config-builder')

class Agent {
    constructor(agentInfo, config, logger) {
        this.agentInfo = agentInfo
        this.config = config
        this.logger = logger
    }

    start() {
        this.logger.warn('[Pinpoint Agent] Configuration', this.config)

        if (typeof this.config?.enable === 'boolean' && !this.config.enable) {
            this.logger.warn('[Pinpoint Agent][' + this.config.agentId + '] Disabled')
            return
        }

        this.dataSender.send(this.agentInfo)
        stringMetaService.init(this.dataSender)
        apiMetaService.init(this.dataSender)

        this.traceContext = new TraceContext(this.agentInfo, this.dataSender, this.config)
        this.moduleHook = new ModuleHook(this)
        this.moduleHook.start()

        this.shutdownServices = this.services
            .map(service => service.call(this, this.dataSender))
            .filter(service => service && typeof service.shutdown === 'function')

        this.logger.warn('[Pinpoint Agent][' + this.config.agentId + '] Initialized', this.agentInfo)
    }

    createTraceObject() {
        return this.traceContext.newTraceObject2()
    }

    currentTraceObject() {
        return this.traceContext.currentTraceObject()
    }

    completeTraceObject(trace) {
        this.traceContext.completeTraceObject(trace)
    }

    getAgentInfo() {
        return this.agentInfo
    }

    getTraceContext() {
        return this.traceContext
    }

    shutdown() {
        this.mainScheduler?.stop()
        this.pingScheduler?.stop()
        this.moduleHook?.stop()
        this.shutdownServices?.forEach(service => service.shutdown())
    }
}

class AgentBuilder {
    constructor(agentInfo) {
        this.agentInfo = agentInfo
        this.services = []
        this.enableStatsMonitor = true
        this.enablePingScheduler = true
        this.enableServiceCommand = true
    }

    setConfig(config) {
        this.config = config
        return this
    }

    setDataSender(dataSender) {
        this.dataSender = dataSender
        return this
    }

    setLogger(logger) {
        this.logger = logger
        return this
    }

    addService(service) {
        this.services.push(service)
        return this
    }

    disableStatsScheduler() {
        this.enableStatsMonitor = false
        return this
    }

    disablePingScheduler() {
        this.enablePingScheduler = false
        return this
    }

    disableServiceCommand() {
        this.enableServiceCommand = false
        return this
    }

    build() {
        if (!this.config) {
            this.config = new ConfigBuilder().build()
        }

        const agent = new Agent(this.agentInfo, this.config, this.logger ?? logger.getLogger())
        if (!this.dataSender) {
            this.dataSender = dataSenderFactory.create(this.config, this.agentInfo)
        }
        agent.dataSender = this.dataSender

        if (this.enableStatsMonitor || this.config.isStatsMonitoringEnabled()) {
            this.addService((dataSender) => {
                this.mainScheduler = new Scheduler(5000)
                const agentStatsMonitor = new AgentStatsMonitor(dataSender, this.agentInfo.getAgentId(), this.agentInfo.getAgentStartTime())
                this.mainScheduler.addJob(() => { agentStatsMonitor.run() })
                this.mainScheduler.start()
            })
        }

        if (this.enablePingScheduler) {
            this.addService((dataSender) => {
                this.pingScheduler = new PingScheduler(dataSender)
            })
        }

        if (this.enableServiceCommand) {
            this.addService((dataSender) => {
                dataSender.sendSupportedServicesCommand()
            })
        }

        agent.services = this.services
        return agent
    }
}

module.exports = { Agent, AgentBuilder }