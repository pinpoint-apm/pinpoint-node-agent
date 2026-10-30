/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const logger = require('./utils/log/logger')
const AgentInfo = require('./data/dto/agent-info')
const DataSender = require('./client/data-sender')
const GrpcDataSender = require('./client/grpc-data-sender')
const { ClientHeader, makeClientHeaderInterceptor } = require('./name/client-header')
const stringMetaService = require('./context/string-meta-service')
const apiMetaService = require('./context/api-meta-service')
const TraceContext = require('./context/trace-context')
const { ModuleHook } = require('./instrumentation/module-hook')
const Scheduler = require('./utils/scheduler')
const AgentStatsMonitor = require('./metric/agent-stats-monitor')
const PingScheduler = require('./metric/ping-scheduler')
const { SpanRecorderFactory } = require('./context/trace/span-recorder-factory')
const { SqlMetadataService } = require('./instrumentation/sql/sql-metadata-service')
const { IntIdParsingResultFactory } = require('./context/trace/parsing-result-factory')
const SpanEventRecorderFactory = require('./context/trace/span-event-recorder-factory')
const { CompositeTraceCompletionEnricher } = require('./context/trace/composite-trace-completion-enricher')

class Agent {
    constructor(dataSender, config, logger, traceContext, agentStartTime) {
        this.dataSender = dataSender
        this.config = config
        this.logger = logger
        this.traceContext = traceContext
        this.agentStartTime = agentStartTime
    }

    start() {
        this.logger.warn('[Pinpoint Agent] Configuration', this.config)

        if (typeof this.config?.enable === 'boolean' && !this.config.enable) {
            this.logger.warn('[Pinpoint Agent][' + this.config.getAgentId() + '] Disabled')
            return
        }

        const agentInfo = new AgentInfo(this.config, this.agentStartTime)
        this.dataSender.send(agentInfo)
        stringMetaService.init(this.dataSender)
        apiMetaService.init(this.dataSender)

        this.moduleHook = new ModuleHook(this)
        this.moduleHook.start()

        this.shutdownServices = this.services
            .map(service => service.call(this, this.dataSender))
            .filter(service => service && typeof service.shutdown === 'function')

        this.logger.warn('[Pinpoint Agent][' + this.config.getAgentId() + '] Initialized', agentInfo)
    }

    createTraceObject() {
        return this.traceContext.newTraceObject()
    }

    currentTraceObject() {
        return this.traceContext.currentTraceObject()
    }

    completeTraceObject(trace) {
        this.traceContext.completeTraceObject(trace)
    }

    getConfig() {
        return this.config
    }

    getTraceContext() {
        return this.traceContext
    }

    shutdown() {
        this.moduleHook?.stop()
        this.shutdownServices?.forEach(service => service.shutdown())
    }
}

class AgentBuilder {
    constructor(config) {
        this.config = config
        this.services = []
        this.enableStatsMonitor = true
        this.enablePingScheduler = true
        this.enableServiceCommand = true
        this.enrichers = []
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

    addEnricher(enricher) {
        this.enrichers.push(enricher)
        return this
    }

    setSpanRecorderFactory(spanRecorderFactory) {
        this.spanRecorderFactory = spanRecorderFactory
        return this
    }

    setParsingResultFactory(parsingResultFactory) {
        this.parsingResultFactory = parsingResultFactory
        return this
    }

    build() {
        const agentStartTime = String(Date.now() - Math.floor(process.uptime() * 1000))
        if (!this.dataSender) {
            this.dataSender = new DataSender(this.config, new GrpcDataSender(this.config, [makeClientHeaderInterceptor(ClientHeader.make(agentStartTime, this.config))]))
        }
        if (!this.spanRecorderFactory) {
            this.spanRecorderFactory = new SpanRecorderFactory(this.config)
        }
        const parsingResultFactory = this.parsingResultFactory ?? new IntIdParsingResultFactory()
        const sqlMetadataService = new SqlMetadataService(this.dataSender, parsingResultFactory)
        const exceptionSpanEventEnricher = this.enrichers.find(e => typeof e.recordException === 'function')
        const spanEventRecorderFactory = new SpanEventRecorderFactory(sqlMetadataService, exceptionSpanEventEnricher)
        const traceCompletionEnricher = CompositeTraceCompletionEnricher.make(this.enrichers)
        const traceContext = new TraceContext(this.dataSender, this.config, traceCompletionEnricher, this.spanRecorderFactory, spanEventRecorderFactory, agentStartTime)
        const agent = new Agent(this.dataSender, this.config, this.logger ?? logger.getLogger(), traceContext, agentStartTime)

        if (this.enableStatsMonitor || this.config.isStatsMonitoringEnabled()) {
            this.addService((dataSender) => {
                const scheduler = new Scheduler(AgentStatsMonitor.COLLECT_INTERVAL)
                const agentStatsMonitor = new AgentStatsMonitor(dataSender, this.config.getAgentId(), agentStartTime, { gcStats: this.config.isGcStatsEnabled(), fileDescriptorStats: this.config.isFileDescriptorStatsEnabled() })
                scheduler.addJob(() => { agentStatsMonitor.run() })
                scheduler.start()
                return {
                    shutdown() {
                        scheduler.stop()
                        agentStatsMonitor.shutdown()
                    }
                }
            })
        }

        if (this.enablePingScheduler) {
            this.addService((dataSender) => {
                const pingScheduler = new PingScheduler(dataSender)
                return {
                    shutdown() {
                        pingScheduler.stop()
                    }
                }
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