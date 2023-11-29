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
const { MySqlContainer } = require('testcontainers')
const expressServiceType = require('../../../lib/instrumentation/module/express/express-service-type')
const mysqlServiceType = require('../../../lib/instrumentation/module/mysql/mysql-service-type')
const mysqlExecuteQueryServiceType = require('../../../lib/instrumentation/module/mysql/mysql-execute-query-service-type')
const defaultPredefinedMethodDescriptorRegistry = require('../../../lib/constant/default-predefined-method-descriptor-registry')
const ServiceType = require('../../../lib/context/service-type')

test(`nested mysql async query with express`, async (t) => {
    agent.bindHttpWithCallSite()
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
                                        .setLineNumber(40)
                                        .setFileName('nested-async-trace.test.js')
            let actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            let actualSpanEvent = trace.span.spanEventList.find( spanEvent => spanEvent.sequence === 0)
            t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'apiId is equal')
            t.equal(actualMethodDescriptor.apiDescriptor, expected('app.get', 'Function.app.get'), 'apiDescriptor is equal')
            t.equal(actualMethodDescriptor.className, expected('app', 'Function'), 'className is equal')
            t.equal(actualMethodDescriptor.methodName, 'get', 'methodName is equal')
            t.equal(actualSpanEvent.sequence, 0, 'sequence is 0')
            t.equal(actualSpanEvent.depth, 1, 'depth is 0')
            t.equal(actualSpanEvent.serviceType, expressServiceType.getCode(), 'serviceType is express')

            actualBuilder = new MethodDescriptorBuilder('createConnection')
                                    .setLineNumber(41)
                                    .setFileName('nested-async-trace.test.js')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            actualSpanEvent = trace.span.spanEventList.find( spanEvent => spanEvent.sequence === 1)
            t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'apiId is equal')
            t.equal(actualSpanEvent.endPoint, 'localhost', 'endPoint is equal')
            t.equal(actualSpanEvent.destinationId, 'test', 'destinationId is equal')
            t.equal(actualSpanEvent.sequence, 1, 'sequence is 1')
            t.equal(actualSpanEvent.depth, 2, 'depth is 2')
            t.equal(actualSpanEvent.serviceType, mysqlServiceType.getCode(), 'serviceType is mysql')

            actualBuilder = new MethodDescriptorBuilder('connect')
                                    .setClassName('Connection')
                                    .setLineNumber(50)
                                    .setFileName('nested-async-trace.test.js')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            actualSpanEvent = trace.span.spanEventList.find( spanEvent => spanEvent.sequence === 2)
            t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'apiId is equal')
            t.equal(actualSpanEvent.sequence, 2, 'sequence is 2')
            t.equal(actualSpanEvent.depth, 2, 'depth is 3')
            t.equal(actualSpanEvent.serviceType, mysqlServiceType.getCode(), 'serviceType is mysql')
            let actualNextAsyncId = actualSpanEvent.nextAsyncId

            let actualSpanChunk = trace.storage.dataSender.findSpanChunk(actualNextAsyncId)
            t.equal(actualSpanChunk.spanId, actualSpanEvent.spanId, 'spanId is equal')
            t.equal(actualSpanChunk.transactionIdObject, trace.traceId.transactionId, 'transactionIdObject is equal')
            t.equal(actualSpanChunk.localAsyncId.asyncId, actualSpanEvent.nextAsyncId, 'localAsyncId is equal')
            t.equal(actualSpanChunk.localAsyncId.sequence, 1, 'localAsyncId.sequence is equal')
            t.equal(actualSpanChunk.spanEventList[0].apiId, defaultPredefinedMethodDescriptorRegistry.asyncInvocationDescriptor.apiId, 'apiId is equal')
            t.equal(actualSpanChunk.spanEventList[0].depth, 1, 'depth is equal')
            t.equal(actualSpanChunk.spanEventList[0].sequence, 0, 'sequence is equal')
            t.equal(actualSpanChunk.spanEventList[0].serviceType, ServiceType.async.getCode(), 'serviceType is mysql')

            const actualSpanChunkGrpc = agent.dataSender.dataSender.actualSpans[0].getSpanchunk()
            t.equal(actualSpanChunkGrpc.getVersion(), 1, 'PSpanChunk.version is 1')
            
            const actualTractionId = actualSpanChunkGrpc.getTransactionid()
            t.equal(actualTractionId.getAgentid(), trace.traceId.transactionId.agentId, `PSpanChunk.PTransactionId.agentId is ${trace.traceId.transactionId.agentId}`)
            t.equal(typeof actualTractionId.getAgentid(), 'string', 'PSpanChunk.PTransactionId.agentId type is string')
            t.equal(actualTractionId.getAgentstarttime(), trace.traceId.transactionId.agentStartTime, `PSpanChunk.PTransactionId.agentStartTime is ${trace.traceId.transactionId.agentStartTime}`)
            t.equal(typeof actualTractionId.getAgentstarttime(), 'string', 'PSpanChunk.PTransactionId.agentStartTime type is string')
            t.equal(actualTractionId.getSequence(), trace.traceId.transactionId.sequence, `PSpanChunk.PTransactionId.sequence is ${trace.traceId.transactionId.sequence}`)
            t.equal(typeof actualTractionId.getSequence(), 'string', 'PSpanChunk.PTransactionId.sequence type is string')

            t.equal(actualSpanChunkGrpc.getSpanid(), actualSpanChunk.spanId, `PSpanChunk.spanId is ${actualSpanEvent.spanId}`)
            t.equal(typeof actualSpanChunkGrpc.getSpanid(), 'string', 'PSpanChunk.spanId type is string')
            t.equal(actualSpanChunkGrpc.getEndpoint(), '', `PSpanChunk.endPoint is ${actualSpanChunk.endPoint}`)
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

            actualBuilder = new MethodDescriptorBuilder('query')
                                    .setClassName('Connection')
                                    .setLineNumber(56)
                                    .setFileName('nested-async-trace.test.js')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            actualSpanEvent = trace.span.spanEventList.find( spanEvent => spanEvent.sequence === 3)
            t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'apiId is equal')
            t.equal(actualSpanEvent.sequence, 3, 'sequence is 3')
            t.equal(actualSpanEvent.depth, 2, 'depth is 2')
            t.equal(actualSpanEvent.serviceType, mysqlExecuteQueryServiceType.getCode(), 'serviceType is mysql')
            actualNextAsyncId = actualSpanEvent.nextAsyncId

            actualSpanChunk = trace.storage.dataSender.findSpanChunk(actualNextAsyncId)
            t.equal(actualSpanChunk.spanId, actualSpanEvent.spanId, 'spanId is equal')
            t.equal(actualSpanChunk.transactionIdObject, trace.traceId.transactionId, 'transactionIdObject is equal')
            t.equal(actualSpanChunk.localAsyncId.asyncId, actualSpanEvent.nextAsyncId, 'localAsyncId is equal')
            t.equal(actualSpanChunk.localAsyncId.sequence, 1, 'localAsyncId.sequence is equal')
            t.equal(actualSpanChunk.spanEventList[1].apiId, defaultPredefinedMethodDescriptorRegistry.asyncInvocationDescriptor.apiId, 'apiId is equal')
            t.equal(actualSpanChunk.spanEventList[1].depth, 1, 'depth is equal')
            t.equal(actualSpanChunk.spanEventList[1].sequence, 0, 'sequence is equal')
            t.equal(actualSpanChunk.spanEventList[1].serviceType, ServiceType.async.getCode(), 'serviceType is mysql')

            actualBuilder = new MethodDescriptorBuilder('query')
                                    .setClassName('Connection')
                                    .setLineNumber(62)
                                    .setFileName('nested-async-trace.test.js')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            actualSpanEvent = actualSpanChunk.spanEventList[0]
            t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'apiId is equal')
            t.equal(actualSpanEvent.depth, 2, 'depth is 3')
            t.equal(actualSpanEvent.sequence, 1, 'sequence is 2')
            t.equal(actualSpanEvent.serviceType, mysqlExecuteQueryServiceType.getCode(), 'serviceType is mysql')
            actualNextAsyncId = actualSpanEvent.nextAsyncId

            actualSpanChunk = trace.storage.dataSender.findSpanChunk(actualNextAsyncId)
            t.equal(actualSpanChunk.spanId, actualSpanEvent.spanId, 'spanId is equal')
            t.equal(actualSpanChunk.transactionIdObject, trace.traceId.transactionId, 'transactionIdObject is equal')
            t.equal(actualSpanChunk.localAsyncId.asyncId, actualNextAsyncId, 'localAsyncId is equal')
            t.equal(actualSpanChunk.localAsyncId.sequence, 1, 'localAsyncId.sequence is equal')
            t.equal(actualSpanChunk.spanEventList[0].apiId, defaultPredefinedMethodDescriptorRegistry.asyncInvocationDescriptor.apiId, 'apiId is equal')
            t.equal(actualSpanChunk.spanEventList[0].depth, 1, 'depth is equal')
            t.equal(actualSpanChunk.spanEventList[0].sequence, 0, 'sequence is equal')
            t.equal(actualSpanChunk.spanEventList[0].serviceType, ServiceType.async.getCode(), 'serviceType is mysql')

            connection.end()
            await container.stop()
        })
    })

    const server = app.listen(5006, async () => {
        const result = await axios.get('http://localhost:5006/test1')
        t.equal(result.status, 200, 'status is 200')

        t.end()
        server.close()
    })
})