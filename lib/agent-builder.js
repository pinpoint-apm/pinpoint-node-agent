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
const sqlMetadataService = require('./instrumentation/sql/sql-metadata-service')
const TraceContext = require('./context/trace-context')
const { ModuleHook } = require('./instrumentation/module-hook')
const Scheduler = require('./utils/scheduler')
const AgentStatsMonitor = require('./metric/agent-stats-monitor')
const PingScheduler = require('./metric/ping-scheduler')
const { getConfig } = require('./config')

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
        sqlMetadataService.setDataSender(this.dataSender)

        this.traceContext = new TraceContext(this.agentInfo, this.dataSender, this.config)
        this.moduleHook = new ModuleHook(this)
        this.moduleHook.start()

        this.services.forEach(service => {
            service.call(this)
        })

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
            this.config = getConfig()
        }

        const agent = new Agent(this.agentInfo, this.config, logger)
        if (!this.dataSender) {
            this.dataSender = dataSenderFactory.create(this.config, this.agentInfo)
        }
        agent.dataSender = this.dataSender

        if (this.enableStatsMonitor || this.config.enabledStatsMonitor) {
            this.addService(() => {
                this.mainScheduler = new Scheduler(5000)
                const agentStatsMonitor = new AgentStatsMonitor(this.dataSender, this.agentInfo.getAgentId(), this.agentInfo.getAgentStartTime())
                this.mainScheduler.addJob(() => { agentStatsMonitor.run() })
                this.mainScheduler.start()
            })
        }

        if (this.enablePingScheduler) {
            this.addService(() => {
                this.pingScheduler = new PingScheduler(this.dataSender)
            })
        }

        if (this.enableServiceCommand) {
            this.addService(() => {
                this.dataSender.sendSupportedServicesCommand()
            })
        }

        agent.services = this.services
        return agent
    }
}

module.exports = { Agent, AgentBuilder }