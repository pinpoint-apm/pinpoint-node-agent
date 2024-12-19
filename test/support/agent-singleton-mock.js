/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { log } = require('../test-helper')
const enableDataSending = require('../test-helper').enableDataSending
enableDataSending()
const Agent = require('../../lib/agent')
const dataSenderMock = require('./data-sender-mock')
const shimmer = require('@pinpoint-apm/shimmer')
const httpShared = require('../../lib/instrumentation/http-shared')
const activeTrace = require('../../lib/metric/active-trace')
const localStorage = require('../../lib/instrumentation/context/local-storage')
const sqlMetaDataService = require('../../lib/instrumentation/sql/sql-metadata-service')
const SimpleCache = require('../../lib/utils/simple-cache')
const sampler = require('../../lib/sampler/sampler')
const TraceSampler = require('../../lib/context/trace/trace-sampler')
const transactionIdGenerator = require('../../lib/context/sequence-generators').transactionIdGenerator
const closedTraceWrapped = Symbol('closedTraceWrapped')
const stringMetaService = require('../../lib/context/string-meta-service')
const apiMetaService = require('../../lib/context/api-meta-service')

let traces = []
const resetTraces = () => {
    traces = []
}
const getTraces = () => {
    return traces
}

let spanOrSpanChunks = []
const resetSpanOrSpanChunks = () => {
    spanOrSpanChunks = []
}
const getSpanOrSpanChunks = () => {
    return spanOrSpanChunks
}

let sendedApiMetaInfos = []
const resetSendedApiMetaInfos = () => {
    sendedApiMetaInfos = []
}
const getSendedApiMetaInfos = () => {
    return sendedApiMetaInfos
}
const getTraceByAsyncId = (asyncId) => {
    return getTraces().find(trace => {
        const spanChunkSpanEvents = agent.dataSender.mockSpanChunks.flatMap(spanChunk => spanChunk.spanEventList)
        const spanEvents = trace.callStack.stack.concat(trace.repository.buffer).concat(spanChunkSpanEvents)
        const asyncSpanEvent = spanEvents.find(spanEvent => spanEvent.asyncId?.getAsyncId() === asyncId.getAsyncId())
        return asyncSpanEvent
    })
}

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
        this.dataSender.clear()

        json = this.portProperties(json)

        if (!json) {
            json = require('../pinpoint-config-test')
        } else {
            json = Object.assign({}, require('../pinpoint-config-test'), json)
        }
        require('../../lib/config').clear()
        const config = require('../../lib/config').getConfig(json)
        this.config = config

        sqlMetaDataService.cache = new SimpleCache(1024)
        this.traceContext.isSampling = sampler.getIsSampling(config.sampling, config.sampleRate)
        if (sampler.getSamplingCountGenerator()) {
            sampler.getSamplingCountGenerator().reset()
        }
        transactionIdGenerator.reset()

        httpShared.clearPathMatcher()
        const http = require('http')
        log.debug('shimming http.Server.prototype.emit function')
        shimmer.wrap(http && http.Server && http.Server.prototype, 'emit', httpShared.instrumentRequest2(agent, 'http'))

        log.debug('shimming http.request function')
        shimmer.wrap(http, 'request', httpShared.traceOutgoingRequest2(agent, 'http'))

        localStorage.disable()

        const activeTraces = activeTrace.getAllTraces()
        activeTraces.forEach((value) => {
            activeTrace.remove(value)
        })

        this.traceContext.traceSampler = new TraceSampler(this.agentInfo, config)
        this.traceContext.config = config

        const dataSender = dataSenderMock(this.config, this.agentInfo)
        this.traceContext.dataSender = dataSender
        this.dataSender = dataSender

        stringMetaService.init(dataSender)
        apiMetaService.init(dataSender)

        resetSpanOrSpanChunks()

        resetTraces()
        this.newTraceCallback = null
        const getNewTraceCallback = () => {
            return this.newTraceCallback
        }
        shimmer.wrap(this.traceContext, 'newTrace', function (origin) {
            return function () {
                const returned = origin.apply(this, arguments)
                getNewTraceCallback()?.(returned)
                getTraces().push(returned)
                return returned
            }
        })

        this.continueAsyncContextTraceObjectCallback = null
        const getContinueAsyncContextTraceObjectCallback = () => {
            return this.continueAsyncContextTraceObjectCallback
        }
        shimmer.wrap(this.traceContext, 'continueAsyncContextTraceObject', function (origin) {
            return function () {
                const returned = origin.apply(this, arguments)
                getContinueAsyncContextTraceObjectCallback()?.(returned)
                getTraces().push(returned)
                return returned
            }
        })

        resetSendedApiMetaInfos()
        shimmer.wrap(apiMetaService, 'sendApiMetaInfo', function (origin) {
            return function () {
                const returned = origin.apply(this, arguments)
                getSendedApiMetaInfos().push(arguments[0])
                return returned
            }
        })
    }

    cleanHttp() {
        const http = require('http')
        shimmer.unwrap(http && http.Server && http.Server.prototype, 'emit')
        shimmer.unwrap(http, 'request')
    }

    callbackTraceClose(callback) {
        const trace = this.traceContext.currentTraceObject()
        const origin = trace.close
        trace.close = function () {
            origin.apply(trace, arguments)
            callback(trace)
        }
        trace[closedTraceWrapped] = true
    }

    bindHttpWithCallSite(conf) {
        conf = this.portProperties(conf)
        conf = Object.assign({}, { 'trace-location-and-filename-of-call-site': true }, conf)
        this.bindHttp(conf)
    }

    portProperties(conf) {
        if (typeof conf !== 'number') {
            return conf
        }
        const testConf = require('../pinpoint-config-test')
        const collectorConf = Object.assign(testConf.collector, { 'span-port': conf, 'stat-port': conf, 'tcp-port': conf })
        return Object.assign({}, { collector: collectorConf })
    }

    completeTraceObject(trace) {
        super.completeTraceObject(trace)
    }

    getTraces() {
        return getTraces()
    }

    getTrace(index) {
        return getTraces()[index]
    }

    getSpanChunk(asyncId) {
        return getSpanOrSpanChunks().find(spanOrSpanChunk => spanOrSpanChunk.getLocalasyncid().getAsyncid() === asyncId.getAsyncId() && spanOrSpanChunk.getLocalasyncid().getSequence() === asyncId.getSequence())
    }

    getSpanOrSpanChunks() {
        return getSpanOrSpanChunks()
    }

    getSendedApiMetaInfos() {
        return getSendedApiMetaInfos()
    }

    setNewTraceCallback(callback) {
        this.newTraceCallback = callback
    }

    setContinueAsyncContextTraceObjectCallback(callback) {
        this.continueAsyncContextTraceObjectCallback = callback
    }

    getTraceByAsyncId(asyncId) {
        return getTraceByAsyncId(asyncId)
    }
}

const agent = new MockAgent(require('../pinpoint-config-test'))
module.exports = agent