/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const RecordingDataSender = require('./recording-data-sender')
const DataSender = require('../../lib/client/data-sender')
const { ClientHeader, makeClientHeaderInterceptor } = require('../../lib/name/client-header')
const shimmer = require('@pinpoint-apm/shimmer')
const transactionIdGenerator = require('../../lib/context/sequence-generators').transactionIdGenerator
const closedTraceWrapped = Symbol('closedTraceWrapped')
const apiMetaService = require('../../lib/context/api-meta-service')
const activeRequestRepository = require('../../lib/metric/active-request-repository')
const GrpcDataSender = require('../../lib/client/grpc-data-sender')
const { ProcessAgentBuilder } = require('./process-agent-builder')

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
    const baseCollector = require('../fixtures/pinpoint-config-test.json').collector
    const collectorConf = Object.assign({}, baseCollector, { 'spanPort': portNumber, 'statPort': portNumber, 'tcpPort': portNumber })
    return Object.assign({ collector: collectorConf })
}

// A GrpcDataSender passed to bindHttp(), or a collector port in its config, sends to a local gRPC server as well
function recordingDataSender(config, grpcDataSender, agentStartTime) {
    if (grpcDataSender) {
        return new RecordingDataSender(new DataSender(config, grpcDataSender))
    }
    if (config.collector.spanPort > 0) {
        return new RecordingDataSender(new DataSender(config, new GrpcDataSender(config, [makeClientHeaderInterceptor(ClientHeader.make(agentStartTime, config))])))
    }
    return new RecordingDataSender()
}

const agentBuilder = new ProcessAgentBuilder({ collector: { spanPort: -1, statPort: -1, tcpPort: -1 } })
agentBuilder
    .setDataSender(new RecordingDataSender())
    .disablePingScheduler()
    .disableStatsScheduler()
const agent = agentBuilder.build()

class MockAgent {
    bindHttp(json = { collector: { spanPort: -1, statPort: -1, tcpPort: -1 } }) {
        let grpcDataSender
        if (json instanceof GrpcDataSender) {
            grpcDataSender = json
            json = undefined
        }
        activeRequestRepository.activeTraceCache.cache.clear()
        resetResponseTimeCollector(activeRequestRepository.responseTimeCollector)
        transactionIdGenerator.reset()

        const builder = new ProcessAgentBuilder(portProperties(json))
        builder.setDataSender(recordingDataSender(builder.config, grpcDataSender, this.agentStartTime)).build()
        const sqlMetadataService = this.traceContext.spanEventRecorderFactory.sqlMetadataService

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
        if (!trace || trace[closedTraceWrapped]) {
            return
        }

        const originClose = trace.close
        let callbackCalled = false
        trace.close = function () {
            const result = originClose.apply(trace, arguments)
            if (!callbackCalled) {
                callbackCalled = true
                callback(trace)
            }
            return result
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

function resetResponseTimeCollector(responseTimeCollector) {
    if (typeof responseTimeCollector.reset !== 'function') {
        responseTimeCollector.reset = function () {
            this.totalTime = 0
            this.count = 0
            this.max = 0
        }
    }
    responseTimeCollector.reset()
}

// ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf
// ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain
Object.setPrototypeOf(MockAgent.prototype, agent)
const mockAgent = new MockAgent()
mockAgent.start()

module.exports = mockAgent