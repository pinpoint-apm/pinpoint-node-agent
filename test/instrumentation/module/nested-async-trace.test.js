/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const { ProcessAgentBuilder, startAgent } = require('../../support/process-agent-builder')
const { agentStartTime } = startAgent()
const express = require('express')
const axios = require('axios')
const MethodDescriptorBuilder = require('../../../lib/context/method-descriptor-builder')
const apiMetaService = require('../../../lib/context/api-meta-service')
const mysql = require('mysql')
const { startMySql } = require('../../support/shared-containers')
const expressServiceType = require('../../../lib/instrumentation/module/express/express-service-type')
const mysqlServiceType = require('../../../lib/instrumentation/module/mysql/mysql-service-type')
const mysqlExecuteQueryServiceType = require('../../../lib/instrumentation/module/mysql/mysql-execute-query-service-type')
const defaultPredefinedMethodDescriptorRegistry = require('../../../lib/constant/default-predefined-method-descriptor-registry')
const ServiceType = require('../../../lib/context/service-type')
const mysql2 = require('mysql2')
const grpc = require('@grpc/grpc-js')
const services = require('../../../lib/data/v1/Service_grpc_pb')
const spanMessages = require('../../../lib/data/v1/Span_pb')
const log = require('../../../lib/utils/log/logger')
const { Empty } = require('google-protobuf/google/protobuf/empty_pb')
const RecordingDataSender = require('../../support/recording-data-sender')
const DataSender = require('../../../lib/client/data-sender')
const GrpcDataSender = require('../../../lib/client/grpc-data-sender')
const { ClientHeader, makeClientHeaderInterceptor } = require('../../../lib/name/client-header')
const testConfig = require('../../fixtures/pinpoint-config-test.json')
const { SpanAdaptor } = require('../../support/test-grpc-data-sender')

let dataSender

let callbackPresultReturnUnaryService
const pResultReturnUnaryService = (call, callback) => {
    const succeedOnRetryAttempt = call.metadata.get('succeed-on-retry-attempt')
    const previousAttempts = call.metadata.get('grpc-previous-rpc-attempts')

    if (succeedOnRetryAttempt.length === 0 || (previousAttempts.length > 0 && previousAttempts[0] === succeedOnRetryAttempt[0])) {
        const result = new spanMessages.PResult()
        result.setSuccess(`succeed-on-retry-attempt: ${succeedOnRetryAttempt[0]}, grpc-previous-rpc-attempts: ${previousAttempts[0]}`)
        callback?.(null, result)
        callbackPresultReturnUnaryService?.(null, result, call)
    } else {
        const statusCode = call.metadata.get('respond-with-status')
        const code = statusCode[0] ? Number.parseInt(statusCode[0]) : grpc.status.UNKNOWN
        callback({ code: code, details: `Failed on retry ${previousAttempts[0] ?? 0}` })
        callbackPresultReturnUnaryService?.({ code: code, details: `Failed on retry ${previousAttempts[0] ?? 0}` })
    }
}

function sendAgentStat(call, callback) {
    call.on('data', function (statMessage) {

    })
    call.on('error', function (error) {
        log.debug(`error: ${error}`)
    })
    call.on('end', function () {
        callback(null, new Empty())
    })
}

function callStreamPingSession(call) {
    call.on('data', function () {
    })
    call.on('end', () => {
        call.end()
    })
}

test(`nested mysql async query with express`, async (t) => {
    const spanAdaptor = new SpanAdaptor()
    const collectorServer = new grpc.Server()
    collectorServer.addService(services.AgentService, {
        pingSession: callStreamPingSession
    })
    collectorServer.addService(services.StatService, {
        sendAgentStat: sendAgentStat
    })
    collectorServer.addService(services.SpanService, spanAdaptor.handlers)
    collectorServer.addService(services.MetadataService, {
        requestApiMetaData: pResultReturnUnaryService,
        requestSqlUidMetaData: pResultReturnUnaryService,
        requestSqlMetaData: pResultReturnUnaryService
    })
    process.env['PINPOINT_PROFILER_SQL_STAT'] = 'true'

    collectorServer.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), async (err, port) => {
        const builder = new ProcessAgentBuilder({ collector: Object.assign({}, testConfig.collector, { spanPort: port, statPort: port, tcpPort: port }) })
        dataSender = new RecordingDataSender(new DataSender(builder.config, new GrpcDataSender(builder.config, [makeClientHeaderInterceptor(ClientHeader.make(agentStartTime, builder.config))])))
        const agent = builder.setDataSender(dataSender).build()
        const container = await startMySql()

        const app = new express()
        app.get('/test1', (req, res) => {
            const traceRoot = agent.currentTraceObject().getTraceRoot()
            const connection = mysql.createConnection({
                host: container.getHost(),
                port: container.getPort(),
                database: 'test',
                user: container.getUsername(),
                password: container.getUserPassword(),
                acquireTimeout: 1000000,
                timezone: '+09:00'
            })
            connection.connect(function (err) {
                if (err) {
                    console.error('error connecting: ' + err.stack)
                    return
                }
            })
            connection.query(`SELECT * FROM member`, async function (error, results) {
                if (error) throw error
                t.equal(results[0].id, 'a', 'SELECT member id')
                t.equal(results[0].name, 'name1', 'SELECT member name')
                t.equal(results[0].joined.getDate(), new Date('2023-01-18T00:00:00+09:00').getDate(), 'SELECT member joined')

                connection.query(`SELECT * FROM member WHERE id = ?`, results[0].id, async function (error, results) {
                    res.send('ok get')
                })
            })

            dataSender.waitForSpan(traceRoot).then(async (span) => {
                let actualBuilder = new MethodDescriptorBuilder('get')
                    .setClassName('Router')
                let actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
                let actualSpanEvent = span.spanEventList.find(spanEvent => spanEvent.sequence === 0)
                t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'apiId is equal')
                t.equal(actualMethodDescriptor.apiDescriptor, 'Router.get', 'apiDescriptor is equal')
                t.equal(actualMethodDescriptor.className, 'Router', 'className is equal')
                t.equal(actualMethodDescriptor.methodName, 'get', 'methodName is equal')
                t.equal(actualSpanEvent.sequence, 0, 'sequence is 0')
                t.equal(actualSpanEvent.depth, 1, 'depth is 0')
                t.equal(actualSpanEvent.serviceType, expressServiceType.getCode(), 'serviceType is express')

                actualBuilder = new MethodDescriptorBuilder('createConnection')
                actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
                actualSpanEvent = span.spanEventList.find(spanEvent => spanEvent.sequence === 1)
                t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'apiId is equal')
                t.equal(actualSpanEvent.endPoint, container.getHost(), 'endPoint is equal')
                t.equal(actualSpanEvent.destinationId, 'test', 'destinationId is equal')
                t.equal(actualSpanEvent.sequence, 1, 'sequence is 1')
                t.equal(actualSpanEvent.depth, 2, 'depth is 2')
                t.equal(actualSpanEvent.serviceType, mysqlServiceType.getCode(), 'serviceType is mysql')

                actualBuilder = new MethodDescriptorBuilder('connect')
                    .setClassName('Connection')
                actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
                actualSpanEvent = span.spanEventList.find(spanEvent => spanEvent.sequence === 2)
                t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'apiId is equal')
                t.equal(actualSpanEvent.sequence, 2, 'sequence is 2')
                t.equal(actualSpanEvent.depth, 2, 'depth is 3')
                t.equal(actualSpanEvent.serviceType, mysqlServiceType.getCode(), 'serviceType is mysql')
                let actualNextAsyncId = actualSpanEvent.asyncId

                let actualSpanChunk = dataSender.findSpanChunk(actualNextAsyncId)
                t.equal(actualSpanChunk.getTraceRoot(), span.traceRoot, 'traceRoot is equal')
                t.equal(actualSpanChunk.localAsyncId.getAsyncId(), actualSpanEvent.asyncId.getAsyncId(), 'localAsyncId is equal')
                t.equal(actualSpanChunk.localAsyncId.sequence, 1, 'localAsyncId.sequence is equal')
                t.equal(actualSpanChunk.spanEventList[0].apiId, defaultPredefinedMethodDescriptorRegistry.asyncInvocationDescriptor.apiId, 'apiId is equal')
                t.equal(actualSpanChunk.spanEventList[0].depth, 1, 'depth is equal')
                t.equal(actualSpanChunk.spanEventList[0].sequence, 0, 'sequence is equal')
                t.equal(actualSpanChunk.spanEventList[0].serviceType, ServiceType.async.getCode(), 'serviceType is mysql')

                actualBuilder = new MethodDescriptorBuilder('query')
                    .setClassName('Connection')
                actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
                actualSpanEvent = span.spanEventList.find(spanEvent => spanEvent.sequence === 3)
                t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'apiId is equal')
                t.equal(actualSpanEvent.sequence, 3, 'sequence is 3')
                t.equal(actualSpanEvent.depth, 2, 'depth is 2')
                t.equal(actualSpanEvent.serviceType, mysqlExecuteQueryServiceType.getCode(), 'serviceType is mysql')
                actualNextAsyncId = actualSpanEvent.asyncId

                actualSpanChunk = dataSender.findSpanChunk(actualNextAsyncId)
                t.equal(actualSpanChunk.getTraceRoot(), span.traceRoot, 'traceRoot is equal')
                t.equal(actualSpanChunk.localAsyncId.asyncId, actualSpanEvent.asyncId.asyncId, 'localAsyncId is equal')
                t.equal(actualSpanChunk.localAsyncId.sequence, 1, 'localAsyncId.sequence is equal')
                t.equal(actualSpanChunk.spanEventList[0].apiId, defaultPredefinedMethodDescriptorRegistry.asyncInvocationDescriptor.apiId, 'apiId is equal')
                t.equal(actualSpanChunk.spanEventList[0].depth, 1, 'depth is equal')
                t.equal(actualSpanChunk.spanEventList[0].sequence, 0, 'sequence is equal')
                t.equal(actualSpanChunk.spanEventList[0].serviceType, ServiceType.async.getCode(), 'serviceType is mysql')

                actualBuilder = new MethodDescriptorBuilder('query')
                    .setClassName('Connection')
                actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
                actualSpanEvent = actualSpanChunk.spanEventList[1]
                t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'apiId is equal')
                t.equal(actualSpanEvent.depth, 2, 'depth is 3')
                t.equal(actualSpanEvent.sequence, 1, 'sequence is 2')
                t.equal(actualSpanEvent.serviceType, mysqlExecuteQueryServiceType.getCode(), 'serviceType is mysql')
                actualNextAsyncId = actualSpanEvent.asyncId

                actualSpanChunk = dataSender.findSpanChunk(actualNextAsyncId)
                t.equal(actualSpanChunk.getTraceRoot().getTransactionId(), span.traceRoot.getTransactionId(), 'transactionIdObject is equal')
                t.equal(actualSpanChunk.localAsyncId.asyncId, actualNextAsyncId.asyncId, 'localAsyncId is equal')
                t.equal(actualSpanChunk.localAsyncId.sequence, 1, 'localAsyncId.sequence is equal')
                t.equal(actualSpanChunk.spanEventList[0].apiId, defaultPredefinedMethodDescriptorRegistry.asyncInvocationDescriptor.apiId, 'apiId is equal')
                t.equal(actualSpanChunk.spanEventList[0].depth, 1, 'depth is equal')
                t.equal(actualSpanChunk.spanEventList[0].sequence, 0, 'sequence is equal')
                t.equal(actualSpanChunk.spanEventList[0].serviceType, ServiceType.async.getCode(), 'serviceType is mysql')

                connection.end()

                const sentSpanChunk = dataSender.spanChunks()[0]
                const actualSpanChunkGrpc = await spanAdaptor.spanChunk(sentSpanChunk.localAsyncId)
                t.equal(actualSpanChunkGrpc.getVersion(), 1, 'PSpanChunk.version is 1')

                const actualTractionId = actualSpanChunkGrpc.getTransactionid()
                t.equal(actualTractionId.getAgentid(), span.traceRoot.getAgentId(), `PSpanChunk.PTransactionId.agentId is ${span.traceRoot.getAgentId()}`)
                t.equal(typeof actualTractionId.getAgentid(), 'string', 'PSpanChunk.PTransactionId.agentId type is string')
                t.equal(actualTractionId.getAgentstarttime(), span.traceRoot.getTraceId().getAgentStartTime(), `PSpanChunk.PTransactionId.agentStartTime is ${span.traceRoot.getTraceId().getAgentStartTime()}`)
                t.equal(typeof actualTractionId.getAgentstarttime(), 'string', 'PSpanChunk.PTransactionId.agentStartTime type is string')
                t.equal(actualTractionId.getSequence(), span.traceRoot.getTransactionId(), `PSpanChunk.PTransactionId.sequence is ${span.traceRoot.getTransactionId()}`)
                t.equal(typeof actualTractionId.getSequence(), 'string', 'PSpanChunk.PTransactionId.sequence type is string')

                t.equal(actualSpanChunkGrpc.getSpanid(), sentSpanChunk.traceRoot.getTraceId().getSpanId(), `PSpanChunk.spanId is ${sentSpanChunk.traceRoot.getTraceId().getSpanId()}`)
                t.equal(typeof actualSpanChunkGrpc.getSpanid(), 'string', 'PSpanChunk.spanId type is string')
                t.equal(actualSpanChunkGrpc.getEndpoint(), '', `PSpanChunk.endPoint is '${actualSpanChunkGrpc.getEndpoint()}'`)
                t.equal(typeof actualSpanChunkGrpc.getEndpoint(), 'string', 'PSpanChunk.endPoint type is string')
                t.equal(actualSpanChunkGrpc.getApplicationservicetype(), sentSpanChunk.applicationServiceType, `PSpanChunk.applicationServiceType is ${sentSpanChunk.applicationServiceType}`)
                t.equal(typeof actualSpanChunkGrpc.getApplicationservicetype(), 'number', 'PSpanChunk.applicationServiceType type is number')
                t.equal(actualSpanChunkGrpc.getKeytime(), sentSpanChunk.keyTime, `PSpanChunk.keyTime is ${sentSpanChunk.keyTime}`)
                t.equal(typeof actualSpanChunkGrpc.getKeytime(), 'number', 'PSpanChunk.keyTime type is number')

                const actualLocalAsyncId = actualSpanChunkGrpc.getLocalasyncid()
                t.equal(actualLocalAsyncId.getAsyncid(), sentSpanChunk.localAsyncId.asyncId, `PSpanChunk.PLocalAsyncId.asyncId is ${sentSpanChunk.localAsyncId.asyncId}`)
                t.equal(typeof actualLocalAsyncId.getAsyncid(), 'number', 'PSpanChunk.PLocalAsyncId.asyncId type is number')
                t.equal(actualLocalAsyncId.getSequence(), sentSpanChunk.localAsyncId.sequence, `PSpanChunk.PLocalAsyncId.sequence is ${sentSpanChunk.localAsyncId.sequence}`)
                t.equal(typeof actualLocalAsyncId.getSequence(), 'number', 'PSpanChunk.PLocalAsyncId.sequence type is number')
                t.end()
                dataSender.close()
            })
        })

        app.use(express.json())
        app.use(express.urlencoded({
            extended: false
        }))

        const server = app.listen(5006, async () => {
            const result = await axios.get('http://localhost:5006/test1')
            t.equal(result.status, 200, 'status is 200')
            server.close()
        })
        t.teardown(async () => {
            collectorServer.forceShutdown()
            delete process.env.PINPOINT_PROFILER_SQL_STAT
        })
    })
})

test(`nested mysql2 async query with express`, async (t) => {
    const spanAdaptor = new SpanAdaptor()
    const collectorServer = new grpc.Server()
    collectorServer.addService(services.AgentService, {
        pingSession: callStreamPingSession
    })
    collectorServer.addService(services.StatService, {
        sendAgentStat: sendAgentStat
    })
    collectorServer.addService(services.SpanService, spanAdaptor.handlers)
    collectorServer.addService(services.MetadataService, {
        requestApiMetaData: pResultReturnUnaryService,
        requestSqlUidMetaData: pResultReturnUnaryService,
        requestSqlMetaData: pResultReturnUnaryService
    })

    collectorServer.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), async (err, port) => {
        const builder = new ProcessAgentBuilder({ 'trace-location-and-filename-of-call-site': true, collector: Object.assign({}, testConfig.collector, { spanPort: port, statPort: port, tcpPort: port }) })
        dataSender = new RecordingDataSender(new DataSender(builder.config, new GrpcDataSender(builder.config, [makeClientHeaderInterceptor(ClientHeader.make(agentStartTime, builder.config))])))
        const agent = builder.setDataSender(dataSender).build()
        const container = await startMySql()

        const app = new express()
        app.get('/test1', async (req, res) => {
            const traceRoot = agent.currentTraceObject().getTraceRoot()
            const connection = mysql2.createConnection({
                host: container.getHost(),
                port: container.getPort(),
                database: 'test',
                user: container.getUsername(),
                password: container.getUserPassword(),
                timezone: '+09:00'
            })

            let callCount = 0
            connection.query(`SELECT * FROM member`, async function (error, results) {
                if (error) throw error
                t.equal(results[0].id, 'a', 'SELECT member id')
                t.equal(results[0].name, 'name1', 'SELECT member name')
                t.equal(results[0].joined.getDate(), new Date('2023-01-18T00:00:00+09:00').getDate(), 'SELECT member joined')

                connection.query(`SELECT * FROM member WHERE id = ?`, results[0].id, async function (error, results) {
                    callCount++
                    if (callCount == 2) {
                        setTimeout(() => {
                            res.send('ok get')
                        }, 1000)
                    }
                })
            })

            const [rows] = await connection.promise()
                .query(`SELECT * FROM member a WHERE a.id = ?`, 'a')
                .then(([rows]) => {
                    callCount++
                    if (callCount == 2) {
                        setTimeout(() => {
                            res.send('ok get')
                        }, 1000)
                    }
                    return [rows]
                })
            t.equal(rows[0].id, 'a', 'id in SELECT query hooking')
            t.equal(rows[0].name, 'name1', 'name in SELECT query hooking')
            t.equal(rows[0].joined.toISOString().slice(0, 10), '2023-01-17', 'joined in SELECT query hooking')

            dataSender.waitForSpan(traceRoot).then(async (span) => {
                t.equal(span.serviceType, ServiceType.node.getCode(), 'Span serviceType is node')
                t.true(span.remoteAddress === '127.0.0.1' || span.remoteAddress === '::1', `remoteAddress is ${span.remoteAddress}`)
                let actualBuilder = new MethodDescriptorBuilder('get')
                    .setClassName('Router')
                let actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
                let actualSpanEvent = span.spanEventList.find(spanEvent => spanEvent.sequence === 0)
                t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'apiId is equal')
                t.equal(actualMethodDescriptor.apiDescriptor, 'Router.get', 'apiDescriptor is equal')
                t.equal(actualMethodDescriptor.className, 'Router', 'className is equal')
                t.equal(actualMethodDescriptor.methodName, 'get', 'methodName is equal')
                t.equal(actualSpanEvent.sequence, 0, 'sequence is 0')
                t.equal(actualSpanEvent.depth, 1, 'depth is 0')
                t.equal(actualSpanEvent.serviceType, expressServiceType.getCode(), 'serviceType is express')

                actualBuilder = new MethodDescriptorBuilder('createConnection')
                actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
                actualSpanEvent = span.spanEventList.find(spanEvent => spanEvent.sequence === 1)
                t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'apiId is equal')
                t.equal(actualSpanEvent.endPoint, container.getHost(), 'endPoint is equal')
                t.equal(actualSpanEvent.destinationId, 'test', 'destinationId is equal')
                t.equal(actualSpanEvent.sequence, 1, 'sequence is 1')
                t.equal(actualSpanEvent.depth, 2, 'depth is 2')
                t.equal(actualSpanEvent.serviceType, mysqlServiceType.getCode(), 'serviceType is mysql')

                actualBuilder = new MethodDescriptorBuilder('query')
                    .setClassName('Connection')
                actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
                actualSpanEvent = span.spanEventList.find(spanEvent => spanEvent.sequence === 2)
                t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'apiId is equal')
                t.equal(actualSpanEvent.sequence, 2, 'sequence is 2')
                t.equal(actualSpanEvent.depth, 2, 'depth is 2')
                t.equal(actualSpanEvent.serviceType, mysqlExecuteQueryServiceType.getCode(), 'serviceType is mysql')
                let actualNextAsyncId = actualSpanEvent.asyncId

                let actualSpanChunk = dataSender.findSpanChunk(actualNextAsyncId)
                t.equal(actualSpanChunk.getTraceRoot().getTransactionId(), span.traceRoot.getTransactionId(), 'transactionIdObject is equal')
                t.equal(actualSpanChunk.localAsyncId.asyncId, actualSpanEvent.asyncId.asyncId, 'localAsyncId is equal')
                t.equal(actualSpanChunk.localAsyncId.sequence, 1, 'localAsyncId.sequence is equal')
                t.equal(actualSpanChunk.spanEventList[0].apiId, defaultPredefinedMethodDescriptorRegistry.asyncInvocationDescriptor.apiId, 'apiId is equal')
                t.equal(actualSpanChunk.spanEventList[0].depth, 1, 'depth is equal')
                t.equal(actualSpanChunk.spanEventList[0].sequence, 0, 'sequence is equal')
                t.equal(actualSpanChunk.spanEventList[0].serviceType, ServiceType.async.getCode(), 'serviceType is mysql')

                actualBuilder = new MethodDescriptorBuilder('query')
                    .setClassName('Connection')
                actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
                actualSpanEvent = actualSpanChunk.spanEventList[1]
                t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'apiId is equal')
                t.equal(actualSpanEvent.depth, 2, 'depth is 3')
                t.equal(actualSpanEvent.sequence, 1, 'sequence is 2')
                t.equal(actualSpanEvent.serviceType, mysqlExecuteQueryServiceType.getCode(), 'serviceType is mysql')
                actualNextAsyncId = actualSpanEvent.asyncId

                actualSpanChunk = dataSender.findSpanChunk(actualNextAsyncId)
                t.equal(actualSpanChunk.getTraceRoot().getTransactionId(), span.traceRoot.getTransactionId(), 'transactionIdObject is equal')
                t.equal(actualSpanChunk.localAsyncId.asyncId, actualNextAsyncId.asyncId, 'localAsyncId is equal')
                t.equal(actualSpanChunk.localAsyncId.sequence, 1, 'localAsyncId.sequence is equal')
                t.equal(actualSpanChunk.spanEventList[0].apiId, defaultPredefinedMethodDescriptorRegistry.asyncInvocationDescriptor.apiId, 'apiId is equal')
                t.equal(actualSpanChunk.spanEventList[0].depth, 1, 'depth is equal')
                t.equal(actualSpanChunk.spanEventList[0].sequence, 0, 'sequence is equal')
                t.equal(actualSpanChunk.spanEventList[0].serviceType, ServiceType.async.getCode(), 'serviceType is mysql')

                actualBuilder = new MethodDescriptorBuilder('query')
                    .setClassName('Connection')
                actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
                actualSpanEvent = span.spanEventList.find(spanEvent => spanEvent.sequence === 3)
                t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'apiId is equal')
                t.equal(actualSpanEvent.sequence, 3, 'sequence is 3')
                t.equal(actualSpanEvent.depth, 2, 'depth is 2')
                t.equal(actualSpanEvent.serviceType, mysqlExecuteQueryServiceType.getCode(), 'serviceType is mysql')
                actualNextAsyncId = actualSpanEvent.asyncId

                actualSpanChunk = dataSender.findSpanChunk(actualNextAsyncId)
                t.equal(actualSpanChunk.getTraceRoot().getTransactionId(), span.traceRoot.getTransactionId(), 'transactionIdObject is equal')
                t.equal(actualSpanChunk.localAsyncId.asyncId, actualNextAsyncId.asyncId, 'localAsyncId is equal')
                t.equal(actualSpanChunk.localAsyncId.sequence, 1, 'localAsyncId.sequence is equal')
                t.equal(actualSpanChunk.spanEventList[0].apiId, defaultPredefinedMethodDescriptorRegistry.asyncInvocationDescriptor.apiId, 'apiId is equal')
                t.equal(actualSpanChunk.spanEventList[0].depth, 1, 'depth is equal')
                t.equal(actualSpanChunk.spanEventList[0].sequence, 0, 'sequence is equal')
                t.equal(actualSpanChunk.spanEventList[0].serviceType, ServiceType.async.getCode(), 'serviceType is mysql')

                await spanAdaptor.span(span.traceRoot)
                await Promise.all(dataSender.spanChunks().map(spanChunk => spanAdaptor.spanChunk(spanChunk.localAsyncId)))
                t.true(span.remoteAddress === '127.0.0.1' || span.remoteAddress === '::1', `remoteAddress is ${span.remoteAddress}`)

                connection.end()
                t.equal(dataSender.apiMetaInfos().length, 0, 'agent.getSendedApiMetaInfos() is empty')
                t.equal(dataSender.sqlMetaData().length, 0, 'agent.getSqlMetadata() is empty')
                t.end()
                dataSender.close()
            })
        })

        callbackPresultReturnUnaryService = async (error, result, call) => {
            if (typeof call.request.getApiid === 'function') {
                const apiDescriptor = [...apiMetaService.cache.cache.entries()]
                    .map(([, value]) => value)
                    .find(apiDescriptor => apiDescriptor.apiId === call.request.getApiid())
                t.equal(call.request.getApiid(), apiDescriptor.apiId, `apiId is ${call.request.getApiid()}`)
                t.equal(call.request.getApiinfo(), apiDescriptor.getApiDescriptor(), `apiInfo is ${call.request.getApiinfo()}`)
                t.equal(call.request.getLine(), apiDescriptor.lineNumber, `line is ${call.request.getLine()}`)
                t.equal(call.request.getLocation(), apiDescriptor.getLocation(), `location is ${call.request.getLocation()}`)
                t.equal(call.request.getType(), apiDescriptor.getType(), `type is ${call.request.getType()}`)
                const sendedApiMetaInfos = dataSender.apiMetaInfos()
                const index = sendedApiMetaInfos.findIndex(item => item.apiId === apiDescriptor.apiId)
                sendedApiMetaInfos.splice(index, 1)
            } else {
                const parsingResult = [...agent.getTraceContext().spanEventRecorderFactory.sqlMetadataService.cache.cache.entries()]
                    .map(([, value]) => value)
                    .find(parsingResult => parsingResult.sqlMetaDataValue().sqlId === call.request.getSqlid())
                t.equal(call.request.getSqlid(), parsingResult.sqlMetaDataValue().sqlId, `sqlId is ${call.request.getSqlid()}`)
                t.equal(call.request.getSql(), parsingResult.sqlMetaDataValue().sql, `sql is ${call.request.getSql()}`)
                const sendedSqlMetadata = dataSender.sqlMetaData()
                const index = sendedSqlMetadata.findIndex(item => item.sqlId === parsingResult.sqlMetaDataValue().sqlId)
                sendedSqlMetadata.splice(index, 1)
            }
        }

        const server = app.listen(5006, async () => {
            const result = await axios.get('http://localhost:5006/test1')
            t.equal(result.status, 200, 'status is 200')
            server.close()
        })
        t.teardown(async () => {
            collectorServer.forceShutdown()
        })
    })
})