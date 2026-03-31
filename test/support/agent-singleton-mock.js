/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const dataSenderMock = require('./data-sender-mock')
const shimmer = require('@pinpoint-apm/shimmer')
const localStorage = require('../../lib/instrumentation/context/local-storage')
const { SqlMetadataService } = require('../../lib/instrumentation/sql/sql-metadata-service')
const { IntIdParsingResultFactory } = require('../../lib/context/trace/parsing-result-factory')
const { UidParsingResultFactory } = require('../../lib/metric/sql/uid-parsing-result-factory')
const { SqlStatsConfigBuilder } = require('../../lib/metric/sql/sql-stats-config-builder')
const TraceSampler = require('../../lib/context/trace/trace-sampler')
const transactionIdGenerator = require('../../lib/context/sequence-generators').transactionIdGenerator
const closedTraceWrapped = Symbol('closedTraceWrapped')
const stringMetaService = require('../../lib/context/string-meta-service')
const apiMetaService = require('../../lib/context/api-meta-service')
const activeRequestRepository = require('../../lib/metric/active-request-repository')
const GrpcDataSender = require('../../lib/client/grpc-data-sender')
const { AgentBuilder } = require('../../lib/agent-builder')
const AgentInfo = require('../../lib/data/dto/agent-info')
const { ConfigBuilder } = require('../../lib/config-builder')
const { UriStatsRepositoryBuilder } = require('../../lib/metric/uri/uri-stats-repository')
const { UriStatsConfigBuilder } = require('../../lib/metric/uri/uri-stats-config-builder')
const { SpanRecorderFactory } = require('../../lib/context/trace/span-recorder-factory')
const { UriStatsSpanRecorderFactory } = require('../../lib/metric/uri/uri-stats-span-recorder-factory')
const { TraceCompletionEnricher } = require('../../lib/metric/uri/trace-completion-enricher')
const { ErrorAnalysisConfigBuilder } = require('../../lib/context/trace/error-analysis-config-builder')
const { ExceptionEnricher, exceptionEnricherNullObject } = require('../../lib/context/trace/exception-enricher')
const SpanEventRecorderFactory = require('../../lib/context/trace/span-event-recorder-factory')
const { CompositeTraceCompletionEnricher } = require('../../lib/context/trace/composite-trace-completion-enricher')

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
    const baseCollector = require('../pinpoint-config-test.json').collector
    const collectorConf = Object.assign({}, baseCollector, { 'spanPort': portNumber, 'statPort': portNumber, 'tcpPort': portNumber })
    return Object.assign({ collector: collectorConf })
}

const config = new ConfigBuilder({
        collector: {
            spanPort: -1,
            statPort: -1,
            tcpPort: -1
        }
    })
    .setDefaultJson(require('../pinpoint-config-test.json'))
    .build()
const agentInfo = AgentInfo.make(config)
const initialUriStatsConfig = new UriStatsConfigBuilder(config).build()
const agentBuilder = new AgentBuilder(agentInfo)
    .setConfig(config)
    .setDataSender(dataSenderMock(config, agentInfo))
    .disablePingScheduler()
    .disableStatsScheduler()
    .setSpanRecorderFactory(new UriStatsSpanRecorderFactory(config, initialUriStatsConfig))
    .addEnricher(new TraceCompletionEnricher(new UriStatsRepositoryBuilder(initialUriStatsConfig).build()))
const agent = agentBuilder.build()

class MockAgent {
    bindHttp(json = { collector: { spanPort: -1, statPort: -1, tcpPort: -1 } }) {
        let grpcDataSender
        if (json instanceof GrpcDataSender) {
            grpcDataSender = json
            json = undefined
        }
        json = portProperties(json)
        if (!json) {
            json = require('../pinpoint-config-test.json')
        } else {
            json = Object.assign({}, require('../pinpoint-config-test.json'), json)
        }
        const config = new ConfigBuilder(json).build()
        const uriStatsConfig = new UriStatsConfigBuilder(config).build()
        const uriStatsRepository = new UriStatsRepositoryBuilder(uriStatsConfig).build()
        this.config = config

        this.agentInfo = AgentInfo.make(config)

        activeRequestRepository.activeTraceCache.cache.clear()
        transactionIdGenerator.reset()

        localStorage.disable()

        this.traceContext.traceSampler = new TraceSampler(this.agentInfo, config)
        this.traceContext.config = config
        this.traceContext.traceCompletionEnricher = uriStatsConfig.isUriStatsEnabled()
            ? new CompositeTraceCompletionEnricher([new TraceCompletionEnricher(uriStatsRepository)])
            : new CompositeTraceCompletionEnricher([])
        this.traceContext.spanRecorderFactory = uriStatsConfig.isUriStatsEnabled()
            ? new UriStatsSpanRecorderFactory(config, uriStatsConfig)
            : new SpanRecorderFactory(config)
        const errorAnalysisConfig = new ErrorAnalysisConfigBuilder(config).build()
        const spanEventEnricher = errorAnalysisConfig.isErrorAnalysisEnabled() ? new ExceptionEnricher(errorAnalysisConfig) : exceptionEnricherNullObject

        const dataSender = dataSenderMock(this.config, this.agentInfo, grpcDataSender)
        this.traceContext.dataSender = dataSender
        const sqlStatsConfig = new SqlStatsConfigBuilder(config).build()
        const parsingResultFactory = sqlStatsConfig.isSqlStatsEnabled() ? new UidParsingResultFactory() : new IntIdParsingResultFactory()
        const sqlMetadataService = new SqlMetadataService(dataSender, parsingResultFactory)
        this.traceContext.spanEventRecorderFactory = new SpanEventRecorderFactory(sqlMetadataService, spanEventEnricher)
        this.dataSender.close()
        this.dataSender = dataSender
        stringMetaService.init(dataSender)
        apiMetaService.init(dataSender)

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

// ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf
// ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain
Object.setPrototypeOf(MockAgent.prototype, agent)
const mockAgent = new MockAgent()
mockAgent.start()

module.exports = mockAgent