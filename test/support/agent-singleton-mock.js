/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const dataSenderMock = require('./data-sender-mock')
const shimmer = require('@pinpoint-apm/shimmer')
const activeTrace = require('../../lib/metric/active-trace')
const localStorage = require('../../lib/instrumentation/context/local-storage')
const sqlMetadataService = require('../../lib/instrumentation/sql/sql-metadata-service')
const SimpleCache = require('../../lib/utils/simple-cache')
const TraceSampler = require('../../lib/context/trace/trace-sampler')
const transactionIdGenerator = require('../../lib/context/sequence-generators').transactionIdGenerator
const closedTraceWrapped = Symbol('closedTraceWrapped')
const stringMetaService = require('../../lib/context/string-meta-service')
const apiMetaService = require('../../lib/context/api-meta-service')
const activeRequestRepository = require('../../lib/metric/active-request-repository')
const GrpcDataSender = require('../../lib/client/grpc-data-sender')
const { AgentBuilder } = require('../../lib/agent-builder')
const AgentInfo = require('../../lib/data/dto/agent-info')
const { getConfig, clear } = require('../../lib/config')
const { ConfigBuilder } = require('../../lib/config-builder')

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

function portProperties(conf) {
    if (!conf) {
        return conf
    }

    if (typeof conf !== 'number') {
        if (conf.collector) {
            return conf
        }
        const collectorConf = { 'ip': '127.0.0.1', 'spanPort': -1, 'statPort': -1, 'tcpPort': -1 }
        return Object.assign(conf, { collector: collectorConf })
    }
    const portNumber = conf
    const baseCollector = require('../pinpoint-config-test2.json').collector
    const collectorConf = Object.assign({}, baseCollector, { 'spanPort': portNumber, 'statPort': portNumber, 'tcpPort': portNumber })
    return Object.assign({ collector: collectorConf })
}

const config = new ConfigBuilder({ collector: {
    spanPort: -1,
    statPort: -1,
    tcpPort: -1
}}).build()
const agentInfo = AgentInfo.make(config)
const agentBuilder = new AgentBuilder(agentInfo)
    .setConfig(config)
    .setDataSender(dataSenderMock(config, agentInfo))
    .disablePingScheduler()
    .disableStatsScheduler()
const agent = agentBuilder.build()

class MockAgent {
    bindHttp(json) {
        let grpcDataSender
        if (json instanceof GrpcDataSender) {
            grpcDataSender = json
            json = undefined
        }
        json = portProperties(json)
        if (!json) {
            json = require('../pinpoint-config-test2.json')
        } else {
            json = Object.assign({}, require('../pinpoint-config-test2.json'), json)
        }
        clear()
        const config = new ConfigBuilder(json).build()
        this.config = config

        this.agentInfo = AgentInfo.make(config)

        sqlMetadataService.cache = new SimpleCache(1024)
        activeRequestRepository.activeTraceCache.cache.clear()
        transactionIdGenerator.reset()

        localStorage.disable()

        const activeTraces = activeTrace.getAllTraces()
        activeTraces.forEach((value) => {
            activeTrace.remove(value)
        })

        this.traceContext.traceSampler = new TraceSampler(this.agentInfo, config)
        this.traceContext.config = config

        const dataSender = dataSenderMock(this.config, this.agentInfo, grpcDataSender)
        this.traceContext.dataSender = dataSender
        this.dataSender.close()
        this.dataSender = dataSender
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
        if (!(conf instanceof GrpcDataSender)) {
            conf = portProperties(conf)
            conf = Object.assign({}, { 'trace-location-and-filename-of-call-site': true }, conf)
        }
        this.bindHttp(conf)
    }

    getTrace(index) {
        return getTraces()[index]
    }

    getTraces() {
        return getTraces()
    }

    getSendedApiMetaInfos() {
        return getSendedApiMetaInfos()
    }

    getSqlMetadata() {
        return getSqlMetadata()
    }

    getSpanEventByAsyncId(asyncId) {
        return getSpanEventByAsyncId(asyncId)
    }
}

// ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf
// ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain
Object.setPrototypeOf(MockAgent.prototype, agent)
const mockAgent = new MockAgent()
mockAgent.start()

module.exports = mockAgent