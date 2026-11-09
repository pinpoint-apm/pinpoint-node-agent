/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const { ProcessAgentBuilder, startAgent, nullDataSenderAgent } = require('../../support/process-agent-builder')
startAgent()
const { finished } = require('node:stream')
const { startPostgreSql } = require('../../support/shared-containers')
const { Client, Pool } = require('pg')
const apiMetaService = require('../../../lib/context/api-meta-service')
const annotationKey = require('../../../lib/constant/annotation-key')
const defaultPredefinedMethodDescriptorRegistry = require('../../../lib/constant/default-predefined-method-descriptor-registry')
const pgExecuteQueryServiceType = require('../../../lib/instrumentation/module/pg/pg-execute-query-service-type')
const ServiceType = require('../../../lib/context/service-type')
const localStorage = require('../../../lib/instrumentation/context/local-storage')
const MethodDescriptorBuilder = require('../../../lib/context/method-descriptor-builder')
const RecordingDataSender = require('../../support/recording-data-sender')

test(`Client create and query hooking`, async (t) => {
    const dataSender = new RecordingDataSender()
    const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()
    const container = await startPostgreSql()

    const trace = agent.createTraceObject()
    localStorage.run(trace, () => {
        const client = new Client({
            host: container.getHost(),
            port: container.getPort(),
            database: 'test',
            user: 'testuser',
            password: 'testpass'
        })

        client.connect(function (err) {
            if (err) {
                console.error('error connecting: ' + err.stack)
                return
            }
        })

        client.query('SELECT * FROM member WHERE id = $1', ['a'], async function (error, results) {
            if (error) throw error
            t.equal(results.rows[0].id, 'a', 'SELECT member id')
            t.equal(results.rows[0].name, 'name1', 'SELECT member name')

            agent.completeTraceObject(trace)
            client.end()

            const querySpanEvent = dataSender.findSpan(trace.getTraceRoot()).spanEventList[0]
            let expectedBuilder = new MethodDescriptorBuilder('query')
                                    .setClassName('Client')
            let actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(expectedBuilder)
            t.equal(querySpanEvent.apiId, actualMethodDescriptor.apiId, `Client query apiId ${actualMethodDescriptor.apiId}`)
            t.equal(querySpanEvent.endPoint, `${container.getHost()}:${container.getPort()}`, 'createClient endPoint')
            t.equal(querySpanEvent.destinationId, 'test', 'createClient destinationId')
            t.equal(querySpanEvent.serviceType, pgExecuteQueryServiceType.getCode(), 'createClient serviceType')

            let actualParsingResult = agent.getTraceContext().spanEventRecorderFactory.sqlMetadataService.cacheSql('SELECT * FROM member WHERE id = $1')
            let actualQueryAnnotation = querySpanEvent.annotations[0]
            t.equal(actualQueryAnnotation.key, annotationKey.SQL_ID.getCode(), 'query annotation key')
            t.equal(actualQueryAnnotation.value.intValue, actualParsingResult.sqlId, 'query annotation value')
            t.equal(actualQueryAnnotation.value.stringValue2, 'a', 'query annotation bind value')
            t.equal(actualParsingResult.sql.normalizedSql, 'SELECT * FROM member WHERE id = $1', 'query normalizedSql')

            t.end()
        })
    })
})

test(`Client multiple queries with parameters`, async (t) => {
    const dataSender = new RecordingDataSender()
    const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()
    const container = await startPostgreSql()

    const trace = agent.createTraceObject()
    localStorage.run(trace, async () => {
        const client = new Client({
            host: container.getHost(),
            port: container.getPort(),
            database: 'test',
            user: 'testuser',
            password: 'testpass'
        })

        client.connect()

        client.query('SELECT * FROM member WHERE id = $1', ['a'], function (error, results) {
            if (error) throw error
            t.equal(results.rows[0].id, 'a', 'first query result')
        })

        client.query('INSERT INTO member (id, name, email) VALUES ($1, $2, $3)', ['c', 'name3', 'test3@example.com'], function (error) {
            if (error) throw error
        })

        client.query('UPDATE member SET name = $1 WHERE id = $2', ['updated_name', 'c'], function (error) {
            if (error) throw error
        })

        client.query('DELETE FROM member WHERE id = $1', ['c'], function (error) {
            if (error) throw error

            setImmediate(() => {
                agent.completeTraceObject(trace)
            })
        })

        const span = await dataSender.waitForSpan(trace.getTraceRoot())
        // Verify all queries were instrumented
        const querySpanEvents = span.spanEventList.filter(event =>
            event.serviceType === pgExecuteQueryServiceType.getCode()
        )

        t.equal(querySpanEvents.length, 4, 'Should have 4 query span events')

        // Verify INSERT query with parameters
        let insertQuerySpanEvent = querySpanEvents[1]
        t.ok(insertQuerySpanEvent.apiId > 0, 'INSERT query apiId should be positive')

        let actualParsingResult = agent.getTraceContext().spanEventRecorderFactory.sqlMetadataService.cacheSql('INSERT INTO member (id, name, email) VALUES ($1, $2, $3)')
        let actualQueryAnnotation = insertQuerySpanEvent.annotations[0]
        t.equal(actualQueryAnnotation.key, annotationKey.SQL_ID.getCode(), 'INSERT annotation key')
        t.equal(actualQueryAnnotation.value.intValue, actualParsingResult.sqlId, 'INSERT annotation sqlId')
        t.equal(actualQueryAnnotation.value.stringValue2, 'c,name3,test3@example.com', 'INSERT annotation bind values')

        // Verify UPDATE query
        let updateQuerySpanEvent = querySpanEvents[2]
        t.ok(updateQuerySpanEvent.apiId > 0, 'UPDATE query apiId should be positive')

        actualQueryAnnotation = updateQuerySpanEvent.annotations[0]
        t.equal(actualQueryAnnotation.value.stringValue2, 'updated_name,c', 'UPDATE annotation bind values')

        client.end()
        t.end()
    })
})

test(`Pool create and query hooking`, async (t) => {
    const dataSender = new RecordingDataSender()
    const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()
    const container = await startPostgreSql()

    const trace = agent.createTraceObject()
    localStorage.run(trace, () => {
        const pool = new Pool({
            host: container.getHost(),
            port: container.getPort(),
            database: 'test',
            user: 'testuser',
            password: 'testpass',
            max: 10
        })

        pool.query('SELECT * FROM member WHERE id = $1', ['b'], async function (error, results) {
            if (error) throw error
            t.equal(results.rows[0].id, 'b', 'Pool query result')
            t.equal(results.rows[0].name, 'name2', 'Pool query name')

            agent.completeTraceObject(trace)
            pool.end()

            const querySpanEvent = dataSender.findSpan(trace.getTraceRoot()).spanEventList[0]
            let expectedBuilder = new MethodDescriptorBuilder('query')
                                    .setClassName('Client')
            let actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(expectedBuilder)
            t.equal(querySpanEvent.apiId, actualMethodDescriptor.apiId, `Client query apiId ${actualMethodDescriptor.apiId}`)
            t.equal(querySpanEvent.depth, 1, 'Pool query depth')
            t.equal(querySpanEvent.sequence, 0, 'Pool query sequence')
            t.equal(querySpanEvent.serviceType, pgExecuteQueryServiceType.getCode(), 'Pool query serviceType')
            t.equal(querySpanEvent.endPoint, `${container.getHost()}:${container.getPort()}`, 'createPool endPoint')
            t.equal(querySpanEvent.destinationId, 'test', 'createPool destinationId')

            t.end()
        })
    })
})

test(`Pool connect and query hooking`, async (t) => {
    const dataSender = new RecordingDataSender()
    const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()
    const container = await startPostgreSql()

    const trace = agent.createTraceObject()
    localStorage.run(trace, async () => {
        const pool = new Pool({
            host: container.getHost(),
            port: container.getPort(),
            database: 'test',
            user: 'testuser',
            password: 'testpass'
        })

        pool.connect(function (err, client, release) {
            if (err) throw err

            client.query('SELECT * FROM member WHERE id = $1', ['a'], async function (error, results) {
                release()
                if (error) throw error

                t.equal(results.rows[0].id, 'a', 'Pool connect query result')

                setImmediate(async () => {
                    agent.completeTraceObject(trace)
                    pool.end()
                })
            })
        })

        const span = await dataSender.waitForSpan(trace.getTraceRoot())
        let querySpanEvent = span.spanEventList[0]
        t.ok(querySpanEvent.apiId > 0, `Client query apiId ${querySpanEvent.apiId}`)
        t.equal(querySpanEvent.endPoint, `${container.getHost()}:${container.getPort()}`, 'query endPoint')
        t.equal(querySpanEvent.destinationId, 'test', 'query destinationId')
        t.equal(querySpanEvent.sequence, 0, 'query sequence')
        t.equal(querySpanEvent.depth, 1, 'query depth')
        t.equal(querySpanEvent.serviceType, pgExecuteQueryServiceType.getCode(), 'query serviceType')

        let actualSpanChunk = dataSender.findSpanChunk(querySpanEvent.asyncId)
        t.equal(actualSpanChunk.traceRoot, span.traceRoot, 'spanChunk traceRoot')
        t.equal(actualSpanChunk.localAsyncId.getAsyncId(), querySpanEvent.asyncId.getAsyncId(), 'spanChunk localAsyncId')
        t.equal(actualSpanChunk.localAsyncId.sequence, 1, 'spanChunk localAsyncId sequence')
        t.equal(actualSpanChunk.spanEventList[0].apiId, defaultPredefinedMethodDescriptorRegistry.asyncInvocationDescriptor.apiId, 'spanChunk async invocation apiId')
        t.equal(actualSpanChunk.spanEventList[0].depth, 1, 'spanChunk async invocation depth')
        t.equal(actualSpanChunk.spanEventList[0].sequence, 0, 'spanChunk async invocation sequence')
        t.equal(actualSpanChunk.spanEventList[0].serviceType, ServiceType.async.getCode(), 'spanChunk async invocation serviceType')
        t.end()
    })
})

test('Disable trace with Express and PostgreSQL', async (t) => {
    const dataSender = new RecordingDataSender()
    const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()
    const express = require('express')
    const ServiceType = require('../../../lib/context/service-type')
    const defaultPredefinedMethodDescriptorRegistry = require('../../../lib/constant/default-predefined-method-descriptor-registry')

    const container = await startPostgreSql()

    const app = express()
    const client = new Client({
        host: container.getHost(),
        port: container.getPort(),
        database: 'test',
        user: 'testuser',
        password: 'testpass'
    })

    client.connect(function (err) {
        if (err) {
            console.error('error connecting: ' + err.stack)
            return
        }
    })

    let callCount = 0
    let traceRoot
    let traceCompleted
    app.get('/test1', (req, res) => {
        client.query(`SELECT * FROM member`, function (error, results) {
            if (error) throw error
            res.send(results.rows)
        })
        callCount++
        const trace = agent.currentTraceObject()
        if (callCount == 1) {
            traceRoot = trace.getTraceRoot()
        } else if (callCount == 2) {
            t.false(trace.spanBuilder, 'trace.span is undefined')
            traceCompleted = new Promise(resolve => finished(res, resolve))
        }
    })

    const server = app.listen(0, () => {
        const port = server.address().port
        const http = require('http')

        // First request - trace should be active
        const req1 = http.request({
            hostname: 'localhost',
            port: port,
            path: '/test1',
            method: 'GET'
        }, (res) => {
            res.on('data', () => {})
            res.on('end', async () => {
                const span = await dataSender.waitForSpan(traceRoot)
                t.equal(span.spanEventList.length, 2, 'spanEventList length is 2')

                let actualSpanEvent = span.spanEventList.find(spanEvent => spanEvent.sequence == 0)
                t.ok(actualSpanEvent.apiId > 0, 'apiId should be positive in sampled Trace of DisableTrace Functional Tests')
                t.equal(actualSpanEvent.sequence, 0, 'spanEvent.sequence Router.get in sampled Trace of DisableTrace Functional Tests')
                t.equal(actualSpanEvent.depth, 1, 'spanEvent.depth Router.get in sampled Trace of DisableTrace Functional Tests')
                t.equal(actualSpanEvent.serviceType, ServiceType.express.getCode(), 'spanEvent.serviceType Router.get in sampled Trace of DisableTrace Functional Tests')
                t.equal(actualSpanEvent.nextSpanId, '-1', 'spanEvent.nextSpanId Router.get in sampled Trace of DisableTrace Functional Tests')

                actualSpanEvent = span.spanEventList.find(spanEvent => spanEvent.sequence == 1)
                t.ok(actualSpanEvent.apiId > 0, 'apiId should be positive Client.query in sampled Trace of DisableTrace Functional Tests')
                t.equal(actualSpanEvent.sequence, 1, 'spanEvent.sequence Client.query in sampled Trace of DisableTrace Functional Tests')
                t.equal(actualSpanEvent.depth, 2, 'spanEvent.depth Client.query in sampled Trace of DisableTrace Functional Tests')
                t.equal(actualSpanEvent.serviceType, pgExecuteQueryServiceType.getCode(), 'spanEvent.serviceType Client.query in sampled Trace of DisableTrace Functional Tests')
                t.equal(actualSpanEvent.destinationId, 'test', 'spanEvent.destinationId Client.query in sampled Trace of DisableTrace Functional Tests')
                t.equal(actualSpanEvent.endPoint, `${container.getHost()}:${container.getPort()}`, 'spanEvent.endPoint Client.query in sampled Trace of DisableTrace Functional Tests')
                t.equal(actualSpanEvent.nextSpanId, '-1', 'spanEvent.nextSpanId Client.query in sampled Trace of DisableTrace Functional Tests')

                let actualNextAsyncId = actualSpanEvent.asyncId
                let actualSpanChunk = dataSender.findSpanChunk(actualNextAsyncId)
                t.equal(actualSpanChunk.traceRoot, span.traceRoot, 'spanChunk.transactionIdObject Client.query in sampled Trace of DisableTrace Functional Tests')
                t.equal(actualSpanChunk.localAsyncId.asyncId, actualSpanEvent.asyncId.getAsyncId(), 'spanChunk.localAsyncId.asyncId Client.query in sampled Trace of DisableTrace Functional Tests')
                t.equal(actualSpanChunk.localAsyncId.sequence, 1, 'spanChunk.localAsyncId.sequence Client.query in sampled Trace of DisableTrace Functional Tests')
                t.equal(actualSpanChunk.spanEventList[0].apiId, defaultPredefinedMethodDescriptorRegistry.asyncInvocationDescriptor.apiId, 'spanChunk.spanEventList[0].apiId is asyncInvocationDescriptor.apiId Client.query in sampled Trace of DisableTrace Functional Tests')
                t.equal(actualSpanChunk.spanEventList[0].depth, 1, 'spanChunk.spanEventList[0].depth is 1 Client.query in sampled Trace of DisableTrace Functional Tests')
                t.equal(actualSpanChunk.spanEventList[0].sequence, 0, 'spanChunk.spanEventList[0].sequence is 0 Client.query in sampled Trace of DisableTrace Functional Tests')
                t.equal(actualSpanChunk.spanEventList[0].serviceType, ServiceType.async.getCode(), 'spanChunk.spanEventList[0].serviceType is async Client.query in sampled Trace of DisableTrace Functional Tests')

                // Second request - trace should be disabled
                setTimeout(() => {
                    nullDataSenderAgent({ 'sampling': { 'enable': false } })
                    const req2 = http.request({
                        hostname: 'localhost',
                        port: port,
                        path: '/test1',
                        method: 'GET'
                    }, (res) => {
                        res.on('data', () => {})
                        res.on('end', async () => {
                            server.close()
                            await traceCompleted
                            client.end()
                            t.end()
                        })
                    })
                    req2.end()
                }, 100)
            })
        })
        req1.end()
    })
})