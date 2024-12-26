/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const agent = require('../../support/agent-singleton-mock')
const express = require('express')
const axios = require('axios')
const MethodDescriptorBuilder = require('../../../lib/context/method-descriptor-builder')
const apiMetaService = require('../../../lib/context/api-meta-service')
const { expected } = require('../../fixtures/instrument-support')
const mysql = require('mysql')
const path = require('path')
const fixtures = path.resolve(__dirname, '..', '..', 'fixtures', 'db')
const { MySqlContainer } = require('@testcontainers/mysql')
const expressServiceType = require('../../../lib/instrumentation/module/express/express-service-type')
const mysqlServiceType = require('../../../lib/instrumentation/module/mysql/mysql-service-type')
const mysqlExecuteQueryServiceType = require('../../../lib/instrumentation/module/mysql/mysql-execute-query-service-type')
const defaultPredefinedMethodDescriptorRegistry = require('../../../lib/constant/default-predefined-method-descriptor-registry')
const ServiceType = require('../../../lib/context/service-type')
const mysql2 = require('mysql2')
const grpc = require('@grpc/grpc-js')
const services = require('../../../lib/data/v1/Service_grpc_pb')
const spanMessages = require('../../../lib/data/v1/Span_pb')
const log = require('../../../lib/utils/logger')
const { Empty } = require('google-protobuf/google/protobuf/empty_pb')
const sqlMetadataService = require('../../../lib/instrumentation/sql/sql-metadata-service')

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

let spanOrSpanChunks = []
const resetSpanOrSpanChunks = () => {
    spanOrSpanChunks = []
}
const getSpanOrSpanChunks = () => {
    return spanOrSpanChunks
}
const getSpanChunk = (asyncId) =>{
    return getSpanOrSpanChunks().find(spanOrSpanChunk => spanOrSpanChunk.getLocalasyncid().getAsyncid() === asyncId.getAsyncId() && spanOrSpanChunk.getLocalasyncid().getSequence() === asyncId.getSequence())
}

let spanMessageEndEventCallback
let dataStreamCount = 0
const spanMessageStreamService = (call) => {
    call.on('data', (spanMessage) => {
        const spanOrSpanChunk = spanMessage.getSpan() ?? spanMessage.getSpanchunk()
        const spanOrSpanChunks = getSpanOrSpanChunks()
        spanOrSpanChunks.push(spanOrSpanChunk)
        if (agent.getTraces().length === ++dataStreamCount) {
            spanMessageEndEventCallback?.()
        }
    })
    call.on('end', () => {})
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
    const collectorServer = new grpc.Server()
    collectorServer.addService(services.AgentService, {
        pingSession: callStreamPingSession
    })
    collectorServer.addService(services.StatService, {
        sendAgentStat: sendAgentStat
    })
    collectorServer.addService(services.SpanService, {
        sendSpan: spanMessageStreamService
    })
    collectorServer.addService(services.MetadataService, {
        requestApiMetaData: pResultReturnUnaryService,
        requestSqlUidMetaData: pResultReturnUnaryService,
        requestSqlMetaData: pResultReturnUnaryService
    })
    process.env['PINPOINT_PROFILER_SQL_STAT'] = 'true'

    collectorServer.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), async (err, port) => {
        agent.bindHttpWithCallSite(port)
        resetSpanOrSpanChunks()
        const source = path.resolve(fixtures, 'mysql.sql')
        const container = await new MySqlContainer()
            .withCommand(['--default-authentication-plugin=mysql_native_password'])
            .withEnvironment({
                'MYSQL_DATABASE': 'test',
                'TZ': 'Asia/Seoul',
            })
            .withCopyFilesToContainer([{
                source: source,
                target: '/docker-entrypoint-initdb.d/mysql.sql'
            }])
            .start()

        const app = new express()
        app.get('/test1', (req, res) => {
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

            agent.callbackTraceClose(async (trace) => {
                let actualBuilder = new MethodDescriptorBuilder(expected('get', 'app.get'))
                    .setClassName(expected('app', 'Function'))
                    .setLineNumber(129)
                    .setFileName('nested-async-trace.test.js')
                let actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
                let actualSpanEvent = trace.repository.dataSender.mockSpan.spanEventList.find(spanEvent => spanEvent.sequence === 0)
                t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'apiId is equal')
                t.equal(actualMethodDescriptor.apiDescriptor, expected('app.get', 'Function.app.get'), 'apiDescriptor is equal')
                t.equal(actualMethodDescriptor.className, expected('app', 'Function'), 'className is equal')
                t.equal(actualMethodDescriptor.methodName, 'get', 'methodName is equal')
                t.equal(actualSpanEvent.sequence, 0, 'sequence is 0')
                t.equal(actualSpanEvent.depth, 1, 'depth is 0')
                t.equal(actualSpanEvent.serviceType, expressServiceType.getCode(), 'serviceType is express')

                actualBuilder = new MethodDescriptorBuilder('createConnection')
                    .setLineNumber(130)
                    .setFileName('nested-async-trace.test.js')
                actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
                actualSpanEvent = trace.repository.dataSender.mockSpan.spanEventList.find(spanEvent => spanEvent.sequence === 1)
                t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'apiId is equal')
                t.equal(actualSpanEvent.endPoint, 'localhost', 'endPoint is equal')
                t.equal(actualSpanEvent.destinationId, 'test', 'destinationId is equal')
                t.equal(actualSpanEvent.sequence, 1, 'sequence is 1')
                t.equal(actualSpanEvent.depth, 2, 'depth is 2')
                t.equal(actualSpanEvent.serviceType, mysqlServiceType.getCode(), 'serviceType is mysql')

                actualBuilder = new MethodDescriptorBuilder('connect')
                    .setClassName('Connection')
                    .setLineNumber(139)
                    .setFileName('nested-async-trace.test.js')
                actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
                actualSpanEvent = trace.repository.dataSender.mockSpan.spanEventList.find(spanEvent => spanEvent.sequence === 2)
                t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'apiId is equal')
                t.equal(actualSpanEvent.sequence, 2, 'sequence is 2')
                t.equal(actualSpanEvent.depth, 2, 'depth is 3')
                t.equal(actualSpanEvent.serviceType, mysqlServiceType.getCode(), 'serviceType is mysql')
                let actualNextAsyncId = actualSpanEvent.asyncId

                let actualSpanChunk = trace.repository.dataSender.findSpanChunk(actualNextAsyncId)
                t.equal(actualSpanChunk.traceRoot.getTraceId().getSpanId(), trace.spanBuilder.getTraceRoot().getTraceId().getSpanId(), 'spanId is equal')
                t.equal(actualSpanChunk.getTraceRoot(), trace.getTraceRoot(), 'traceRoot is equal')
                t.equal(actualSpanChunk.localAsyncId.getAsyncId(), actualSpanEvent.asyncId.getAsyncId(), 'localAsyncId is equal')
                t.equal(actualSpanChunk.localAsyncId.sequence, 1, 'localAsyncId.sequence is equal')
                t.equal(actualSpanChunk.spanEventList[0].apiId, defaultPredefinedMethodDescriptorRegistry.asyncInvocationDescriptor.apiId, 'apiId is equal')
                t.equal(actualSpanChunk.spanEventList[0].depth, 1, 'depth is equal')
                t.equal(actualSpanChunk.spanEventList[0].sequence, 0, 'sequence is equal')
                t.equal(actualSpanChunk.spanEventList[0].serviceType, ServiceType.async.getCode(), 'serviceType is mysql')

                actualBuilder = new MethodDescriptorBuilder('query')
                    .setClassName('Connection')
                    .setLineNumber(145)
                    .setFileName('nested-async-trace.test.js')
                actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
                actualSpanEvent = trace.spanBuilder.spanEventList.find(spanEvent => spanEvent.sequence === 3)
                t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'apiId is equal')
                t.equal(actualSpanEvent.sequence, 3, 'sequence is 3')
                t.equal(actualSpanEvent.depth, 2, 'depth is 2')
                t.equal(actualSpanEvent.serviceType, mysqlExecuteQueryServiceType.getCode(), 'serviceType is mysql')
                actualNextAsyncId = actualSpanEvent.asyncId

                actualSpanChunk = trace.repository.dataSender.findSpanChunk(actualNextAsyncId)
                t.equal(actualSpanChunk.getTraceRoot(), trace.spanBuilder.getTraceRoot(), 'traceRoot is equal')
                t.equal(actualSpanChunk.getTraceRoot().getTransactionId(), trace.spanBuilder.getTraceRoot().getTransactionId(), 'transactionIdObject is equal')
                t.equal(actualSpanChunk.localAsyncId.asyncId, actualSpanEvent.asyncId.asyncId, 'localAsyncId is equal')
                t.equal(actualSpanChunk.localAsyncId.sequence, 1, 'localAsyncId.sequence is equal')
                t.equal(actualSpanChunk.spanEventList[0].apiId, defaultPredefinedMethodDescriptorRegistry.asyncInvocationDescriptor.apiId, 'apiId is equal')
                t.equal(actualSpanChunk.spanEventList[0].depth, 1, 'depth is equal')
                t.equal(actualSpanChunk.spanEventList[0].sequence, 0, 'sequence is equal')
                t.equal(actualSpanChunk.spanEventList[0].serviceType, ServiceType.async.getCode(), 'serviceType is mysql')

                actualBuilder = new MethodDescriptorBuilder('query')
                    .setClassName('Connection')
                    .setLineNumber(151)
                    .setFileName('nested-async-trace.test.js')
                actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
                actualSpanEvent = actualSpanChunk.spanEventList[1]
                t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'apiId is equal')
                t.equal(actualSpanEvent.depth, 2, 'depth is 3')
                t.equal(actualSpanEvent.sequence, 1, 'sequence is 2')
                t.equal(actualSpanEvent.serviceType, mysqlExecuteQueryServiceType.getCode(), 'serviceType is mysql')
                actualNextAsyncId = actualSpanEvent.asyncId

                actualSpanChunk = trace.repository.dataSender.findSpanChunk(actualNextAsyncId)
                t.equal(actualSpanChunk.spanId, actualSpanEvent.spanId, 'spanId is equal')
                t.equal(actualSpanChunk.getTraceRoot().getTransactionId(), trace.spanBuilder.getTraceRoot().getTransactionId(), 'transactionIdObject is equal')
                t.equal(actualSpanChunk.localAsyncId.asyncId, actualNextAsyncId.asyncId, 'localAsyncId is equal')
                t.equal(actualSpanChunk.localAsyncId.sequence, 1, 'localAsyncId.sequence is equal')
                t.equal(actualSpanChunk.spanEventList[0].apiId, defaultPredefinedMethodDescriptorRegistry.asyncInvocationDescriptor.apiId, 'apiId is equal')
                t.equal(actualSpanChunk.spanEventList[0].depth, 1, 'depth is equal')
                t.equal(actualSpanChunk.spanEventList[0].sequence, 0, 'sequence is equal')
                t.equal(actualSpanChunk.spanEventList[0].serviceType, ServiceType.async.getCode(), 'serviceType is mysql')

                connection.end()
            })
        })

        spanMessageEndEventCallback = async () => {
            const trace = agent.getTrace(0)
            const childTrace = agent.getTrace(1)
            const actualSpanChunkGrpc = getSpanChunk(childTrace.localAsyncId)
            t.equal(actualSpanChunkGrpc.getVersion(), 1, 'PSpanChunk.version is 1')

            const actualTractionId = actualSpanChunkGrpc.getTransactionid()
            t.equal(actualTractionId.getAgentid(), trace.getTraceRoot().getAgentId(), `PSpanChunk.PTransactionId.agentId is ${trace.getTraceRoot().getAgentId()}`)
            t.equal(typeof actualTractionId.getAgentid(), 'string', 'PSpanChunk.PTransactionId.agentId type is string')
            t.equal(actualTractionId.getAgentstarttime(), trace.getTraceId().getAgentStartTime(), `PSpanChunk.PTransactionId.agentStartTime is ${trace.getTraceId().getAgentStartTime()}`)
            t.equal(typeof actualTractionId.getAgentstarttime(), 'string', 'PSpanChunk.PTransactionId.agentStartTime type is string')
            t.equal(actualTractionId.getSequence(), trace.getTraceRoot().getTransactionId(), `PSpanChunk.PTransactionId.sequence is ${trace.getTraceRoot().getTransactionId()}`)
            t.equal(typeof actualTractionId.getSequence(), 'string', 'PSpanChunk.PTransactionId.sequence type is string')

            const actualSpanChunk = childTrace.repository.spanChunkBuilder
            t.equal(actualSpanChunkGrpc.getSpanid(), actualSpanChunk.traceRoot.getTraceId().getSpanId(), `PSpanChunk.spanId is ${actualSpanChunk.traceRoot.getTraceId().getSpanId()}`)
            t.equal(typeof actualSpanChunkGrpc.getSpanid(), 'string', 'PSpanChunk.spanId type is string')
            t.equal(actualSpanChunkGrpc.getEndpoint(), '', `PSpanChunk.endPoint is '${actualSpanChunkGrpc.getEndpoint()}'`)
            t.equal(typeof actualSpanChunkGrpc.getEndpoint(), 'string', 'PSpanChunk.endPoint type is string')
            t.equal(actualSpanChunkGrpc.getApplicationservicetype(), actualSpanChunk.applicationServiceType, `PSpanChunk.applicationServiceType is ${actualSpanChunk.applicationServiceType}`)
            t.equal(typeof actualSpanChunkGrpc.getApplicationservicetype(), 'number', 'PSpanChunk.applicationServiceType type is number')
            t.equal(actualSpanChunkGrpc.getKeytime(), actualSpanChunk.keyTime, `PSpanChunk.keyTime is ${actualSpanChunk.keyTime}`)
            t.equal(typeof actualSpanChunkGrpc.getKeytime(), 'number', 'PSpanChunk.keyTime type is number')

            const actualLocalAsyncId = actualSpanChunkGrpc.getLocalasyncid()
            t.equal(actualLocalAsyncId.getAsyncid(), actualSpanChunk.localAsyncId.asyncId, `PSpanChunk.PLocalAsyncId.asyncId is ${actualSpanChunk.localAsyncId.asyncId}`)
            t.equal(typeof actualLocalAsyncId.getAsyncid(), 'number', 'PSpanChunk.PLocalAsyncId.asyncId type is number')
            t.equal(actualLocalAsyncId.getSequence(), actualSpanChunk.localAsyncId.sequence, `PSpanChunk.PLocalAsyncId.sequence is ${actualSpanChunk.localAsyncId.sequence}`)
            t.equal(typeof actualLocalAsyncId.getSequence(), 'number', 'PSpanChunk.PLocalAsyncId.sequence type is number')
            t.end()
            trace.repository.dataSender.close()
        }

        const server = app.listen(5006, async () => {
            const result = await axios.get('http://localhost:5006/test1')
            t.equal(result.status, 200, 'status is 200')
            server.close()
        })
        t.teardown(async () => {
            await container.stop()
            collectorServer.forceShutdown()
            delete process.env.PINPOINT_PROFILER_SQL_STAT
        })
    })
})

test(`nested mysql2 async query with express`, async (t) => {
    const collectorServer = new grpc.Server()
    collectorServer.addService(services.AgentService, {
        pingSession: callStreamPingSession
    })
    collectorServer.addService(services.StatService, {
        sendAgentStat: sendAgentStat
    })
    collectorServer.addService(services.SpanService, {
        sendSpan: spanMessageStreamService
    })
    collectorServer.addService(services.MetadataService, {
        requestApiMetaData: pResultReturnUnaryService,
        requestSqlUidMetaData: pResultReturnUnaryService,
        requestSqlMetaData: pResultReturnUnaryService
    })

    collectorServer.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), async (err, port) => {
        agent.bindHttpWithCallSite(port)
        const source = path.resolve(fixtures, 'mysql.sql')
        const container = await new MySqlContainer()
            .withCommand(['--default-authentication-plugin=mysql_native_password'])
            .withEnvironment({
                'MYSQL_DATABASE': 'test',
                'TZ': 'Asia/Seoul',
            })
            .withCopyFilesToContainer([{
                source: source,
                target: '/docker-entrypoint-initdb.d/mysql.sql'
            }])
            .start()

        const app = new express()
        app.get('/test1', async (req, res) => {
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

            agent.callbackTraceClose(async (trace) => {
                t.equal(trace.spanBuilder.serviceType, ServiceType.node.getCode(), 'Span serviceType is node')
                t.true(trace.spanBuilder.remoteAddress === '127.0.0.1' || trace.spanBuilder.remoteAddress === '::1', `remoteAddress is ${trace.spanBuilder.remoteAddress}`)
                let actualBuilder = new MethodDescriptorBuilder(expected('get', 'app.get'))
                    .setClassName(expected('app', 'Function'))
                    .setLineNumber(332)
                    .setFileName('nested-async-trace.test.js')
                let actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
                let actualSpanEvent = trace.spanBuilder.spanEventList.find(spanEvent => spanEvent.sequence === 0)
                t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'apiId is equal')
                t.equal(actualMethodDescriptor.apiDescriptor, expected('app.get', 'Function.app.get'), 'apiDescriptor is equal')
                t.equal(actualMethodDescriptor.className, expected('app', 'Function'), 'className is equal')
                t.equal(actualMethodDescriptor.methodName, 'get', 'methodName is equal')
                t.equal(actualSpanEvent.sequence, 0, 'sequence is 0')
                t.equal(actualSpanEvent.depth, 1, 'depth is 0')
                t.equal(actualSpanEvent.serviceType, expressServiceType.getCode(), 'serviceType is express')

                actualBuilder = new MethodDescriptorBuilder('createConnection')
                    .setLineNumber(333)
                    .setFileName('nested-async-trace.test.js')
                actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
                actualSpanEvent = trace.spanBuilder.spanEventList.find(spanEvent => spanEvent.sequence === 1)
                t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'apiId is equal')
                t.equal(actualSpanEvent.endPoint, 'localhost', 'endPoint is equal')
                t.equal(actualSpanEvent.destinationId, 'test', 'destinationId is equal')
                t.equal(actualSpanEvent.sequence, 1, 'sequence is 1')
                t.equal(actualSpanEvent.depth, 2, 'depth is 2')
                t.equal(actualSpanEvent.serviceType, mysqlServiceType.getCode(), 'serviceType is mysql')

                actualBuilder = new MethodDescriptorBuilder('query')
                    .setClassName('Connection')
                    .setLineNumber(343)
                    .setFileName('nested-async-trace.test.js')
                actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
                actualSpanEvent = trace.spanBuilder.spanEventList.find(spanEvent => spanEvent.sequence === 2)
                t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'apiId is equal')
                t.equal(actualSpanEvent.sequence, 2, 'sequence is 2')
                t.equal(actualSpanEvent.depth, 2, 'depth is 2')
                t.equal(actualSpanEvent.serviceType, mysqlExecuteQueryServiceType.getCode(), 'serviceType is mysql')
                let actualNextAsyncId = actualSpanEvent.asyncId

                let actualSpanChunk = trace.repository.dataSender.findSpanChunk(actualNextAsyncId)
                t.equal(actualSpanChunk.spanId, actualSpanEvent.spanId, 'spanId is equal')
                t.equal(actualSpanChunk.getTraceRoot().getTransactionId(), trace.spanBuilder.getTraceRoot().getTransactionId(), 'transactionIdObject is equal')
                t.equal(actualSpanChunk.localAsyncId.asyncId, actualSpanEvent.asyncId.asyncId, 'localAsyncId is equal')
                t.equal(actualSpanChunk.localAsyncId.sequence, 1, 'localAsyncId.sequence is equal')
                t.equal(actualSpanChunk.spanEventList[0].apiId, defaultPredefinedMethodDescriptorRegistry.asyncInvocationDescriptor.apiId, 'apiId is equal')
                t.equal(actualSpanChunk.spanEventList[0].depth, 1, 'depth is equal')
                t.equal(actualSpanChunk.spanEventList[0].sequence, 0, 'sequence is equal')
                t.equal(actualSpanChunk.spanEventList[0].serviceType, ServiceType.async.getCode(), 'serviceType is mysql')

                actualBuilder = new MethodDescriptorBuilder('query')
                    .setClassName('Connection')
                    .setLineNumber(349)
                    .setFileName('nested-async-trace.test.js')
                actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
                actualSpanEvent = actualSpanChunk.spanEventList[1]
                t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'apiId is equal')
                t.equal(actualSpanEvent.depth, 2, 'depth is 3')
                t.equal(actualSpanEvent.sequence, 1, 'sequence is 2')
                t.equal(actualSpanEvent.serviceType, mysqlExecuteQueryServiceType.getCode(), 'serviceType is mysql')
                actualNextAsyncId = actualSpanEvent.asyncId

                actualSpanChunk = trace.repository.dataSender.findSpanChunk(actualNextAsyncId)
                t.equal(actualSpanChunk.spanId, actualSpanEvent.spanId, 'spanId is equal')
                t.equal(actualSpanChunk.getTraceRoot().getTransactionId(), trace.spanBuilder.getTraceRoot().getTransactionId(), 'transactionIdObject is equal')
                t.equal(actualSpanChunk.localAsyncId.asyncId, actualNextAsyncId.asyncId, 'localAsyncId is equal')
                t.equal(actualSpanChunk.localAsyncId.sequence, 1, 'localAsyncId.sequence is equal')
                t.equal(actualSpanChunk.spanEventList[0].apiId, defaultPredefinedMethodDescriptorRegistry.asyncInvocationDescriptor.apiId, 'apiId is equal')
                t.equal(actualSpanChunk.spanEventList[0].depth, 1, 'depth is equal')
                t.equal(actualSpanChunk.spanEventList[0].sequence, 0, 'sequence is equal')
                t.equal(actualSpanChunk.spanEventList[0].serviceType, ServiceType.async.getCode(), 'serviceType is mysql')

                actualBuilder = new MethodDescriptorBuilder('query')
                    .setClassName('Connection')
                    .setLineNumber(103)
                    .setFileName('promise.js')
                actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
                actualSpanEvent = trace.spanBuilder.spanEventList.find(spanEvent => spanEvent.sequence === 3)
                t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'apiId is equal')
                t.equal(actualSpanEvent.sequence, 3, 'sequence is 3')
                t.equal(actualSpanEvent.depth, 2, 'depth is 2')
                t.equal(actualSpanEvent.serviceType, mysqlExecuteQueryServiceType.getCode(), 'serviceType is mysql')
                actualNextAsyncId = actualSpanEvent.asyncId

                actualSpanChunk = trace.repository.dataSender.findSpanChunk(actualNextAsyncId)
                t.equal(actualSpanChunk.spanId, actualSpanEvent.spanId, 'spanId is equal')
                t.equal(actualSpanChunk.getTraceRoot().getTransactionId(), trace.spanBuilder.getTraceRoot().getTransactionId(), 'transactionIdObject is equal')
                t.equal(actualSpanChunk.localAsyncId.asyncId, actualNextAsyncId.asyncId, 'localAsyncId is equal')
                t.equal(actualSpanChunk.localAsyncId.sequence, 1, 'localAsyncId.sequence is equal')
                t.equal(actualSpanChunk.spanEventList[0].apiId, defaultPredefinedMethodDescriptorRegistry.asyncInvocationDescriptor.apiId, 'apiId is equal')
                t.equal(actualSpanChunk.spanEventList[0].depth, 1, 'depth is equal')
                t.equal(actualSpanChunk.spanEventList[0].sequence, 0, 'sequence is equal')
                t.equal(actualSpanChunk.spanEventList[0].serviceType, ServiceType.async.getCode(), 'serviceType is mysql')

                spanMessageEndEventCallback = async () => {
                    const trace = agent.getTraces()[0]
                    t.true(trace.spanBuilder.remoteAddress === '127.0.0.1' || trace.spanBuilder.remoteAddress === '::1', `remoteAddress is ${trace.spanBuilder.remoteAddress}`)

                    connection.end()
                    t.equal(agent.getSendedApiMetaInfos().length, 0, 'agent.getSendedApiMetaInfos() is empty')
                    t.equal(agent.getSqlMetadata().length, 0, 'agent.getSqlMetadata() is empty')
                    t.end()
                    trace.repository.dataSender.close()
                }
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
                const sendedApiMetaInfos = agent.getSendedApiMetaInfos()
                const index = sendedApiMetaInfos.findIndex(item => item === apiDescriptor)
                sendedApiMetaInfos.splice(index, 1)
            } else {
                const parsingResult = [...sqlMetadataService.cache.cache.entries()]
                    .map(([, value]) => value)
                    .find(parsingResult => parsingResult.sqlMetaDataValue().sqlId === call.request.getSqlid())
                t.equal(call.request.getSqlid(), parsingResult.sqlMetaDataValue().sqlId, `sqlId is ${call.request.getSqlid()}`)
                t.equal(call.request.getSql(), parsingResult.sqlMetaDataValue().sql, `sql is ${call.request.getSql()}`)
                const sendedSqlMetadata = agent.getSqlMetadata()
                const index = sendedSqlMetadata.findIndex(item => item === parsingResult)
                sendedSqlMetadata.splice(index, 1)
            }
        }

        dataStreamCount = 0
        const server = app.listen(5006, async () => {
            const result = await axios.get('http://localhost:5006/test1')
            t.equal(result.status, 200, 'status is 200')
            server.close()
        })
        t.teardown(async () => {
            await container.stop()
            collectorServer.forceShutdown()
        })
    })
})