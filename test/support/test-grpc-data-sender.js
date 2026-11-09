/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const grpc = require('@grpc/grpc-js')
const { Empty } = require('google-protobuf/google/protobuf/empty_pb')
const services = require('../../lib/data/v1/Service_grpc_pb')
const spanMessages = require('../../lib/data/v1/Span_pb')
const cmdMessages = require('../../lib/data/v1/Cmd_pb')
const GrpcDataSender = require('../../lib/client/grpc-data-sender')
const { ConfigBuilder } = require('../../lib/config-builder')
const { ClientHeader, makeClientHeaderInterceptor } = require('../../lib/name/client-header')

// The default v1.Agent and v1.Metadata retry policy with millisecond backoffs, so retry tests do not wait seconds between attempts.
const fastRetryServiceConfig = {
    methodConfig: [
        {
            name: [
                { service: 'v1.Agent' },
                { service: 'v1.Metadata' },
            ],
            retryPolicy: {
                maxAttempts: 3,
                initialBackoff: '0.01s',
                maxBackoff: '0.05s',
                backoffMultiplier: 2,
                retryableStatusCodes: [14],
            },
        },
    ]
}

class TestGrpcDataSenderBuilder {
    constructor(json = {}) {
        this.json = json
        this.adaptors = []
        this.interceptors = []
    }

    addAdaptor(adaptor) {
        this.adaptors.push(adaptor)
        return this
    }

    addInterceptor(interceptor) {
        this.interceptors.push(interceptor)
        return this
    }

    async build() {
        const server = serverWithAdaptors(this.adaptors)
        const port = await bindServer(server, 'localhost:0')
        const config = configWithPort(this.json, port)
        const TestGrpcDataSender = testGrpcDataSenderClass(this.adaptors)
        return new TestGrpcDataSender(config, [makeClientHeaderInterceptor(ClientHeader.make(String(Date.now()), config)), ...this.interceptors], server, port)
    }
}

function serverWithAdaptors(adaptors) {
    const server = new grpc.Server()
    servicesWithHandlers(adaptors).forEach((handlers, service) => {
        server.addService(service, handlers)
    })
    return server
}

function servicesWithHandlers(adaptors) {
    const services = new Map()
    adaptors.forEach(adaptor => {
        services.set(adaptor.service, Object.assign({}, services.get(adaptor.service), adaptor.handlers))
    })
    return services
}

function bindServer(server, address) {
    return new Promise((resolve, reject) => {
        server.bindAsync(address, grpc.ServerCredentials.createInsecure(), (error, port) => {
            if (error) {
                reject(error)
                return
            }
            resolve(port)
        })
    })
}

function configWithPort(json, port) {
    const testJson = require('../fixtures/pinpoint-config-test.json')
    const collector = Object.assign({}, testJson.collector, { spanBatch: { deadlineMillis: 10 } }, json.collector, { ip: 'localhost', spanPort: port, statPort: port, tcpPort: port })
    return new ConfigBuilder(Object.assign({}, testJson, json, { collector })).build()
}

// The class is made per build because GrpcDataSender calls the initializers in its constructor, before a field can tell which clients to create.
function testGrpcDataSenderClass(adaptors) {
    const initializers = new Set(adaptors.flatMap(adaptor => adaptor.initializers))
    const refreshInterval = adaptors.find(adaptor => adaptor.refreshInterval)?.refreshInterval

    return class TestGrpcDataSender extends GrpcDataSender {
        constructor(config, interceptors, server, port) {
            super(config, interceptors)
            this.server = server
            this.port = port
        }

        disconnect() {
            this.server.forceShutdown()
        }

        async restart(...adaptors) {
            this.server = serverWithAdaptors(adaptors)
            return bindServer(this.server, `localhost:${this.port}`)
        }

        close() {
            super.close()
            this.server.forceShutdown()
        }

        initializeClients() {
            if (initializers.has('initializeClients')) {
                super.initializeClients()
            }
        }

        initializeMetadataClients() {
            if (initializers.has('initializeMetadataClients')) {
                super.initializeMetadataClients()
            }
        }

        initializePingStream() {
            if (initializers.has('initializePingStream')) {
                super.initializePingStream()
            }
        }

        initializeAgentInfoScheduler() {
            if (initializers.has('initializeAgentInfoScheduler')) {
                super.initializeAgentInfoScheduler()
            }
        }

        agentInfoRefreshInterval() {
            return refreshInterval ?? super.agentInfoRefreshInterval()
        }

        initializeProfilerClients() {
            if (initializers.has('initializeProfilerClients')) {
                super.initializeProfilerClients()
            }
        }

        initializeSpanBatchSender() {
            if (initializers.has('initializeSpanBatchSender')) {
                super.initializeSpanBatchSender()
            }
        }

        initializeStatStream() {
            if (initializers.has('initializeStatStream')) {
                super.initializeStatStream()
            }
        }
    }
}

class GrpcAdaptor {
    constructor(service, initializers) {
        this.service = service
        this.initializers = initializers
        this.requests = []
        this.metadata = []
        this.waiters = []
        this.responding = true
    }

    receive(request) {
        this.requests.push(request)
        this.waiters = this.waiters.filter(waiter => {
            if (!waiter.match(request)) {
                return true
            }
            waiter.resolve(request)
            return false
        })
    }

    receiveMetadata(metadata) {
        this.metadata.push(metadata)
    }

    waitFor(match) {
        const request = this.requests.find(match)
        if (request) {
            return Promise.resolve(request)
        }
        return new Promise(resolve => {
            this.waiters.push({ match, resolve })
        })
    }

    // From now on receives each unary call without answering it, as a collector that stopped responding
    stopResponding() {
        this.responding = false
        return this
    }
}

class AgentInfoAdaptor extends GrpcAdaptor {
    constructor(handlers = {}) {
        super(services.AgentService, ['initializeClients'])
        this.handlers = Object.assign({
            requestAgentInfo: retryRuleHandler(this, retryRuleResult),
        }, handlers)
    }

    enableScheduler(refreshInterval) {
        this.initializers = ['initializeClients', 'initializeAgentInfoScheduler']
        this.refreshInterval = refreshInterval
        return this
    }
}

// Writes each ping back. A PPing has no field, so pings are kept by the socketid of their ping stream connection
class PingAdaptor extends GrpcAdaptor {
    constructor(handlers = {}) {
        super(services.AgentService, ['initializeClients', 'initializePingStream'])
        this.socketIds = []
        this.clientEnded = false
        this.handlers = Object.assign({
            pingSession: (call) => {
                this.receiveMetadata(call.metadata)
                const socketId = call.metadata.get('socketid')[0]
                this.socketIds.push(socketId)
                call.on('data', (ping) => {
                    this.receive({ socketId, ping })
                    call.write(ping)
                    if (this.pings(socketId).length === this.streamEndCount) {
                        call.end()
                    }
                })
                call.on('end', () => {
                    this.clientEnded = true
                    call.end()
                })
            },
        }, handlers)
    }

    endStreamAfter(count) {
        this.streamEndCount = count
        return this
    }

    connection(connectionNumber) {
        return this.waitFor(({ socketId }) => socketId === this.socketIds[connectionNumber - 1])
            .then(({ socketId }) => socketId)
    }

    pings(socketId) {
        return this.requests.filter(request => request.socketId === socketId)
            .map(({ ping }) => ping)
    }
}

class MetadataAdaptor extends GrpcAdaptor {
    constructor(handlers = {}) {
        super(services.MetadataService, ['initializeMetadataClients'])
        this.handlers = Object.assign({
            requestApiMetaData: retryRuleHandler(this, retryRuleResult),
            requestStringMetaData: retryRuleHandler(this, retryRuleResult),
            requestSqlMetaData: retryRuleHandler(this, retryRuleResult),
            requestSqlUidMetaData: retryRuleHandler(this, retryRuleResult),
            requestExceptionMetaData: retryRuleHandler(this, retryRuleResult),
        }, handlers)
    }

    exceptionMetaData(traceRoot) {
        return this.waitFor(request => request instanceof spanMessages.PExceptionMetaData
            && request.getTransactionid().getAgentid() === traceRoot.getTraceId().getAgentId()
            && request.getTransactionid().getSequence() === traceRoot.getTraceId().getTransactionId()
            && request.getSpanid() === traceRoot.getTraceId().getSpanId())
    }
}

class SpanAdaptor extends GrpcAdaptor {
    constructor(handlers = {}) {
        super(services.SpanService, ['initializeSpanBatchSender'])
        this.handlers = Object.assign({
            sendSpanBatch: (call, callback) => {
                this.receiveMetadata(call.metadata)
                call.request.getSpanList().forEach((spanMessage) => {
                    this.receive(spanMessage.getSpan() ?? spanMessage.getSpanchunk())
                })
                callback(null, new spanMessages.PSpanResultBatch())
            },
        }, handlers)
    }

    span(traceRoot) {
        return this.waitFor(request => request instanceof spanMessages.PSpan
            && request.getTransactionid().getAgentid() === traceRoot.getTraceId().getAgentId()
            && request.getTransactionid().getSequence() === traceRoot.getTraceId().getTransactionId()
            && request.getSpanid() === traceRoot.getTraceId().getSpanId())
    }

    spanChunk(asyncId) {
        return this.waitFor(request => request instanceof spanMessages.PSpanChunk
            && request.getLocalasyncid()?.getAsyncid() === asyncId.getAsyncId()
            && request.getLocalasyncid()?.getSequence() === asyncId.getSequence())
    }
}

class StatAdaptor extends GrpcAdaptor {
    constructor(handlers = {}) {
        super(services.StatService, ['initializeStatStream'])
        this.handlers = Object.assign({
            sendAgentStat: (call, callback) => {
                this.receiveMetadata(call.metadata)
                call.on('data', (statMessage) => {
                    this.receive(statMessage)
                })
                call.on('end', () => {
                    callback(null, new Empty())
                })
            },
        }, handlers)
    }

    agentStat(timestamp) {
        return this.waitFor(statMessage => statMessage.getAgentstat()?.getTimestamp() === timestamp)
    }

    uriStat(timestamp) {
        return this.waitFor(statMessage => statMessage.getAgenturistat()?.getEachuristatList().some(each => each.getTimestamp() === timestamp))
    }
}

class CommandAdaptor extends GrpcAdaptor {
    constructor(handlers = {}) {
        super(services.ProfilerCommandServiceService, ['initializeProfilerClients'])
        this.requestId = 0
        this.pendingCommands = []
        const handleCommand = (call) => {
            this.receiveMetadata(call.metadata)
            this.commandCall = call
            this.pendingCommands.splice(0).forEach(command => call.write(command))
        }
        this.handlers = Object.assign({
            handleCommand,
            handleCommandV2: handleCommand,
            commandEcho: retryRuleHandler(this, () => new Empty()),
            commandStreamActiveThreadCount: (call, callback) => {
                call.on('data', (response) => {
                    this.receive(response)
                })
                call.on('end', () => {
                    callback(null, new Empty())
                })
            },
        }, handlers)
    }

    echoResponse(requestId) {
        return this.waitFor(response => response instanceof cmdMessages.PCmdEchoResponse
            && response.getCommonresponse().getResponseid() === requestId)
    }

    activeThreadCountResponse(requestId) {
        return this.waitFor(response => response instanceof cmdMessages.PCmdActiveThreadCountRes
            && response.getCommonstreamresponse().getResponseid() === requestId)
    }

    writeEcho() {
        const echo = new cmdMessages.PCmdEcho()
        echo.setMessage('echo')
        const request = this.newCommandRequest()
        request.setCommandecho(echo)
        return this.writeCommand(request)
    }

    writeActiveThreadCount() {
        const request = this.newCommandRequest()
        request.setCommandactivethreadcount(new cmdMessages.PCmdActiveThreadCount())
        return this.writeCommand(request)
    }

    newCommandRequest() {
        this.requestId++
        const request = new cmdMessages.PCmdRequest()
        request.setRequestid(this.requestId)
        return request
    }

    writeCommand(request) {
        if (this.commandCall) {
            this.commandCall.write(request)
        } else {
            this.pendingCommands.push(request)
        }
        return this
    }
}

// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/client.ts
function retryRuleHandler(adaptor, response) {
    return (call, callback) => {
        const succeedOnRetryAttempt = call.metadata.get('succeed-on-retry-attempt')
        const previousAttempts = call.metadata.get('grpc-previous-rpc-attempts')
        if (succeedOnRetryAttempt.length === 0 || (previousAttempts.length > 0 && previousAttempts[0] === succeedOnRetryAttempt[0])) {
            adaptor.receiveMetadata(call.metadata)
            adaptor.receive(call.request)
            if (adaptor.responding) {
                callback(null, response(succeedOnRetryAttempt[0], previousAttempts[0]))
            }
        } else {
            const statusCode = call.metadata.get('respond-with-status')
            const code = statusCode[0] ? Number.parseInt(statusCode[0]) : grpc.status.UNKNOWN
            callback({ code: code, details: `Failed on retry ${previousAttempts[0] ?? 0}` })
        }
    }
}

function retryRuleResult(succeedOnRetryAttempt, previousAttempts) {
    const result = new spanMessages.PResult()
    result.setSuccess(true)
    result.setMessage(`succeed-on-retry-attempt: ${succeedOnRetryAttempt}, grpc-previous-rpc-attempts: ${previousAttempts}`)
    return result
}

module.exports = {
    fastRetryServiceConfig,
    TestGrpcDataSenderBuilder,
    AgentInfoAdaptor,
    PingAdaptor,
    MetadataAdaptor,
    SpanAdaptor,
    StatAdaptor,
    CommandAdaptor,
}
