/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { AgentBuilder } = require('../../lib/agent-builder')
const { ConfigBuilder } = require('../../lib/config-builder')
const TraceContextBuilder = require('../../lib/context/trace-context-builder')
const stringMetaService = require('../../lib/context/string-meta-service')
const apiMetaService = require('../../lib/context/api-meta-service')
const localStorage = require('../../lib/instrumentation/context/local-storage')

let processAgent
let traceContextInUse
let dataSenderInUse

// Hooks keep the trace context they got when a module loaded, so the agent's trace context forwards
// every call and field to the trace context a test uses
const forwardingTraceContext = new Proxy({}, {
    get(target, property) {
        return Reflect.get(traceContextInUse, property)
    },
    set(target, property, value) {
        return Reflect.set(traceContextInUse, property, value)
    },
    defineProperty(target, property, descriptor) {
        return Reflect.defineProperty(traceContextInUse, property, descriptor)
    },
})

class ProcessAgentBuilder extends AgentBuilder {
    constructor(json = {}) {
        super(new ConfigBuilder(json).setDefaultJson(require('../pinpoint-config-test.json')).build())
    }

    build() {
        if (!processAgent) {
            processAgent = super.build()
            traceContextInUse = processAgent.traceContext
            processAgent.traceContext = forwardingTraceContext
            dataSenderInUse = processAgent.dataSender
            Object.defineProperty(processAgent, 'dataSender', {
                get: () => dataSenderInUse,
                set: (dataSender) => { dataSenderInUse = dataSender },
            })
            return processAgent
        }
        localStorage.disable()
        traceContextInUse = this.buildTraceContext()
        dataSenderInUse.close()
        dataSenderInUse = this.dataSender
        stringMetaService.init(this.dataSender)
        apiMetaService.init(this.dataSender)
        return processAgent
    }

    buildTraceContext() {
        const traceContextBuilder = new TraceContextBuilder(this.config)
            .setDataSender(this.dataSender)
            .setSpanRecorderFactory(this.spanRecorderFactory)
            .setParsingResultFactory(this.parsingResultFactory)
        this.enrichers.forEach(enricher => traceContextBuilder.addEnricher(enricher))
        return traceContextBuilder.build(processAgent.agentStartTime)
    }
}

module.exports = {
    ProcessAgentBuilder,
}
