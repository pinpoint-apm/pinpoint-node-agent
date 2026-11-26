/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const { ProcessAgentBuilder, startAgent, nullDataSenderAgent } = require('../../support/process-agent-builder')
startAgent()
const { finished } = require('node:stream')
const { startMySql } = require('../../support/shared-containers')
const mysql = require('mysql')
const apiMetaService = require('../../../lib/context/api-meta-service')
const MethodDescriptorBuilder = require('../../../lib/context/method-descriptor-builder')
const annotationKey = require('../../../lib/constant/annotation-key')
const defaultPredefinedMethodDescriptorRegistry = require('../../../lib/constant/default-predefined-method-descriptor-registry')
const mysqlExecuteQueryServiceType = require('../../../lib/instrumentation/module/mysql/mysql-execute-query-service-type')
const mysqlServiceType = require('../../../lib/instrumentation/module/mysql/mysql-service-type')
const ServiceType = require('../../../lib/context/service-type')
const localStorage = require('../../../lib/instrumentation/context/local-storage')
const express = require('express')
const axios = require('axios')
const http = require('http')
const DisableTrace = require('../../../lib/context/disable-trace')
const RecordingDataSender = require('../../support/recording-data-sender')
const { once } = require('node:events')

test(`connection with query`, async (t) => {
    const dataSender = new RecordingDataSender()
    const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()
    const container = await startMySql()

    const trace = agent.createTraceObject()
    localStorage.run(trace, () => {
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

        connection.query('SELECT DATABASE() as res', async function (error, results) {
            if (error) throw error
            t.equal(results[0].res, 'test', 'SELECT DATABASE() as res')
        })
        connection.query(`SHOW TABLES`, async function (error, results) {
            if (error) throw error
            t.equal(results[0].Tables_in_test, 'member', 'SHOW TABLES')
        })
        connection.query('SELECT * FROM `member` WHERE id = ?', 'a', async function (error, results) {
            if (error) throw error
            t.equal(results[0].id, 'a', 'SELECT member id')
            t.equal(results[0].name, 'name1', 'SELECT member name')
            t.equal(results[0].joined.getDate(), new Date('2023-01-18T00:00:00+09:00').getDate(), 'SELECT member joined')
        })
        connection.query('INSERT INTO `member` (id, name, joined) VALUES (?, ?, ?)', ['c', 'cname', '2023-08-18'], async function (error, results) {
            if (error) throw error
            t.equal(results.affectedRows, 1, 'INSERT INTO `member` (id, name) VALUES (?, ?)')
        })
        connection.query('SELECT * FROM `member` WHERE id = ?', 'c', async function (error, results) {
            if (error) throw error

            setImmediate(() => {
                agent.completeTraceObject(trace)
                connection.end()
            })

            t.equal(results[0].id, 'c', 'SELECT member id')
            t.equal(results[0].name, 'cname', 'SELECT member name')
            t.equal(results[0].joined.getDate(), new Date('2023-01-18T00:00:00+09:00').getDate(), 'SELECT member joined')
        })

        dataSender.waitForSpan(trace.getTraceRoot()).then((span) => {
            let actualBuilder = new MethodDescriptorBuilder('createConnection')
            let actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            const createConnectionSpanEvent = span.spanEventList[0]
            t.equal(createConnectionSpanEvent.endPoint, container.getHost(), 'the createConnection SpanEvent endPoint')
            t.equal(createConnectionSpanEvent.destinationId, 'test', 'the createConnection SpanEvent destinationId')
            t.equal(actualMethodDescriptor.apiId, createConnectionSpanEvent.apiId, 'apiId')

            actualBuilder = new MethodDescriptorBuilder('connect')
                .setClassName('Connection')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            const connectionSpanEvent = span.spanEventList[1]
            t.equal(connectionSpanEvent.depth, 1, 'connection spanEvent depth')
            t.equal(connectionSpanEvent.sequence, 1, 'connection spanEvent sequence')
            t.equal(actualMethodDescriptor.apiId, connectionSpanEvent.apiId, 'apiId')

            actualBuilder = new MethodDescriptorBuilder('query')
                .setClassName('Connection')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            let querySpanEvent = span.spanEventList[2]
            t.equal(querySpanEvent.depth, 1, 'query spanEvent depth')
            t.equal(querySpanEvent.sequence, 2, 'query spanEvent sequence')
            t.equal(querySpanEvent.endPoint, container.getHost(), 'the createConnection SpanEvent endPoint')
            t.equal(querySpanEvent.destinationId, 'test', 'the createConnection SpanEvent destinationId')
            t.equal(actualMethodDescriptor.apiId, querySpanEvent.apiId, 'apiId')

            let actualParsingResult = agent.getTraceContext().spanEventRecorderFactory.sqlMetadataService.cacheSql('SELECT DATABASE() as res')
            let actualQueryAnnotation = querySpanEvent.annotations[0]
            t.equal(actualQueryAnnotation.key, annotationKey.SQL_ID.getCode(), 'the query annotation key')
            t.equal(actualQueryAnnotation.value.intValue, actualParsingResult.sqlId, 'the query annotation value')
            t.equal(actualParsingResult.sql.normalizedSql, 'SELECT DATABASE() as res', 'the query annotation squl normalizedSql')

            actualBuilder = new MethodDescriptorBuilder('query')
                .setClassName('Connection')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            querySpanEvent = span.spanEventList[3]
            t.equal(querySpanEvent.endPoint, container.getHost(), 'the createConnection SpanEvent endPoint')
            t.equal(querySpanEvent.destinationId, 'test', 'the createConnection SpanEvent destinationId')
            t.equal(actualMethodDescriptor.apiId, querySpanEvent.apiId, 'apiId')

            actualParsingResult = agent.getTraceContext().spanEventRecorderFactory.sqlMetadataService.cacheSql('SHOW TABLES')
            actualQueryAnnotation = querySpanEvent.annotations[0]
            t.equal(actualQueryAnnotation.key, annotationKey.SQL_ID.getCode(), 'the query annotation key')
            t.equal(actualQueryAnnotation.value.intValue, actualParsingResult.sqlId, 'the query annotation value')
            t.equal(actualParsingResult.sql.normalizedSql, 'SHOW TABLES', 'the query annotation squl normalizedSql')

            actualBuilder = new MethodDescriptorBuilder('query')
                .setClassName('Connection')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            querySpanEvent = span.spanEventList[4]
            t.equal(querySpanEvent.endPoint, container.getHost(), 'the createConnection SpanEvent endPoint')
            t.equal(querySpanEvent.destinationId, 'test', 'the createConnection SpanEvent destinationId')
            t.equal(actualMethodDescriptor.apiId, querySpanEvent.apiId, 'apiId')

            actualParsingResult = agent.getTraceContext().spanEventRecorderFactory.sqlMetadataService.cacheSql('SELECT * FROM `member` WHERE id = ?')
            actualQueryAnnotation = querySpanEvent.annotations[0]
            t.equal(actualQueryAnnotation.key, annotationKey.SQL_ID.getCode(), 'the query annotation key')
            t.equal(actualQueryAnnotation.value.intValue, actualParsingResult.sqlId, 'the query annotation value')
            t.equal(actualQueryAnnotation.value.stringValue1, '', 'the query annotation value stringValue1 is sql normalizedSql parsedParameters')
            t.equal(actualQueryAnnotation.value.stringValue2, 'a', 'the query annotation value stringValue2 is bind value')
            t.equal(actualParsingResult.sql.normalizedSql, 'SELECT * FROM `member` WHERE id = ?', 'the query annotation sql normalizedSql')

            actualBuilder = new MethodDescriptorBuilder('query')
                .setClassName('Connection')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            querySpanEvent = span.spanEventList[5]
            t.equal(querySpanEvent.endPoint, container.getHost(), 'the createConnection SpanEvent endPoint')
            t.equal(querySpanEvent.destinationId, 'test', 'the createConnection SpanEvent destinationId')
            t.equal(actualMethodDescriptor.apiId, querySpanEvent.apiId, 'apiId')

            actualParsingResult = agent.getTraceContext().spanEventRecorderFactory.sqlMetadataService.cacheSql('INSERT INTO `member` (id, name, joined) VALUES (?, ?, ?)')
            actualQueryAnnotation = querySpanEvent.annotations[0]
            t.equal(actualQueryAnnotation.key, annotationKey.SQL_ID.getCode(), 'the query annotation key')
            t.equal(actualQueryAnnotation.value.intValue, actualParsingResult.sqlId, 'the query annotation value')
            t.equal(actualQueryAnnotation.value.stringValue1, '', 'the query annotation value stringValue1 is sql normalizedSql parsedParameters')
            t.equal(actualQueryAnnotation.value.stringValue2, 'c,cname,2023-08-18', 'the query annotation value stringValue2 is bind value')
            t.equal(actualParsingResult.sql.normalizedSql, 'INSERT INTO `member` (id, name, joined) VALUES (?, ?, ?)', 'the query annotation sql normalizedSql')

            t.end()
        })
    })
})

test('mysql uid query', async (t) => {
    const dataSender = new RecordingDataSender()
    const agent = new ProcessAgentBuilder({
        "features": {
            "sqlStats": true
        }
    }).setDataSender(dataSender).build()
    const container = await startMySql()

    const trace = agent.createTraceObject()
    localStorage.run(trace, () => {
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
                console.error('error connecting: ' + err)
                return
            }
        })
        connection.query(`SELECT * FROM member`, async function (error) {
            if (error) throw error

            agent.completeTraceObject(trace)
            connection.end()
            const span = dataSender.findSpan(trace.getTraceRoot())
            const querySpanEvent = span.spanEventList.find(spanEvent => spanEvent.serviceType === mysqlExecuteQueryServiceType.getCode())
            const actualParsingResult = agent.getTraceContext().spanEventRecorderFactory.sqlMetadataService.cacheSql('SELECT * FROM member')
            const actualQueryAnnotation = querySpanEvent.annotations[0]
            t.equal(actualQueryAnnotation.key, annotationKey.SQL_UID.getCode(), 'the query annotation is SQL_UID when sqlStats is on')
            t.deepEqual(actualQueryAnnotation.value.getBytesValue(), actualParsingResult.getId(), 'the SQL_UID annotation has the uid of the query')

            t.end()
        })
    })
})

test(`Connection Pool with query`, async (t) => {
    const dataSender = new RecordingDataSender()
    const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()
    const container = await startMySql()

    const trace = agent.createTraceObject()
    localStorage.run(trace, () => {
        const pool = mysql.createPool({
            host: container.getHost(),
            port: container.getPort(),
            database: 'test',
            user: container.getUsername(),
            password: container.getUserPassword(),
            acquireTimeout: 10000000,
            timezone: '+09:00'
        })

        let queryIndex = 0
        pool.getConnection(function (err, connection) {
            if (err) throw err
            connection.query('SELECT * FROM `member` where id = ?', 'a', async function (error) {
                connection.release()
                if (error) throw error
            })
            queryIndex++
            if (queryIndex == 2) {
                setTimeout(async () => {
                    agent.completeTraceObject(trace)
                    pool.end()
                }, 1000)
            }
        })

        pool.query('SELECT * FROM `member` where id = ?', 'b', async function (error, results) {
            if (error) throw error
            t.equal(results[0].id, 'b', 'SELECT member id')
            t.equal(results[0].name, 'name2', 'SELECT member name')
            t.equal(results[0].joined.getDate(), new Date('2022-07-27T00:00:00+09:00').getDate(), 'SELECT member joined')
            queryIndex++
            if (queryIndex == 2) {
                setTimeout(async () => {
                    agent.completeTraceObject(trace)
                    pool.end()
                }, 1000)
            }
        })

        dataSender.waitForSpan(trace.getTraceRoot()).then((span) => {
            let actualBuilder = new MethodDescriptorBuilder('createPool')
            let actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            let actualSpanEvent = span.spanEventList[0]
            t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'apiId')
            t.equal(actualSpanEvent.endPoint, container.getHost(), 'createPool SpanEvent endPoint')
            t.equal(actualSpanEvent.destinationId, 'test', 'createPool SpanEvent destinationId')
            t.equal(actualSpanEvent.sequence, 0, 'createPool spanEvent sequence')
            t.equal(actualSpanEvent.depth, 1, 'createPool spanEvent depth')
            t.equal(actualSpanEvent.serviceType, mysqlServiceType.getCode(), 'createPool spanEvent serviceType')

            actualBuilder = new MethodDescriptorBuilder('getConnection')
                .setClassName('Pool')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            actualSpanEvent = span.spanEventList[1]
            t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'Pool.getConnection spanEvent apiId')
            t.equal(actualSpanEvent.depth, 1, 'Pool.getConnection spanEvent depth')
            t.equal(actualSpanEvent.sequence, 1, 'Pool.getConnection spanEvent sequence')
            t.equal(actualSpanEvent.serviceType, mysqlServiceType.getCode(), 'Pool.getConnection spanEvent serviceType')
            t.equal(actualSpanEvent.destinationId, 'test', 'Pool.getConnection spanEvent destinationId')

            let actualSpanChunk = dataSender.findSpanChunk(actualSpanEvent.asyncId)
            t.equal(actualSpanChunk.traceRoot, span.traceRoot, 'spanChunk traceRoot')
            t.equal(actualSpanChunk.localAsyncId.getAsyncId(), actualSpanEvent.asyncId.getAsyncId(), 'spanChunk localAsyncId.asyncId is spanEvent nextAsyncId')
            t.equal(actualSpanChunk.localAsyncId.sequence, 1, 'spanChunk localAsyncId.sequence is spanEvent 0')
            t.equal(actualSpanChunk.spanEventList[0].apiId, defaultPredefinedMethodDescriptorRegistry.asyncInvocationDescriptor.apiId, 'spanChunk spanEventList[0].apiId must be asyncInvocationDescriptor.apiId')
            t.equal(actualSpanChunk.spanEventList[0].depth, 1, 'spanChunk spanEventList[0].depth is 1')
            t.equal(actualSpanChunk.spanEventList[0].sequence, 0, 'spanChunk spanEventList[0].sequence is 0')
            t.equal(actualSpanChunk.spanEventList[0].serviceType, ServiceType.async.getCode(), 'spanChunk spanEventList[0].serviceType is ServiceTypeCode.async')

            actualBuilder = new MethodDescriptorBuilder('query')
                .setClassName('PoolConnection')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            actualSpanEvent = actualSpanChunk.spanEventList[1]
            t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'PoolConnection.query spanEvent apiId on pool.query')
            t.equal(actualSpanEvent.depth, 2, 'PoolConnection.query spanEvent depth on pool.query')
            t.equal(actualSpanEvent.sequence, 1, 'PoolConnection.query spanEvent sequence on pool.query')
            t.equal(actualSpanEvent.serviceType, mysqlExecuteQueryServiceType.getCode(), 'PoolConnection.query spanEvent serviceType on pool.query')
            t.equal(actualSpanEvent.destinationId, 'test', 'PoolConnection.query spanEvent destinationId on pool.query via getConnection')

            actualBuilder = new MethodDescriptorBuilder('query')
                .setClassName('PoolConnection')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            actualSpanEvent = span.spanEventList[2]
            t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'Pool.getConnection spanEvent apiId on pool.query')
            t.equal(actualSpanEvent.depth, 1, 'Pool.getConnection spanEvent depth on pool.query')
            t.equal(actualSpanEvent.sequence, 2, 'Pool.getConnection spanEvent sequence on pool.query')
            t.equal(actualSpanEvent.serviceType, mysqlExecuteQueryServiceType.getCode(), 'PoolConnection.query spanEvent serviceType on pool.query')
            t.equal(actualSpanEvent.destinationId, 'test', 'PoolConnection.query spanEvent destinationId on pool.query direct')

            actualSpanChunk = dataSender.findSpanChunk(actualSpanEvent.asyncId)
            t.equal(actualSpanChunk.traceRoot, span.traceRoot, 'spanChunk transactionIdObject on pool.query')
            t.equal(actualSpanChunk.localAsyncId.getAsyncId(), actualSpanEvent.asyncId.getAsyncId(), 'spanChunk localAsyncId.asyncId is spanEvent nextAsyncId on pool.query')
            t.equal(actualSpanChunk.localAsyncId.sequence, 1, 'spanChunk localAsyncId.sequence is spanEvent 0 on pool.query')
            t.equal(actualSpanChunk.spanEventList[0].apiId, defaultPredefinedMethodDescriptorRegistry.asyncInvocationDescriptor.apiId, 'spanChunk spanEventList[0].apiId must be asyncInvocationDescriptor.apiId on pool.query')
            t.equal(actualSpanChunk.spanEventList[0].depth, 1, 'spanChunk spanEventList[0].depth is 1 on pool.query')
            t.equal(actualSpanChunk.spanEventList[0].sequence, 0, 'spanChunk spanEventList[0].sequence is 0 on pool.query')
            t.equal(actualSpanChunk.spanEventList[0].serviceType, ServiceType.async.getCode(), 'spanChunk spanEventList[0].serviceType is ServiceTypeCode.async on pool.query')

            t.end()
        })
    })
})

test(`Cluster with query`, async (t) => {
    const dataSender = new RecordingDataSender()
    const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()
    const container = await startMySql()

    const trace = agent.createTraceObject()
    localStorage.run(trace, () => {
        const poolCluster = mysql.createPoolCluster()
        poolCluster.add('MASTER', {
            host: container.getHost(),
            port: container.getPort(),
            database: 'test',
            user: container.getUsername(),
            password: container.getUserPassword(),
            acquireTimeout: 1000000,
            timezone: '+09:00'
        })
        poolCluster.add('SLAVE1', {
            host: container.getHost(),
            port: container.getPort(),
            database: 'test',
            user: container.getUsername(),
            password: container.getUserPassword(),
            acquireTimeout: 1000000,
            timezone: '+09:00'
        })
        poolCluster.add('SLAVE2', {
            host: container.getHost(),
            port: container.getPort(),
            database: 'test',
            user: container.getUsername(),
            password: container.getUserPassword(),
            acquireTimeout: 1000000,
            timezone: '+09:00'
        })

        poolCluster.getConnection('MASTER', function (err, connection) {
            if (err) throw err
            connection.query('SELECT * FROM `member` where id = ?', 'a', async function (error, results) {
                connection.release()
                if (error) throw error

                t.equal(results[0].id, 'a', 'SELECT member id')
                t.equal(results[0].name, 'name1', 'SELECT member name')
                t.equal(results[0].joined.getDate(), new Date('2023-01-18T00:00:00+09:00').getDate(), 'SELECT member joined')

                setImmediate(async () => {
                    agent.completeTraceObject(trace)
                    poolCluster.end()
                })
            })
        })

        dataSender.waitForSpan(trace.getTraceRoot()).then((span) => {
            let actualBuilder = new MethodDescriptorBuilder('createPoolCluster')
            let actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            let actualSpanEvent = span.spanEventList[0]
            t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'apiId')
            t.equal(actualSpanEvent.sequence, 0, 'createPoolCluster spanEvent sequence')
            t.equal(actualSpanEvent.depth, 1, 'createPoolCluster spanEvent depth')
            t.equal(actualSpanEvent.serviceType, mysqlServiceType.getCode(), 'createPoolCluster spanEvent serviceType')

            actualBuilder = new MethodDescriptorBuilder('of')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            actualSpanEvent = span.spanEventList[1]
            t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'PoolCluster.of spanEvent apiId in poolCluster.getConnection')
            t.equal(actualSpanEvent.depth, 1, 'PoolCluster.of spanEvent depth in poolCluster.getConnection')
            t.equal(actualSpanEvent.sequence, 1, 'PoolCluster.of spanEvent sequence in poolCluster.getConnection')
            t.equal(actualSpanEvent.serviceType, mysqlServiceType.getCode(), 'PoolCluster.of spanEvent serviceType in poolCluster.getConnection')

            actualBuilder = new MethodDescriptorBuilder('getConnection')
                .setClassName('Pool')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            actualSpanEvent = span.spanEventList[2]
            t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'Pool.getConnection spanEvent apiId in poolCluster.getConnection')
            t.equal(actualSpanEvent.depth, 1, 'Pool.getConnection spanEvent depth in poolCluster.getConnection')
            t.equal(actualSpanEvent.sequence, 2, 'Pool.getConnection spanEvent sequence in poolCluster.getConnection')
            t.equal(actualSpanEvent.serviceType, mysqlServiceType.getCode(), 'Pool.getConnection spanEvent serviceType in poolCluster.getConnection')

            let actualSpanChunk = dataSender.findSpanChunk(actualSpanEvent.asyncId)
            t.equal(actualSpanChunk.traceRoot, span.traceRoot, 'spanChunk transactionIdObject in poolCluster.getConnection')
            t.equal(actualSpanChunk.localAsyncId.asyncId, actualSpanEvent.asyncId.getAsyncId(), 'spanChunk localAsyncId.asyncId is spanEvent nextAsyncId in poolCluster.getConnection')
            t.equal(actualSpanChunk.localAsyncId.sequence, 1, 'spanChunk localAsyncId.sequence is spanEvent 0 in poolCluster.getConnection')
            t.equal(actualSpanChunk.spanEventList[0].apiId, defaultPredefinedMethodDescriptorRegistry.asyncInvocationDescriptor.apiId, 'spanChunk spanEventList[0].apiId must be asyncInvocationDescriptor.apiId in poolCluster.getConnection')
            t.equal(actualSpanChunk.spanEventList[0].depth, 1, 'spanChunk spanEventList[0].depth is 1 in poolCluster.getConnection')
            t.equal(actualSpanChunk.spanEventList[0].sequence, 0, 'spanChunk spanEventList[0].sequence is 0 in poolCluster.getConnection')
            t.equal(actualSpanChunk.spanEventList[0].serviceType, ServiceType.async.getCode(), 'spanChunk spanEventList[0].serviceType is ServiceTypeCode.async in poolCluster.getConnection')

            actualBuilder = new MethodDescriptorBuilder('query')
                .setClassName('PoolConnection')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            actualSpanEvent = actualSpanChunk.spanEventList[1]
            t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'PoolConnection.query spanEvent apiId in poolCluster.getConnection')
            t.equal(actualSpanEvent.depth, 2, 'PoolConnection.query spanEvent depth in poolCluster.getConnection')
            t.equal(actualSpanEvent.sequence, 1, 'PoolConnection.query spanEvent sequence in poolCluster.getConnection')
            t.equal(actualSpanEvent.serviceType, mysqlExecuteQueryServiceType.getCode(), 'PoolConnection.query spanEvent serviceType in poolCluster.getConnection')
            t.equal(actualSpanEvent.destinationId, 'test', 'PoolConnection.query spanEvent destinationId in poolCluster.getConnection')

            t.end()
        })
    })
})

let container
test('setup', async (t) => {
    container = await startMySql()
    t.pass('setup complete')
    t.end()
})

test('Disable trace', async (t) => {
    const agent = nullDataSenderAgent({ 'sampling': { 'enable': false } })

    const app = new express()
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

    let traceCompleted
    app.get('/test1', (req, res) => {
        connection.query(`SELECT * FROM member`, function (error, results) {
            if (error) throw error
            res.send(results)
        })
        t.false(agent.currentTraceObject().spanBuilder, 'trace.span is undefined')
        traceCompleted = new Promise(resolve => finished(res, resolve))
    })

    const server = app.listen(5006, async () => {
        const result = await axios.get('http://localhost:5006/test1')
        t.equal(result.status, 200, 'the query in the disabled trace responds 200')

        await traceCompleted
        connection.end()
        t.end()
        server.close()
    })
})

test('Fix wrong transactionId', (t) => {
    const dataSender = new RecordingDataSender()
    const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()

    const pool = mysql.createPool({
        host: container.getHost(),
        port: container.getPort(),
        database: 'test',
        user: container.getUsername(),
        password: container.getUserPassword(),
        acquireTimeout: 10000000,
        timezone: '+09:00'
    })

    const app = new express()
    const actualTraces = []
    app.get('/test1', (req, res) => {
        pool.query('SELECT * FROM `member` where id = ?', 'a', function (error, results, fields) {
            if (error) throw error
        })

        pool.query('SELECT * FROM `member` where id = ?', 'a', async function (error, results, fields) {
            if (error) throw error
            // console.log('The solution is: ', results[0])

            pool.query('SELECT * FROM `member` where id = ?', 'a', function (error, results, fields) {
            })

            await axios.get(`http://localhost:5006/api`, { httpAgent: new http.Agent({ keepAlive: false }) })
        })

        actualTraces.push(agent.currentTraceObject())
        res.send('ok')
    })

    // Each /test1 calls /api after its MySQL queries, so the /api calls can arrive in either order
    const apiTransactionIds = []
    app.get('/api', function (req, res) {
        const trace = agent.currentTraceObject()
        t.true(!(trace instanceof DisableTrace), 'trace is not DisableTrace')
        dataSender.waitForSpan(trace.getTraceRoot()).then((span) => {
            t.equal(req.headers['pinpoint-traceid'].split('^')[2], span.traceRoot.getTraceId().getTransactionId(), `req.headers['pinpoint-traceid'] ${req.headers['pinpoint-traceid'].split('^')[2]}`)

            apiTransactionIds.push(span.traceRoot.getTraceId().getTransactionId())
            if (apiTransactionIds.length == 2) {
                const callerTransactionIds = actualTraces.map(trace => trace.getTraceRoot().getTransactionId())
                t.deepEqual(apiTransactionIds.sort(), callerTransactionIds.sort(), `each /api transactionId is the transactionId of one /test1: ${callerTransactionIds}`)
                t.end()
            }
        })
        res.status(200).json({ 'result': 'ok' })
    })

    const server = app.listen(5006, async () => {
        let result = await axios.get('http://localhost:5006/test1', { httpAgent: new http.Agent({ keepAlive: false }) })
        t.equal(result.status, 200, 'status code is 200')
        result = await axios.get('http://localhost:5006/test1', { httpAgent: new http.Agent({ keepAlive: false }) })
    })

    t.teardown(() => {
        pool.end()
        server.close()
    })
})

test('a mysql query in a getConnection callback records its error on the Asynchronous Invocation of its callback', async (t) => {
    const dataSender = new RecordingDataSender()
    const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()
    const container = await startMySql()
    const pool = mysql.createPool(container.getConnectionUri())

    const trace = agent.createTraceObject()
    await localStorage.run(trace, () => new Promise((resolve) => {
        pool.getConnection((error, connection) => {
            connection.query('SELECT id FROM no_such_table', () => {
                connection.release()
                resolve()
            })
        })
    }))
    agent.completeTraceObject(trace)
    await dataSender.waitForSpan(trace.getTraceRoot())
    pool.end()

    const querySpanEvent = dataSender.findSpanChunks(trace.getTraceRoot()).flatMap(spanChunk => spanChunk.spanEventList).find(spanEvent => spanEvent.serviceType === mysqlExecuteQueryServiceType.getCode())
    t.equal(querySpanEvent.destinationId, 'test', 'the query span event destinationId is the database name in the connection URI')
    const asyncInvocationSpanEvent = dataSender.findSpanChunk(querySpanEvent.asyncId).spanEventList.find(spanEvent => spanEvent.serviceType === ServiceType.async.getCode())
    t.ok(asyncInvocationSpanEvent.exceptionInfo, 'the Asynchronous Invocation span event of the query callback has the error, though the getConnection callback closed its child trace before the result')

    const actualExceptions = dataSender.actualExceptionMetaData().filter(exceptionMetaData => exceptionMetaData.traceRoot === trace.getTraceRoot()).flatMap(exceptionMetaData => exceptionMetaData.valueOfProtocolBuffer().getExceptionsList())
    t.equal(actualExceptions.length, 1, 'ExceptionMetaData has one exception')
    t.equal(actualExceptions[0].getExceptionmessage(), "ER_NO_SUCH_TABLE: Table 'test.no_such_table' doesn't exist", 'ExceptionMetaData exception is the error of the failed query')
    t.equal(actualExceptions[0].getExceptionid(), exceptionChainId(asyncInvocationSpanEvent), 'the Asynchronous Invocation span event points to the exception')
    t.end()
})

test('25 mysql queries that fail at once in one trace record every error', async (t) => {
    const dataSender = new RecordingDataSender()
    const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()
    const container = await startMySql()
    const pool = mysql.createPool({
        host: container.getHost(),
        port: container.getPort(),
        database: 'test',
        user: container.getUsername(),
        password: container.getUserPassword(),
        connectionLimit: 25,
    })

    const trace = agent.createTraceObject()
    await localStorage.run(trace, () => Promise.all(Array.from({ length: 25 }, () => new Promise((resolve) => {
        pool.query('SELECT id FROM no_such_table', resolve)
    }))))
    agent.completeTraceObject(trace)
    await dataSender.waitForSpan(trace.getTraceRoot())
    pool.end()

    const asyncInvocationSpanEventsWithError = dataSender.findSpanChunks(trace.getTraceRoot()).flatMap(spanChunk => spanChunk.spanEventList).filter(spanEvent => spanEvent.serviceType === ServiceType.async.getCode() && spanEvent.exceptionInfo)
    t.equal(asyncInvocationSpanEventsWithError.length, 25, 'the Asynchronous Invocation span event of every query callback has the error, though the span events of the queries overflow the buffer of 20')

    const actualExceptions = dataSender.actualExceptionMetaData().filter(exceptionMetaData => exceptionMetaData.traceRoot === trace.getTraceRoot()).flatMap(exceptionMetaData => exceptionMetaData.valueOfProtocolBuffer().getExceptionsList())
    t.equal(actualExceptions.length, 25, 'ExceptionMetaData has the 25 exceptions')
    t.end()
})

test('Express: a mysql query error that the query callback passes to next(error) is recorded by the query callback trace and by the request trace', async (t) => {
    const dataSender = new RecordingDataSender()
    const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()
    const container = await startMySql()
    const pool = mysql.createPool({
        host: container.getHost(),
        port: container.getPort(),
        database: 'test',
        user: container.getUsername(),
        password: container.getUserPassword(),
    })

    let traceRoot
    const app = new express()
    app.get('/mysql-next-error', (req, res, next) => {
        traceRoot = agent.currentTraceObject().getTraceRoot()
        pool.query('SELECT id FROM no_such_table', (error) => next(error))
    })
    app.use((error, req, res, next) => res.status(500).send(error.code))
    const server = app.listen(0)
    await once(server, 'listening')
    const response = await fetch(`http://localhost:${server.address().port}/mysql-next-error`)
    t.equal(response.status, 500, 'the error handler responds 500 after the query fails')
    const span = await dataSender.waitForSpan(traceRoot)
    server.close()
    pool.end()

    const querySpanEvent = dataSender.findAsyncInvocationSpanEvents(span.spanEventList[0]).find(spanEvent => spanEvent.serviceType === mysqlExecuteQueryServiceType.getCode())
    const asyncInvocationSpanEvent = dataSender.findSpanChunk(querySpanEvent.asyncId).spanEventList.find(spanEvent => spanEvent.serviceType === ServiceType.async.getCode())
    t.ok(asyncInvocationSpanEvent.exceptionInfo, 'the Asynchronous Invocation span event of the query callback has the error')
    const errorHandlerSpanEvent = span.spanEventList.find(spanEvent => spanEvent.serviceType === ServiceType.express.getCode() && spanEvent.exceptionInfo)
    t.equal(errorHandlerSpanEvent.depth, 1, 'the error handler that next(error) calls runs in the request trace, next to Router.get')

    const actualExceptions = dataSender.actualExceptionMetaData().filter(exceptionMetaData => exceptionMetaData.traceRoot === traceRoot).flatMap(exceptionMetaData => exceptionMetaData.valueOfProtocolBuffer().getExceptionsList())
    t.equal(actualExceptions.length, 2, 'ExceptionMetaData has the error twice, because the query callback trace and the request trace each record their own exceptions')
    t.ok(actualExceptions.some(exception => exception.getExceptionid() === exceptionChainId(asyncInvocationSpanEvent)), 'the Asynchronous Invocation span event points to the exception of the query callback trace')
    t.ok(actualExceptions.some(exception => exception.getExceptionid() === exceptionChainId(errorHandlerSpanEvent)), 'the error handler span event points to the exception of the request trace')
    t.end()
})

function exceptionChainId(spanEvent) {
    return spanEvent.annotations.find(annotation => annotation.getKey() === annotationKey.EXCEPTION_CHAIN_ID.getCode()).getValue()
}
