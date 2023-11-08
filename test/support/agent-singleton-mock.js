/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { fixture, log } = require('../test-helper')

const enableDataSending = require('../test-helper').enableDataSending
enableDataSending()
const Agent = require('../../lib/agent')
const dataSenderMock = require('./data-sender-mock')
const shimmer = require('@pinpoint-apm/shimmer')
const httpShared = require('../../lib/instrumentation/http-shared')
const traceContext = require('../../lib/context/trace-context')
const contextManager = require('../../lib/context/context-manager')
const activeTrace = require('../../lib/metric/active-trace')
const apiMetaService = require('../../lib/context/api-meta-service')
const { setDataSender } = require('../../lib/client/data-sender-factory')

class MockAgent extends Agent {
    startSchedule(agentId, agentStartTime) {
        this.mockAgentId = agentId
        this.mockAgentStartTime = agentStartTime
    }

    initializeDataSender() {
        this.dataSender = dataSenderMock()
        this.dataSender.send(this.agentInfo)
    }

    bindHttp(json) {
        this.cleanHttp()
        apiMetaService.init(dataSenderMock())

        if (!json) {
            json = require('../pinpoint-config-test')
        }
        require('../../lib/config').clear()
        const config = require('../../lib/config').getConfig(json)
        this.config = config

        httpShared.clearPathMatcher()
        const http = require('http')
        log.debug('shimming http.Server.prototype.emit function')
        shimmer.wrap(http && http.Server && http.Server.prototype, 'emit', httpShared.instrumentRequest(agent, 'http'))

        log.debug('shimming http.request function')
        shimmer.wrap(http, 'request', httpShared.traceOutgoingRequest(agent, 'http'))

        // on node v10.15.0 init call before destory
        const traces = this.traceContext.getAllTraceObject()
        let traceSet = new Set()
        for (const [key, trace] of traces) {
            traceSet.add(trace)
        }
        for (const trace of traceSet) {
            if (typeof trace.completed === 'function' && trace.completed()) {
                continue
            }
            this.traceContext.completeTraceObject(trace)
        }

        const traceObjectMap = contextManager.getAllObject()
        traceObjectMap.clear()

        const activeTraces = activeTrace.getAllTraces()
        activeTraces.forEach((value) => {
            activeTrace.remove(value)
        })

        this.dataSender = dataSenderMock()
        setDataSender(this.dataSender)
        this.traceContext = traceContext.init(this.agentInfo, this.dataSender, this.config)
    }

    cleanHttp() {
        const http = require('http')
        shimmer.unwrap(http && http.Server && http.Server.prototype, 'emit')
        shimmer.unwrap(http, 'request')
    }

    callbackTraceClose(callback) {
        const trace = this.traceContext.currentTraceObject()
        const origin = trace.close
        trace.close = () => {
            origin.apply(trace, arguments)
            callback(trace)
        }
    }

}

const agent = new MockAgent(fixture.config)
module.exports = agent