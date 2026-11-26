/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const { ProcessAgentBuilder, startAgent } = require('../../support/process-agent-builder')
startAgent()
const { startMySql } = require('../../support/shared-containers')
const mysql = require('mysql2')
const mysqlp = require('mysql2/promise')
const MethodDescriptorBuilder = require('../../../lib/context/method-descriptor-builder')
const apiMetaService = require('../../../lib/context/api-meta-service')
const annotationKey = require('../../../lib/constant/annotation-key')
const mysqlServiceType = require('../../../lib/instrumentation/module/mysql/mysql-service-type')
const mysqlExecuteQueryServiceType = require('../../../lib/instrumentation/module/mysql/mysql-execute-query-service-type')
const defaultPredefinedMethodDescriptorRegistry = require('../../../lib/constant/default-predefined-method-descriptor-registry')
const ServiceType = require('../../../lib/context/service-type')
const localStorage = require('../../../lib/instrumentation/context/local-storage')
const RecordingDataSender = require('../../support/recording-data-sender')


test(`getConnection query hooking`, async (t) => {
    const dataSender = new RecordingDataSender()
    const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()
    const container = await startMySql()

    const trace = agent.createTraceObject()
    localStorage.run(trace, () => {
        const connection = mysql.createConnection({
            host: container.getHost(),
            port: container.getPort(3306),
            database: 'test',
            user: container.getUsername(),
            password: container.getUserPassword(),
            timezone: '+09:00'
        })

        connection.query(`SELECT * FROM member WHERE id = ?`, 'a', function(err, results) {
            if (err) throw err

            t.equal(results[0].id, 'a', 'id in SELECT query hooking')
            t.equal(results[0].name, 'name1', 'name in SELECT query hooking')
            t.equal(results[0].joined.toISOString().slice(0, 10), '2023-01-17', 'joined in SELECT query hooking')
        })

        connection.query(`INSERT INTO member (id, name, joined) VALUES (?, ?, ?)`, ['c', 'cname', '2023-08-18'], function(err) {
            if (err) throw err
        })

        connection.query(`UPDATE member SET name = ? WHERE id = ?`, ['cname2', 'c'], function(err) {
            if (err) throw err
        })

        connection.query(`DELETE FROM member WHERE id = ?`, 'c', function(err) {
            if (err) throw err

            setImmediate(() => {
                agent.completeTraceObject(trace)
            })
        })

        dataSender.waitForSpan(trace.getTraceRoot()).then((span) => {
            let actualBuilder = new MethodDescriptorBuilder('createConnection')
            let actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            const createConnectionSpanEvent = span.spanEventList[0]
            t.equal(createConnectionSpanEvent.apiId, actualMethodDescriptor.apiId, 'apiId in createConnection spanEvent')
            t.equal(createConnectionSpanEvent.endPoint, container.getHost(), 'endPoint in createConnection spanEvent')
            t.equal(createConnectionSpanEvent.destinationId, 'test', 'destinationId in createConnection spanEvent')

            actualBuilder = new MethodDescriptorBuilder('query')
                .setClassName('Connection')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            let querySpanEvent = span.spanEventList[1]
            t.equal(querySpanEvent.apiId, actualMethodDescriptor.apiId, 'apiId in query spanEvent')
            t.equal(querySpanEvent.endPoint, container.getHost(), 'endPoint in query spanEvent')
            t.equal(querySpanEvent.destinationId, 'test', 'destinationId in query spanEvent')

            let actualParsingResult = agent.getTraceContext().spanEventRecorderFactory.sqlMetadataService.cacheSql('SELECT * FROM member WHERE id = ?')
            let actualQueryAnnotation = querySpanEvent.annotations[0]
            t.equal(actualQueryAnnotation.key, annotationKey.SQL_ID.getCode(), 'key in query annotation')
            t.equal(actualQueryAnnotation.value.intValue, actualParsingResult.sqlId, 'intValue in query annotation')
            t.equal(actualQueryAnnotation.value.stringValue1, '', 'stringValue1 in query annotation')
            t.equal(actualQueryAnnotation.value.stringValue2, 'a', 'stringValue2 in query annotation')
            t.equal(actualParsingResult.sql.normalizedSql, 'SELECT * FROM member WHERE id = ?', 'normalizedSql in query annotation')

            actualBuilder = new MethodDescriptorBuilder('query')
                .setClassName('Connection')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            querySpanEvent = span.spanEventList[2]
            t.equal(querySpanEvent.apiId, actualMethodDescriptor.apiId, 'apiId in query spanEvent')
            t.equal(querySpanEvent.endPoint, container.getHost(), 'endPoint in query spanEvent')
            t.equal(querySpanEvent.destinationId, 'test', 'destinationId in query spanEvent')

            actualParsingResult = agent.getTraceContext().spanEventRecorderFactory.sqlMetadataService.cacheSql('INSERT INTO member (id, name, joined) VALUES (?, ?, ?)')
            actualQueryAnnotation = querySpanEvent.annotations[0]
            t.equal(actualQueryAnnotation.key, annotationKey.SQL_ID.getCode(), 'key in query annotation')
            t.equal(actualQueryAnnotation.value.intValue, actualParsingResult.sqlId, 'intValue in query annotation')
            t.equal(actualQueryAnnotation.value.stringValue1, '', 'stringValue1 in query annotation')
            t.equal(actualQueryAnnotation.value.stringValue2, 'c,cname,2023-08-18', 'stringValue2 in query annotation')
            t.equal(actualParsingResult.sql.normalizedSql, 'INSERT INTO member (id, name, joined) VALUES (?, ?, ?)', 'normalizedSql in query annotation')

            actualBuilder = new MethodDescriptorBuilder('query')
                .setClassName('Connection')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            querySpanEvent = span.spanEventList[3]
            t.equal(querySpanEvent.apiId, actualMethodDescriptor.apiId, 'apiId in query spanEvent')
            t.equal(querySpanEvent.endPoint, container.getHost(), 'endPoint in query spanEvent')
            t.equal(querySpanEvent.destinationId, 'test', 'destinationId in query spanEvent')

            actualParsingResult = agent.getTraceContext().spanEventRecorderFactory.sqlMetadataService.cacheSql('UPDATE member SET name = ? WHERE id = ?')
            actualQueryAnnotation = querySpanEvent.annotations[0]
            t.equal(actualQueryAnnotation.key, annotationKey.SQL_ID.getCode(), 'key in query annotation')
            t.equal(actualQueryAnnotation.value.intValue, actualParsingResult.sqlId, 'intValue in query annotation')
            t.equal(actualQueryAnnotation.value.stringValue1, '', 'stringValue1 in query annotation')
            t.equal(actualQueryAnnotation.value.stringValue2, 'cname2,c', 'stringValue2 in query annotation')
            t.equal(actualParsingResult.sql.normalizedSql, 'UPDATE member SET name = ? WHERE id = ?', 'normalizedSql in query annotation')

            actualBuilder = new MethodDescriptorBuilder('query')
                .setClassName('Connection')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            querySpanEvent = span.spanEventList[4]
            t.equal(querySpanEvent.apiId, actualMethodDescriptor.apiId, 'apiId in query spanEvent')
            t.equal(querySpanEvent.endPoint, container.getHost(), 'endPoint in query spanEvent')
            t.equal(querySpanEvent.destinationId, 'test', 'destinationId in query spanEvent')

            actualParsingResult = agent.getTraceContext().spanEventRecorderFactory.sqlMetadataService.cacheSql('DELETE FROM member WHERE id = ?')
            actualQueryAnnotation = querySpanEvent.annotations[0]
            t.equal(actualQueryAnnotation.key, annotationKey.SQL_ID.getCode(), 'key in query annotation')
            t.equal(actualQueryAnnotation.value.intValue, actualParsingResult.sqlId, 'intValue in query annotation')
            t.equal(actualQueryAnnotation.value.stringValue1, '', 'stringValue1 in query annotation')
            t.equal(actualQueryAnnotation.value.stringValue2, 'c', 'stringValue2 in query annotation')
            t.equal(actualParsingResult.sql.normalizedSql, 'DELETE FROM member WHERE id = ?', 'normalizedSql in query annotation')

            connection.end()
            t.end()
        })

        t.teardown(async () => {
        })
    })
})

test(`Connection Pool with query hooking`, async (t) => {
    const dataSender = new RecordingDataSender()
    const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()
    const container = await startMySql()

    const trace = agent.createTraceObject()
    localStorage.run(trace, async () => {
        const pool = mysql.createPool({
            host: container.getHost(),
            port: container.getPort(),
            database: 'test',
            user: container.getUsername(),
            password: container.getUserPassword(),
            timezone: '+09:00'
        })
        const promisePool = pool.promise()

        const [rows] = await promisePool.query(`SELECT * FROM member WHERE id = ?`, 'a')
        t.equal(rows[0].id, 'a', 'id in SELECT query hooking')
        t.equal(rows[0].name, 'name1', 'name in SELECT query hooking')
        t.equal(rows[0].joined.toISOString().slice(0, 10), '2023-01-17', 'joined in SELECT query hooking')

        dataSender.waitForSpan(trace.getTraceRoot()).then((span) => {
            let actualBuilder = new MethodDescriptorBuilder('createPool')
            let actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            let actualSpanEvent = span.spanEventList.find( spanEvent => spanEvent.sequence == 0)
            t.equal(actualSpanEvent.apiId, actualMethodDescriptor.apiId, 'apiId in createPool spanEvent')
            t.equal(actualSpanEvent.endPoint, container.getHost(), 'endPoint in createPool spanEvent')
            t.equal(actualSpanEvent.destinationId, 'test', 'destinationId in createPool spanEvent')
            t.equal(actualSpanEvent.sequence, 0, 'sequence in createPool spanEvent')
            t.equal(actualSpanEvent.depth, 1, 'depth in createPool spanEvent')
            t.equal(actualSpanEvent.serviceType, mysqlServiceType.getCode(), 'serviceType in createPool spanEvent')

            actualBuilder = new MethodDescriptorBuilder('query')
                .setClassName('Pool')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            actualSpanEvent = span.spanEventList.find( spanEvent => spanEvent.sequence == 1)
            t.equal(actualSpanEvent.apiId, actualMethodDescriptor.apiId, 'apiId in Pool.query() spanEvent')
            t.equal(actualSpanEvent.endPoint, container.getHost(), 'endPoint in Pool.query() spanEvent')
            t.equal(actualSpanEvent.destinationId, 'test', 'destinationId in Pool.query() spanEvent')
            t.equal(actualSpanEvent.sequence, 1, 'sequence in Pool.query() spanEvent')
            t.equal(actualSpanEvent.depth, 1, 'depth in Pool.query() spanEvent')
            t.equal(actualSpanEvent.serviceType, mysqlServiceType.getCode(), 'serviceType in Pool.query() spanEvent is MYSQL, so the MySQL link counts only the PoolConnection.query that runs the query')

            const poolGetConnectionSpanEvent = span.spanEventList.find(spanEvent => spanEvent.depth === 2)
            const poolQueryConnectionSpanEvent = dataSender.findSpanChunk(poolGetConnectionSpanEvent.asyncId).spanEventList[1]
            t.equal(poolQueryConnectionSpanEvent.apiId, apiMetaService.cacheApiWithBuilder(new MethodDescriptorBuilder('query').setClassName('PoolConnection')).apiId, 'apiId in PoolConnection.query() spanEvent in the getConnection callback of Pool.query()')
            t.equal(poolQueryConnectionSpanEvent.serviceType, mysqlExecuteQueryServiceType.getCode(), 'serviceType in PoolConnection.query() spanEvent in the getConnection callback of Pool.query()')
            t.equal(poolQueryConnectionSpanEvent.destinationId, 'test', 'destinationId in PoolConnection.query() spanEvent in the getConnection callback of Pool.query()')
            const poolQueryAnnotation = poolQueryConnectionSpanEvent.annotations[0]
            t.equal(poolQueryAnnotation.key, annotationKey.SQL_ID.getCode(), 'SQL annotation key in PoolConnection.query() spanEvent in the getConnection callback of Pool.query()')
            t.equal(poolQueryAnnotation.value.intValue, agent.getTraceContext().spanEventRecorderFactory.sqlMetadataService.cacheSql('SELECT * FROM member WHERE id = ?').sqlId, 'SQL id in PoolConnection.query() spanEvent in the getConnection callback of Pool.query()')
            t.equal(poolQueryAnnotation.value.stringValue2, 'a', 'bind value in PoolConnection.query() spanEvent in the getConnection callback of Pool.query()')
            const transactionSpanEvents = span.spanEventList.concat(dataSender.findSpanChunks(span.traceRoot).flatMap(spanChunk => spanChunk.spanEventList))
            t.equal(transactionSpanEvents.filter(spanEvent => spanEvent.serviceType === mysqlExecuteQueryServiceType.getCode()).length, 1, 'one MYSQL_EXECUTE_QUERY spanEvent for one Pool.query()')

            let actualSpanChunk = dataSender.findSpanChunk(actualSpanEvent.asyncId)
            t.equal(actualSpanChunk.getTraceRoot(), trace.getTraceRoot(), 'transactionIdObject in spanChunk in Pool.getConnection()')
            t.equal(actualSpanChunk.localAsyncId.getAsyncId(), actualSpanEvent.asyncId.getAsyncId(), 'localAsyncId asyncId in spanChunk in Pool.getConnection()')
            t.equal(actualSpanChunk.localAsyncId.sequence, 1, 'localAsyncId sequence in spanChunk in Pool.getConnection()')
            t.equal(actualSpanChunk.spanEventList[0].apiId, defaultPredefinedMethodDescriptorRegistry.asyncInvocationMethodDescriptor.apiId, 'apiId in spanChunk in Pool.getConnection()')
            t.equal(actualSpanChunk.spanEventList[0].sequence, 0, 'sequence in spanChunk in Pool.getConnection()')
            t.equal(actualSpanChunk.spanEventList[0].depth, 1, 'depth in spanChunk in Pool.getConnection()')
            t.equal(actualSpanChunk.spanEventList[0].serviceType, ServiceType.async.getCode(), 'serviceType in spanChunk in Pool.getConnection()')
        })

        setImmediate(() => {
            agent.completeTraceObject(trace)
            pool.end(() => {
                t.end()
            })
        })
    })

    t.teardown(async () => {
    })
})

test(`mysql2/promise createConnection with query hooking`, async (t) => {
    const dataSender = new RecordingDataSender()
    const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()
    const container = await startMySql()

    const trace = agent.createTraceObject()
    localStorage.run(trace, async () => {
        const connection = await mysqlp.createConnection({
            host: container.getHost(),
            port: container.getPort(3306),
            database: 'test',
            user: container.getUsername(),
            password: container.getUserPassword(),
            timezone: '+09:00'
        })

        const [rows] = await connection.query(`SELECT * FROM member WHERE id = ?`, 'a')
        t.equal(rows[0].id, 'a', 'id in SELECT query hooking')
        t.equal(rows[0].name, 'name1', 'name in SELECT query hooking')
        t.equal(rows[0].joined.toISOString().slice(0, 10), '2023-01-17', 'joined in SELECT query hooking')

        dataSender.waitForSpan(trace.getTraceRoot()).then((span) => {
            let actualBuilder = new MethodDescriptorBuilder('createConnection')
            let actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            const createConnectionSpanEvent = span.spanEventList[0]
            t.equal(createConnectionSpanEvent.apiId, actualMethodDescriptor.apiId, 'apiId in createConnection spanEvent')
            t.equal(createConnectionSpanEvent.endPoint, container.getHost(), 'endPoint in createConnection spanEvent')
            t.equal(createConnectionSpanEvent.destinationId, 'test', 'destinationId in createConnection spanEvent')
            t.equal(createConnectionSpanEvent.serviceType, mysqlServiceType.getCode(), 'serviceType in createConnection spanEvent')

            actualBuilder = new MethodDescriptorBuilder('query')
                .setClassName('Connection')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            const querySpanEvent = span.spanEventList[1]
            t.equal(querySpanEvent.apiId, actualMethodDescriptor.apiId, 'apiId in query spanEvent')
            t.equal(querySpanEvent.endPoint, container.getHost(), 'endPoint in query spanEvent')
            t.equal(querySpanEvent.destinationId, 'test', 'destinationId in query spanEvent')
            t.equal(querySpanEvent.serviceType, mysqlExecuteQueryServiceType.getCode(), 'serviceType in query spanEvent')

            const actualParsingResult = agent.getTraceContext().spanEventRecorderFactory.sqlMetadataService.cacheSql('SELECT * FROM member WHERE id = ?')
            const actualQueryAnnotation = querySpanEvent.annotations[0]
            t.equal(actualQueryAnnotation.key, annotationKey.SQL_ID.getCode(), 'key in query annotation')
            t.equal(actualQueryAnnotation.value.intValue, actualParsingResult.sqlId, 'intValue in query annotation')
            t.equal(actualQueryAnnotation.value.stringValue1, '', 'stringValue1 in query annotation')
            t.equal(actualQueryAnnotation.value.stringValue2, 'a', 'stringValue2 in query annotation')
            t.equal(actualParsingResult.sql.normalizedSql, 'SELECT * FROM member WHERE id = ?', 'normalizedSql in query annotation')
        })

        setImmediate(async () => {
            agent.completeTraceObject(trace)
            await connection.end()
            t.end()
        })
    })

    t.teardown(async () => {
    })
})

test(`mysql2/promise createPool with query hooking`, async (t) => {
    const dataSender = new RecordingDataSender()
    const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()
    const container = await startMySql()

    const trace = agent.createTraceObject()
    localStorage.run(trace, async () => {
        const pool = mysqlp.createPool({
            host: container.getHost(),
            port: container.getPort(),
            database: 'test',
            user: container.getUsername(),
            password: container.getUserPassword(),
            timezone: '+09:00'
        })

        const [rows] = await pool.query(`SELECT * FROM member WHERE id = ?`, 'a')
        t.equal(rows[0].id, 'a', 'id in SELECT query hooking')
        t.equal(rows[0].name, 'name1', 'name in SELECT query hooking')

        dataSender.waitForSpan(trace.getTraceRoot()).then((span) => {
            let actualBuilder = new MethodDescriptorBuilder('createPool')
            let actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            let actualSpanEvent = span.spanEventList.find(spanEvent => spanEvent.sequence == 0)
            t.equal(actualSpanEvent.apiId, actualMethodDescriptor.apiId, 'apiId in createPool spanEvent')
            t.equal(actualSpanEvent.endPoint, container.getHost(), 'endPoint in createPool spanEvent')
            t.equal(actualSpanEvent.destinationId, 'test', 'destinationId in createPool spanEvent')
            t.equal(actualSpanEvent.depth, 1, 'depth in createPool spanEvent')
            t.equal(actualSpanEvent.serviceType, mysqlServiceType.getCode(), 'serviceType in createPool spanEvent')

            actualBuilder = new MethodDescriptorBuilder('query')
                .setClassName('Pool')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            actualSpanEvent = span.spanEventList.find(spanEvent => spanEvent.sequence == 1)
            t.equal(actualSpanEvent.apiId, actualMethodDescriptor.apiId, 'apiId in Pool.query() spanEvent')
            t.equal(actualSpanEvent.endPoint, container.getHost(), 'endPoint in Pool.query() spanEvent')
            t.equal(actualSpanEvent.destinationId, 'test', 'destinationId in Pool.query() spanEvent')
            t.equal(actualSpanEvent.depth, 1, 'depth in Pool.query() spanEvent')
            t.equal(actualSpanEvent.serviceType, mysqlServiceType.getCode(), 'serviceType in Pool.query() spanEvent is MYSQL')

            const poolGetConnectionSpanEvent = span.spanEventList.find(spanEvent => spanEvent.depth === 2)
            const poolQueryConnectionSpanEvent = dataSender.findSpanChunk(poolGetConnectionSpanEvent.asyncId).spanEventList[1]
            t.equal(poolQueryConnectionSpanEvent.serviceType, mysqlExecuteQueryServiceType.getCode(), 'serviceType in PoolConnection.query() spanEvent in the getConnection callback of Pool.query()')
            t.equal(poolQueryConnectionSpanEvent.annotations[0].value.stringValue2, 'a', 'bind value in PoolConnection.query() spanEvent in the getConnection callback of Pool.query()')
        })

        setImmediate(async () => {
            agent.completeTraceObject(trace)
            await pool.end()
            t.end()
        })
    })

    t.teardown(async () => {
    })
})

test(`Cluster with query`, async (t) => {
    const dataSender = new RecordingDataSender()
    const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()
    const container = await startMySql()

    const trace = agent.createTraceObject()
    localStorage.run(trace, async () => {
        const poolCluster = mysqlp.createPoolCluster()
        poolCluster.add('MASTER', {
            host: container.getHost(),
            port: container.getPort(),
            database: 'test',
            user: container.getUsername(),
            password: container.getUserPassword(),
            timezone: '+09:00'
        })
        poolCluster.add('SLAVE1', {
            host: container.getHost(),
            port: container.getPort(),
            database: 'test',
            user: container.getUsername(),
            password: container.getUserPassword(),
            timezone: '+09:00'
        })
        poolCluster.add('SLAVE2', {
            host: container.getHost(),
            port: container.getPort(),
            database: 'test',
            user: container.getUsername(),
            password: container.getUserPassword(),
            timezone: '+09:00'
        })
        const connection = await poolCluster.getConnection()

        const [results] = await connection.query(`SELECT * FROM member WHERE id = ?`, 'a')
        t.equal(results[0].id, 'a', 'id in SELECT query hooking')
        t.equal(results[0].name, 'name1', 'name in SELECT query hooking')
        t.equal(results[0].joined.toISOString().slice(0, 10), '2023-01-17', 'joined in SELECT query hooking')

        const [namespaceResults] = await poolCluster.of('*').query(`SELECT * FROM member WHERE id = ?`, 'b')
        t.equal(namespaceResults[0].id, 'b', 'id in PoolCluster.of().query()')

        dataSender.waitForSpan(trace.getTraceRoot()).then((span) => {
            let actualBuilder = new MethodDescriptorBuilder('createPoolCluster')
            let actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            let actualSpanEvent = span.spanEventList[0]
            t.equal(actualSpanEvent.apiId, actualMethodDescriptor.apiId, 'apiId in createPoolCluster spanEvent')
            t.equal(actualSpanEvent.sequence, 0, 'sequence in createPoolCluster spanEvent')
            t.equal(actualSpanEvent.depth, 1, 'depth in createPoolCluster spanEvent')
            t.equal(actualSpanEvent.serviceType, mysqlServiceType.getCode(), 'serviceType in createPoolCluster spanEvent')

            actualBuilder = new MethodDescriptorBuilder('of')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            actualSpanEvent = span.spanEventList[1]
            t.equal(actualSpanEvent.apiId, actualMethodDescriptor.apiId, 'apiId in PoolCluster.of() spanEvent')
            t.equal(actualSpanEvent.sequence, 1, 'sequence in PoolCluster.of() spanEvent')
            t.equal(actualSpanEvent.depth, 1, 'depth in PoolCluster.of() spanEvent')
            t.equal(actualSpanEvent.serviceType, mysqlServiceType.getCode(), 'serviceType in PoolCluster.of() spanEvent')

            actualBuilder = new MethodDescriptorBuilder('getConnection')
                .setClassName('Pool')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            actualSpanEvent = span.spanEventList[2]
            t.equal(actualSpanEvent.apiId, actualMethodDescriptor.apiId, 'apiId in Pool.getConnection() spanEvent')
            t.equal(actualSpanEvent.sequence, 2, 'sequence in Pool.getConnection() spanEvent')
            t.equal(actualSpanEvent.depth, 1, 'depth in Pool.getConnection() spanEvent')
            t.equal(actualSpanEvent.serviceType, mysqlServiceType.getCode(), 'serviceType in Pool.getConnection() spanEvent')

            let actualSpanChunk = dataSender.findSpanChunk(actualSpanEvent.asyncId)
            t.equal(actualSpanChunk.getTraceRoot(), span.traceRoot, 'spanId in spanChunk in PoolCluster.getConnection()')
            t.equal(actualSpanChunk.localAsyncId.asyncId, actualSpanEvent.asyncId.asyncId, 'localAsyncId asyncId in spanChunk in PoolCluster.getConnection()')
            t.equal(actualSpanChunk.localAsyncId.sequence, 1, 'localAsyncId sequence in spanChunk in PoolCluster.getConnection()')
            t.equal(actualSpanChunk.spanEventList[0].apiId, defaultPredefinedMethodDescriptorRegistry.asyncInvocationMethodDescriptor.apiId, 'apiId in spanChunk in PoolCluster.getConnection()')
            t.equal(actualSpanChunk.spanEventList[0].sequence, 0, 'sequence in spanChunk in PoolCluster.getConnection()')
            t.equal(actualSpanChunk.spanEventList[0].depth, 1, 'depth in spanChunk in PoolCluster.getConnection()')
            t.equal(actualSpanChunk.spanEventList[0].serviceType, ServiceType.async.getCode(), 'serviceType in spanChunk in PoolCluster.getConnection()')

            actualBuilder = new MethodDescriptorBuilder('query')
                .setClassName('PoolConnection')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            actualSpanEvent = span.spanEventList[3]
            t.equal(actualSpanEvent.apiId, actualMethodDescriptor.apiId, 'apiId in PoolConnection.query() spanEvent')
            t.equal(actualSpanEvent.sequence, 3, 'sequence in PoolConnection.query() spanEvent')
            t.equal(actualSpanEvent.depth, 1, 'depth in PoolConnection.query() spanEvent')
            t.equal(actualSpanEvent.serviceType, mysqlExecuteQueryServiceType.getCode(), 'serviceType in PoolConnection.query() spanEvent')

            actualSpanChunk = dataSender.findSpanChunk(actualSpanEvent.asyncId)
            t.equal(actualSpanChunk.getTraceRoot(), span.traceRoot, 'spanId in spanChunk in PoolConnection.query()')
            t.equal(actualSpanChunk.localAsyncId.asyncId, actualSpanEvent.asyncId.asyncId, 'localAsyncId asyncId in spanChunk in PoolConnection.query()')
            t.equal(actualSpanChunk.localAsyncId.sequence, 1, 'localAsyncId sequence in spanChunk in PoolConnection.query()')
            t.equal(actualSpanChunk.spanEventList[0].apiId, defaultPredefinedMethodDescriptorRegistry.asyncInvocationMethodDescriptor.apiId, 'apiId in spanChunk in PoolConnection.query()')
            t.equal(actualSpanChunk.spanEventList[0].sequence, 0, 'sequence in spanChunk in PoolConnection.query()')
            t.equal(actualSpanChunk.spanEventList[0].depth, 1, 'depth in spanChunk in PoolConnection.query()')
            t.equal(actualSpanChunk.spanEventList[0].serviceType, ServiceType.async.getCode(), 'serviceType in spanChunk in PoolConnection.query()')

            const namespaceGetConnectionSpanEvent = span.spanEventList[5]
            t.equal(namespaceGetConnectionSpanEvent.apiId, apiMetaService.cacheApiWithBuilder(new MethodDescriptorBuilder('getConnection').setClassName('Pool')).apiId, 'apiId in Pool.getConnection() spanEvent of PoolCluster.of().query()')
            const namespaceQuerySpanEvent = dataSender.findSpanChunk(namespaceGetConnectionSpanEvent.asyncId).spanEventList[1]
            t.equal(namespaceQuerySpanEvent.apiId, apiMetaService.cacheApiWithBuilder(new MethodDescriptorBuilder('query').setClassName('PoolConnection')).apiId, 'apiId in PoolConnection.query() spanEvent in the getConnection callback of PoolCluster.of().query()')
            t.equal(namespaceQuerySpanEvent.serviceType, mysqlExecuteQueryServiceType.getCode(), 'serviceType in PoolConnection.query() spanEvent in the getConnection callback of PoolCluster.of().query()')
            t.equal(namespaceQuerySpanEvent.destinationId, 'test', 'destinationId in PoolConnection.query() spanEvent in the getConnection callback of PoolCluster.of().query()')
            const namespaceQueryAnnotation = namespaceQuerySpanEvent.annotations[0]
            t.equal(namespaceQueryAnnotation.key, annotationKey.SQL_ID.getCode(), 'SQL annotation key in PoolConnection.query() spanEvent in the getConnection callback of PoolCluster.of().query()')
            t.equal(namespaceQueryAnnotation.value.intValue, agent.getTraceContext().spanEventRecorderFactory.sqlMetadataService.cacheSql('SELECT * FROM member WHERE id = ?').sqlId, 'SQL id in PoolConnection.query() spanEvent in the getConnection callback of PoolCluster.of().query()')
            t.equal(namespaceQueryAnnotation.value.stringValue2, 'b', 'bind value in PoolConnection.query() spanEvent in the getConnection callback of PoolCluster.of().query()')
            const transactionSpanEvents = span.spanEventList.concat(dataSender.findSpanChunks(span.traceRoot).flatMap(spanChunk => spanChunk.spanEventList))
            t.equal(transactionSpanEvents.filter(spanEvent => spanEvent.serviceType === mysqlExecuteQueryServiceType.getCode()).length, 2, 'one MYSQL_EXECUTE_QUERY spanEvent for connection.query() and one for PoolCluster.of().query()')
            t.end()
        })

        setImmediate(() => {
            agent.completeTraceObject(trace)
            connection.release()
        })
    })
    t.teardown(async () => {
    })
})
test('a mysql2 query that fails in an unsampled trace marks the error code from its query callback', async (t) => {
    const agent = new ProcessAgentBuilder({ sampling: { enable: false } }).setDataSender(new RecordingDataSender()).build()
    const container = await startMySql()
    const pool = mysqlp.createPool(container.getConnectionUri())

    const trace = agent.createTraceObject()
    await localStorage.run(trace, () => pool.query('SELECT id FROM no_such_table').catch(() => {}))
    agent.completeTraceObject(trace)
    await pool.end()

    t.equal(trace.canSampled(), false, 'the trace is unsampled')
    t.equal(trace.getTraceRoot().getShared().getErrorCode(), 1, 'the query callback marks the error code of the unsampled trace')
    t.end()
})
