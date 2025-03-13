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
const sqlMetadataService = require('../../lib/instrumentation/sql/sql-metadata-service')
const SimpleCache = require('../../lib/utils/simple-cache')
const sampler = require('../../lib/sampler/sampler')
const TraceSampler = require('../../lib/context/trace/trace-sampler')
const transactionIdGenerator = require('../../lib/context/sequence-generators').transactionIdGenerator
const closedTraceWrapped = Symbol('closedTraceWrapped')
const stringMetaService = require('../../lib/context/string-meta-service')
const apiMetaService = require('../../lib/context/api-meta-service')
const activeRequestRepository = require('../../lib/metric/active-request-repository')
const GrpcDataSender = require('../../lib/client/grpc-data-sender')

let traces = []
const resetTraces = () => {
    traces = []
}
const getTraces = () => {
    return traces
}

let sendedApiMetaInfos = []
const resetSendedApiMetaInfos = () => {
    sendedApiMetaInfos = []
}
const getSendedApiMetaInfos = () => {
    return sendedApiMetaInfos
}

let sqlMetadata = []
const resetSqlMetaData = () => {
    sqlMetadata = []
}
const getSqlMetadata = () => {
    return sqlMetadata
}

const getSpanEvents = () => {
    return getTraces().flatMap(trace => {
        let spanEvents = trace.callStack.stack.concat(trace.repository.buffer)
        if (trace.repository.spanChunkedSpanEvents) {
            spanEvents = spanEvents.concat(trace.repository.spanChunkedSpanEvents)
        }
        return spanEvents
    })
}

const getSpanEventByAsyncId = (asyncId) => {
    return getSpanEvents().find(spanEvent => spanEvent.asyncId?.getAsyncId() === asyncId.getAsyncId())
}

const getCallerTraceByAsyncId = (asyncId) => {
    return getTraces().find(trace => {
        let spanEvents = trace.callStack.stack.concat(trace.repository.buffer)
        if (trace.repository.spanChunkedSpanEvents) {
            spanEvents = spanEvents.concat(trace.repository.spanChunkedSpanEvents)
        }
        const asyncSpanEvent = spanEvents.find(spanEvent => spanEvent.asyncId?.getAsyncId() === asyncId.getAsyncId())
        return asyncSpanEvent ? trace : null
    })
}

class MockAgent extends Agent {
    constructor(initOptions) {
        initOptions.collector['span-port'] = -1
        initOptions.collector['stat-port'] = -1
        initOptions.collector['tcp-port'] = -1
        initOptions = portProperties(initOptions)
        super(initOptions)
    }

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

        let grpcDataSender
        if (json instanceof GrpcDataSender) {
            grpcDataSender = json
            json = undefined
        }
        json = portProperties(json)
        if (!json) {
            json = require('../pinpoint-config-test')
        } else {
            json = Object.assign({}, require('../pinpoint-config-test'), json)
        }
        require('../../lib/config').clear()
        const config = require('../../lib/config').getConfig(json)
        this.config = config

        this.agentInfo = this.createAgentInfo(this.config, Date.now())

        sqlMetadataService.cache = new SimpleCache(1024)
        this.traceContext.isSampling = sampler.getIsSampling(config.sampling, config.sampleRate)
        if (sampler.getSamplingCountGenerator()) {
            sampler.getSamplingCountGenerator().reset()
        }
        activeRequestRepository.activeTraceCache.cache.clear()
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

        const dataSender = this.makeDataSender(grpcDataSender)
        this.traceContext.dataSender = dataSender
        this.dataSender.close()
        this.dataSender = dataSender
        // this.initializeDataSender(dataSender)
        stringMetaService.init(dataSender)
        apiMetaService.init(dataSender)
        sqlMetadataService.setDataSender(dataSender)

        resetTraces()
        const findSpanEvents = function () {
            let spanEvents = this.callStack.stack.concat(this.repository.buffer)
            if (this.repository.spanChunkedSpanEvents) {
                spanEvents = spanEvents.concat(this.repository.spanChunkedSpanEvents)
            }
            if (this.spanBuilder?.spanEventList) {
                spanEvents = spanEvents.concat(this.spanBuilder.spanEventList)
            }
            return spanEvents
        }
        const findSpanEventByAsyncId = function (asyncId) {
            return this.findSpanEvents().find(spanEvent => spanEvent.asyncId?.getAsyncId() === asyncId.getAsyncId())
        }
        shimmer.wrap(this.traceContext, 'newTrace', function (origin) {
            return function () {
                const returned = origin.apply(this, arguments)
                returned.findSpanEvents = findSpanEvents
                returned.findSpanEventByAsyncId = findSpanEventByAsyncId
                const sendSpanChunkFunction = returned.repository.sendSpanChunk
                returned.repository.sendSpanChunk = function () {
                    const result = sendSpanChunkFunction.apply(this, arguments)
                    if (!returned.repository.spanChunkedSpanEvents) {
                        returned.repository.spanChunkedSpanEvents = []
                    }
                    returned.repository.spanChunkedSpanEvents.push(arguments[0])
                    return result
                }
                const closeOrigin = returned.close
                returned.close = function () {
                    const result = closeOrigin.apply(this, arguments)
                    returned.closeCallback?.(returned)
                    return result
                }
                getTraces().push(returned)
                return returned
            }
        })

        shimmer.wrap(this.traceContext, 'continueAsyncContextTraceObject', function (origin) {
            return function () {
                const returned = origin.apply(this, arguments)
                returned.findSpanEvents = findSpanEvents
                returned.findSpanEventByAsyncId = findSpanEventByAsyncId
                if (returned.repository) {
                    const sendSpanChunkFunction = returned.repository.sendSpanChunk
                    returned.repository.sendSpanChunk = function () {
                        const result = sendSpanChunkFunction.apply(this, arguments)
                        if (!returned.repository.spanChunkedSpanEvents) {
                            returned.repository.spanChunkedSpanEvents = []
                        }
                        returned.repository.spanChunkedSpanEvents = returned.repository.spanChunkedSpanEvents.concat(arguments[0])
                        return result
                    }
                }
                const closeOrigin = returned.close
                returned.close = function () {
                    const result = closeOrigin.apply(this, arguments)
                    returned.closeCallback?.(returned)
                    return result
                }
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

        resetSqlMetaData()
        shimmer.wrap(sqlMetadataService, 'send', function (origin) {
            return function () {
                const returned = origin.apply(this, arguments)
                getSqlMetadata().push(arguments[0])
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
        if (conf instanceof GrpcDataSender) {
            const grpcDataSender = conf
            this.bindHttp(grpcDataSender)
        } else {
            conf = portProperties(conf)
            conf = Object.assign({}, { 'trace-location-and-filename-of-call-site': true }, conf)
            this.bindHttp(conf)
        }
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

    getTraceByAsyncId(asyncId) {
        return getTraces().find(trace => trace.findSpanEventByAsyncId(asyncId))
    }

    getSpanEventByAsyncId(asyncId) {
        return getSpanEventByAsyncId(asyncId)
    }

    getSendedApiMetaInfos() {
        return getSendedApiMetaInfos()
    }

    getSqlMetadata() {
        return getSqlMetadata()
    }

    getCallerTraceByAsyncId(asyncId) {
        return getCallerTraceByAsyncId(asyncId)
    }

    makeDataSender(grpcDataSender) {
        return dataSenderMock(this.config, this.agentInfo, grpcDataSender)
    }
}

function portProperties(conf) {
    if (!conf) {
        return conf
    }

    if (typeof conf !== 'number') {
        if (conf.collector) {
            return conf
        }
        const collectorConf = Object.assign({ 'ip': '127.0.0.1', 'span-port': -1, 'stat-port': -1, 'tcp-port': -1 })
        return Object.assign(conf, { collector: collectorConf })
    }
    const portNumber = conf
    const collectorConf = Object.assign(require('../pinpoint-config-test').collector, { 'span-port': portNumber, 'stat-port': portNumber, 'tcp-port': portNumber })
    return Object.assign({ collector: collectorConf })
}


const agent = new MockAgent(require('../pinpoint-config-test'))
module.exports = agent