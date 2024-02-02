/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const { MySqlContainer } = require('testcontainers')
const path = require('path')
const agent = require('../../support/agent-singleton-mock')
const mysql = require('mysql')
const apiMetaService = require('../../../lib/context/api-meta-service')
const MethodDescriptorBuilder = require('../../../lib/context/method-descriptor-builder')
const sqlMetadataService = require('../../../lib/instrumentation/sql/sql-metadata-service')
const annotationKey = require('../../../lib/constant/annotation-key')
const defaultPredefinedMethodDescriptorRegistry = require('../../../lib/constant/default-predefined-method-descriptor-registry')
const mysqlExecuteQueryServiceType = require('../../../lib/instrumentation/module/mysql/mysql-execute-query-service-type')
const mysqlServiceType = require('../../../lib/instrumentation/module/mysql/mysql-service-type')
const ServiceType = require('../../../lib/context/service-type')
const localStorage = require('../../../lib/instrumentation/context/local-storage')
const fixtures = path.resolve(__dirname, '..', '..', 'fixtures', 'db')
const { asyncSpanChunkMySQLMatcher } = require('../../fixtures/instrument-support')
const express = require('express')
const axios = require('axios')

test(`getConnection query hooking`, async (t) => {
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
        connection.query(`SELECT * FROM member`, async function (error, results) {
            if (error) throw error
            t.equal(results[0].id, 'a', 'SELECT member id')
            t.equal(results[0].name, 'name1', 'SELECT member name')
            t.equal(results[0].joined.getDate(), new Date('2023-01-18T00:00:00+09:00').getDate(), 'SELECT member joined')

            trace.close()
            connection.end()
            await container.stop()

            let actualBuilder = new MethodDescriptorBuilder('createConnection')
                .setLineNumber(43)
                .setFileName('mysql.test.js')
            let actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            const createConnectionSpanEvent = trace.span.spanEventList[0]
            t.equal(createConnectionSpanEvent.endPoint, 'localhost', 'the createConnection SpanEvent endPoint')
            t.equal(createConnectionSpanEvent.destinationId, 'test', 'the createConnection SpanEvent destinationId')
            t.equal(actualMethodDescriptor.apiId, createConnectionSpanEvent.apiId, 'apiId')

            actualBuilder = new MethodDescriptorBuilder('connect')
                .setClassName('Connection')
                .setLineNumber(52)
                .setFileName('mysql.test.js')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            const connectionSpanEvent = trace.span.spanEventList[1]
            t.equal(connectionSpanEvent.depth, 1, 'connection spanEvent depth')
            t.equal(connectionSpanEvent.sequence, 1, 'connection spanEvent sequence')
            t.equal(actualMethodDescriptor.apiId, connectionSpanEvent.apiId, 'apiId')

            actualBuilder = new MethodDescriptorBuilder('query')
                .setClassName('Connection')
                .setLineNumber(58)
                .setFileName('mysql.test.js')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            const querySpanEvent = trace.span.spanEventList[2]
            t.equal(querySpanEvent.depth, 1, 'query spanEvent depth')
            t.equal(querySpanEvent.sequence, 2, 'query spanEvent sequence')
            t.equal(actualMethodDescriptor.apiId, querySpanEvent.apiId, 'apiId')

            t.end()
        })
    })
})

test(`connection with query`, async (t) => {
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
        connection.query('SELECT * FROM `member` WHERE id = ?', 'a', async function (error) {
            if (error) throw error
        })
        connection.query('INSERT INTO `member` (id, name, joined) VALUES (?, ?, ?)', ['c', 'cname', '2023-08-18'], async function (error, results) {
            if (error) throw error
            t.equal(results.affectedRows, 1, 'INSERT INTO `member` (id, name) VALUES (?, ?)')
        })
        connection.query('SELECT * FROM `member` WHERE id = ?', 'c', async function (error, results) {
            if (error) throw error

            setImmediate(() => {
                trace.close()
                connection.end()
                container.stop()
            })

            t.equal(results[0].id, 'c', 'SELECT member id')
            t.equal(results[0].name, 'cname', 'SELECT member name')
            t.equal(results[0].joined.getDate(), new Date('2023-01-18T00:00:00+09:00').getDate(), 'SELECT member joined')
        })

        agent.callbackTraceClose((trace) => {
            let actualBuilder = new MethodDescriptorBuilder('createConnection')
                .setLineNumber(119)
                .setFileName('mysql.test.js')
            let actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            const createConnectionSpanEvent = trace.span.spanEventList[0]
            t.equal(createConnectionSpanEvent.endPoint, 'localhost', 'the createConnection SpanEvent endPoint')
            t.equal(createConnectionSpanEvent.destinationId, 'test', 'the createConnection SpanEvent destinationId')
            t.equal(actualMethodDescriptor.apiId, createConnectionSpanEvent.apiId, 'apiId')

            actualBuilder = new MethodDescriptorBuilder('connect')
                .setClassName('Connection')
                .setLineNumber(128)
                .setFileName('mysql.test.js')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            const connectionSpanEvent = trace.span.spanEventList[1]
            t.equal(connectionSpanEvent.depth, 1, 'connection spanEvent depth')
            t.equal(connectionSpanEvent.sequence, 1, 'connection spanEvent sequence')
            t.equal(actualMethodDescriptor.apiId, connectionSpanEvent.apiId, 'apiId')

            actualBuilder = new MethodDescriptorBuilder('query')
                .setClassName('Connection')
                .setLineNumber(135)
                .setFileName('mysql.test.js')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            let querySpanEvent = trace.span.spanEventList[2]
            t.equal(querySpanEvent.endPoint, 'localhost', 'the createConnection SpanEvent endPoint')
            t.equal(querySpanEvent.destinationId, 'test', 'the createConnection SpanEvent destinationId')
            t.equal(actualMethodDescriptor.apiId, querySpanEvent.apiId, 'apiId')

            let actualParsingResult = sqlMetadataService.cacheSql('SELECT DATABASE() as res')
            let actualQueryAnnotation = querySpanEvent.annotations[0]
            t.equal(actualQueryAnnotation.key, annotationKey.SQL_ID.getCode(), 'the query annotation key')
            t.equal(actualQueryAnnotation.value.intValue, actualParsingResult.result.sqlId, 'the query annotation value')
            t.equal(actualParsingResult.result.sql.normalizedSql, 'SELECT DATABASE() as res', 'the query annotation squl normalizedSql')

            actualBuilder = new MethodDescriptorBuilder('query')
                .setClassName('Connection')
                .setLineNumber(139)
                .setFileName('mysql.test.js')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            querySpanEvent = trace.span.spanEventList[3]
            t.equal(querySpanEvent.endPoint, 'localhost', 'the createConnection SpanEvent endPoint')
            t.equal(querySpanEvent.destinationId, 'test', 'the createConnection SpanEvent destinationId')
            t.equal(actualMethodDescriptor.apiId, querySpanEvent.apiId, 'apiId')

            actualParsingResult = sqlMetadataService.cacheSql('SHOW TABLES')
            actualQueryAnnotation = querySpanEvent.annotations[0]
            t.equal(actualQueryAnnotation.key, annotationKey.SQL_ID.getCode(), 'the query annotation key')
            t.equal(actualQueryAnnotation.value.intValue, actualParsingResult.result.sqlId, 'the query annotation value')
            t.equal(actualParsingResult.result.sql.normalizedSql, 'SHOW TABLES', 'the query annotation squl normalizedSql')

            actualBuilder = new MethodDescriptorBuilder('query')
                .setClassName('Connection')
                .setLineNumber(143)
                .setFileName('mysql.test.js')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            querySpanEvent = trace.span.spanEventList[4]
            t.equal(querySpanEvent.endPoint, 'localhost', 'the createConnection SpanEvent endPoint')
            t.equal(querySpanEvent.destinationId, 'test', 'the createConnection SpanEvent destinationId')
            t.equal(actualMethodDescriptor.apiId, querySpanEvent.apiId, 'apiId')

            actualParsingResult = sqlMetadataService.cacheSql('SELECT * FROM `member` WHERE id = ?')
            actualQueryAnnotation = querySpanEvent.annotations[0]
            t.equal(actualQueryAnnotation.key, annotationKey.SQL_ID.getCode(), 'the query annotation key')
            t.equal(actualQueryAnnotation.value.intValue, actualParsingResult.result.sqlId, 'the query annotation value')
            t.equal(actualQueryAnnotation.value.stringValue1, '', 'the query annotation value stringValue1 is sql normalizedSql parsedParameters')
            t.equal(actualQueryAnnotation.value.stringValue2, 'a', 'the query annotation value stringValue2 is bind value')
            t.equal(actualParsingResult.result.sql.normalizedSql, 'SELECT * FROM `member` WHERE id = ?', 'the query annotation sql normalizedSql')

            actualBuilder = new MethodDescriptorBuilder('query')
                .setClassName('Connection')
                .setLineNumber(146)
                .setFileName('mysql.test.js')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            querySpanEvent = trace.span.spanEventList[5]
            t.equal(querySpanEvent.endPoint, 'localhost', 'the createConnection SpanEvent endPoint')
            t.equal(querySpanEvent.destinationId, 'test', 'the createConnection SpanEvent destinationId')
            t.equal(actualMethodDescriptor.apiId, querySpanEvent.apiId, 'apiId')

            actualParsingResult = sqlMetadataService.cacheSql('INSERT INTO `member` (id, name, joined) VALUES (?, ?, ?)')
            actualQueryAnnotation = querySpanEvent.annotations[0]
            t.equal(actualQueryAnnotation.key, annotationKey.SQL_ID.getCode(), 'the query annotation key')
            t.equal(actualQueryAnnotation.value.intValue, actualParsingResult.result.sqlId, 'the query annotation value')
            t.equal(actualQueryAnnotation.value.stringValue1, '', 'the query annotation value stringValue1 is sql normalizedSql parsedParameters')
            t.equal(actualQueryAnnotation.value.stringValue2, 'c,cname,2023-08-18', 'the query annotation value stringValue2 is bind value')
            t.equal(actualParsingResult.result.sql.normalizedSql, 'INSERT INTO `member` (id, name, joined) VALUES (?, ?, ?)', 'the query annotation sql normalizedSql')

            t.end()
        })
    })
})

test(`Connection Pool with query`, async (t) => {
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
                    trace.close()
                    pool.end()
                    await container.stop()
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
                    trace.close()
                    pool.end()
                    await container.stop()
                }, 1000)
            }
        })

        agent.callbackTraceClose((trace) => {
            let actualBuilder = new MethodDescriptorBuilder('createPool')
                .setLineNumber(274)
                .setFileName('mysql.test.js')
            let actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            let actualSpanEvent = trace.span.spanEventList[0]
            t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'apiId')
            t.equal(actualSpanEvent.endPoint, 'localhost', 'createPool SpanEvent endPoint')
            t.equal(actualSpanEvent.destinationId, 'test', 'createPool SpanEvent destinationId')
            t.equal(actualSpanEvent.sequence, 0, 'createPool spanEvent sequence')
            t.equal(actualSpanEvent.depth, 1, 'createPool spanEvent depth')
            t.equal(actualSpanEvent.serviceType, mysqlServiceType.getCode(), 'createPool spanEvent serviceType')

            actualBuilder = new MethodDescriptorBuilder('getConnection')
                .setClassName('Pool')
                .setLineNumber(285)
                .setFileName('mysql.test.js')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            actualSpanEvent = trace.span.spanEventList[1]
            t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'Pool.getConnection spanEvent apiId')
            t.equal(actualSpanEvent.depth, 1, 'Pool.getConnection spanEvent depth')
            t.equal(actualSpanEvent.sequence, 1, 'Pool.getConnection spanEvent sequence')
            t.equal(actualSpanEvent.serviceType, mysqlServiceType.getCode(), 'Pool.getConnection spanEvent serviceType')

            let actualSpanChunk = trace.storage.dataSender.findSpanChunk(actualSpanEvent.nextAsyncId)
            t.equal(actualSpanChunk.spanId, actualSpanEvent.spanId, 'spanChunk spanId')
            t.equal(actualSpanChunk.transactionIdObject, trace.traceId.transactionId, 'spanChunk transactionIdObject')
            t.equal(actualSpanChunk.localAsyncId.asyncId, actualSpanEvent.nextAsyncId, 'spanChunk localAsyncId.asyncId is spanEvent nextAsyncId')
            t.equal(actualSpanChunk.localAsyncId.sequence, 1, 'spanChunk localAsyncId.sequence is spanEvent 0')
            t.equal(actualSpanChunk.spanEventList[1].apiId, defaultPredefinedMethodDescriptorRegistry.asyncInvocationDescriptor.apiId, 'spanChunk spanEventList[0].apiId must be asyncInvocationDescriptor.apiId')
            t.equal(actualSpanChunk.spanEventList[1].depth, 1, 'spanChunk spanEventList[0].depth is 1')
            t.equal(actualSpanChunk.spanEventList[1].sequence, 0, 'spanChunk spanEventList[0].sequence is 0')
            t.equal(actualSpanChunk.spanEventList[1].serviceType, ServiceType.async.getCode(), 'spanChunk spanEventList[0].serviceType is ServiceTypeCode.async')

            actualBuilder = new MethodDescriptorBuilder('query')
                .setClassName('PoolConnection')
                .setLineNumber(287)
                .setFileName('mysql.test.js')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            actualSpanEvent = actualSpanChunk.spanEventList[0]
            t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'PoolConnection.query spanEvent apiId on pool.query')
            t.equal(actualSpanEvent.depth, 2, 'PoolConnection.query spanEvent depth on pool.query')
            t.equal(actualSpanEvent.sequence, 1, 'PoolConnection.query spanEvent sequence on pool.query')
            t.equal(actualSpanEvent.serviceType, mysqlExecuteQueryServiceType.getCode(), 'PoolConnection.query spanEvent serviceType on pool.query')

            asyncSpanChunkMySQLMatcher(t, trace, actualSpanEvent)

            actualBuilder = new MethodDescriptorBuilder('getConnection')
                .setClassName('Pool')
                .setLineNumber(202)
                .setFileName('Pool.js')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            actualSpanEvent = trace.span.spanEventList[2]
            t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'Pool.getConnection spanEvent apiId on pool.query')
            t.equal(actualSpanEvent.depth, 1, 'Pool.getConnection spanEvent depth on pool.query')
            t.equal(actualSpanEvent.sequence, 2, 'Pool.getConnection spanEvent sequence on pool.query')
            t.equal(actualSpanEvent.serviceType, mysqlServiceType.getCode(), 'Pool.getConnection spanEvent serviceType on pool.query')

            actualSpanChunk = trace.storage.dataSender.findSpanChunk(actualSpanEvent.nextAsyncId)
            t.equal(actualSpanChunk.spanId, actualSpanEvent.spanId, 'spanChunk spanId on pool.query')
            t.equal(actualSpanChunk.transactionIdObject, trace.traceId.transactionId, 'spanChunk transactionIdObject on pool.query')
            t.equal(actualSpanChunk.localAsyncId.asyncId, actualSpanEvent.nextAsyncId, 'spanChunk localAsyncId.asyncId is spanEvent nextAsyncId on pool.query')
            t.equal(actualSpanChunk.localAsyncId.sequence, 1, 'spanChunk localAsyncId.sequence is spanEvent 0 on pool.query')
            t.equal(actualSpanChunk.spanEventList[1].apiId, defaultPredefinedMethodDescriptorRegistry.asyncInvocationDescriptor.apiId, 'spanChunk spanEventList[0].apiId must be asyncInvocationDescriptor.apiId on pool.query')
            t.equal(actualSpanChunk.spanEventList[1].depth, 1, 'spanChunk spanEventList[0].depth is 1 on pool.query')
            t.equal(actualSpanChunk.spanEventList[1].sequence, 0, 'spanChunk spanEventList[0].sequence is 0 on pool.query')
            t.equal(actualSpanChunk.spanEventList[1].serviceType, ServiceType.async.getCode(), 'spanChunk spanEventList[0].serviceType is ServiceTypeCode.async on pool.query')

            actualBuilder = new MethodDescriptorBuilder('query')
                .setClassName('PoolConnection')
                .setLineNumber(214)
                .setFileName('Pool.js')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            actualSpanEvent = actualSpanChunk.spanEventList[0]
            t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'PoolConnection.query spanEvent apiId on pool.query')
            t.equal(actualSpanEvent.depth, 2, 'PoolConnection.query spanEvent depth on pool.query')
            t.equal(actualSpanEvent.sequence, 1, 'PoolConnection.query spanEvent sequence on pool.query')
            t.equal(actualSpanEvent.serviceType, mysqlExecuteQueryServiceType.getCode(), 'PoolConnection.query spanEvent serviceType on pool.query')
            asyncSpanChunkMySQLMatcher(t, trace, actualSpanEvent)
            t.end()
        })
    })
})

test(`Cluster with query`, async (t) => {
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
                    trace.close()
                    poolCluster.end()
                    await container.stop()
                })
            })
        })

        agent.callbackTraceClose((trace) => {
            let actualBuilder = new MethodDescriptorBuilder('createPoolCluster')
                .setLineNumber(417)
                .setFileName('mysql.test.js')
            let actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            let actualSpanEvent = trace.span.spanEventList[0]
            t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'apiId')
            t.equal(actualSpanEvent.sequence, 0, 'createPoolCluster spanEvent sequence')
            t.equal(actualSpanEvent.depth, 1, 'createPoolCluster spanEvent depth')
            t.equal(actualSpanEvent.serviceType, mysqlServiceType.getCode(), 'createPoolCluster spanEvent serviceType')

            actualBuilder = new MethodDescriptorBuilder('of')
                .setLineNumber(142)
                .setFileName('PoolCluster.js')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            actualSpanEvent = trace.span.spanEventList[1]
            t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'PoolCluster.of spanEvent apiId in poolCluster.getConnection')
            t.equal(actualSpanEvent.depth, 1, 'PoolCluster.of spanEvent depth in poolCluster.getConnection')
            t.equal(actualSpanEvent.sequence, 1, 'PoolCluster.of spanEvent sequence in poolCluster.getConnection')
            t.equal(actualSpanEvent.serviceType, mysqlServiceType.getCode(), 'PoolCluster.of spanEvent serviceType in poolCluster.getConnection')

            actualBuilder = new MethodDescriptorBuilder('getConnection')
                .setClassName('Pool')
                .setLineNumber(145)
                .setFileName('PoolCluster.js')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            actualSpanEvent = trace.span.spanEventList[2]
            t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'Pool.getConnection spanEvent apiId in poolCluster.getConnection')
            t.equal(actualSpanEvent.depth, 1, 'Pool.getConnection spanEvent depth in poolCluster.getConnection')
            t.equal(actualSpanEvent.sequence, 2, 'Pool.getConnection spanEvent sequence in poolCluster.getConnection')
            t.equal(actualSpanEvent.serviceType, mysqlServiceType.getCode(), 'Pool.getConnection spanEvent serviceType in poolCluster.getConnection')

            let actualSpanChunk = trace.storage.dataSender.findSpanChunk(actualSpanEvent.nextAsyncId)
            t.equal(actualSpanChunk.spanId, actualSpanEvent.spanId, 'spanChunk spanId in poolCluster.getConnection')
            t.equal(actualSpanChunk.transactionIdObject, trace.traceId.transactionId, 'spanChunk transactionIdObject in poolCluster.getConnection')
            t.equal(actualSpanChunk.localAsyncId.asyncId, actualSpanEvent.nextAsyncId, 'spanChunk localAsyncId.asyncId is spanEvent nextAsyncId in poolCluster.getConnection')
            t.equal(actualSpanChunk.localAsyncId.sequence, 1, 'spanChunk localAsyncId.sequence is spanEvent 0 in poolCluster.getConnection')
            t.equal(actualSpanChunk.spanEventList[1].apiId, defaultPredefinedMethodDescriptorRegistry.asyncInvocationDescriptor.apiId, 'spanChunk spanEventList[0].apiId must be asyncInvocationDescriptor.apiId in poolCluster.getConnection')
            t.equal(actualSpanChunk.spanEventList[1].depth, 1, 'spanChunk spanEventList[0].depth is 1 in poolCluster.getConnection')
            t.equal(actualSpanChunk.spanEventList[1].sequence, 0, 'spanChunk spanEventList[0].sequence is 0 in poolCluster.getConnection')
            t.equal(actualSpanChunk.spanEventList[1].serviceType, ServiceType.async.getCode(), 'spanChunk spanEventList[0].serviceType is ServiceTypeCode.async in poolCluster.getConnection')

            actualBuilder = new MethodDescriptorBuilder('query')
                .setClassName('PoolConnection')
                .setLineNumber(448)
                .setFileName('mysql.test.js')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            actualSpanEvent = actualSpanChunk.spanEventList[0]
            t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'PoolConnection.query spanEvent apiId in poolCluster.getConnection')
            t.equal(actualSpanEvent.depth, 2, 'PoolConnection.query spanEvent depth in poolCluster.getConnection')
            t.equal(actualSpanEvent.sequence, 1, 'PoolConnection.query spanEvent sequence in poolCluster.getConnection')
            t.equal(actualSpanEvent.serviceType, mysqlExecuteQueryServiceType.getCode(), 'PoolConnection.query spanEvent serviceType in poolCluster.getConnection')

            asyncSpanChunkMySQLMatcher(t, trace, actualSpanEvent)
            t.end()
        })
    })
})

test('Disable trace', async (t) => {
    agent.bindHttp()
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

    let callCount = 0
    app.get('/test1', (req, res) => {
        connection.query(`SELECT * FROM member`, function (error, results) {
            if (error) throw error            
            res.send(results)
        })
        callCount++
        agent.callbackTraceClose((trace) => {
            if (callCount == 1) {
                t.equal(trace.span.spanEventList.length, 2, 'spanEventList length is 2')

                let actualBuilder = new MethodDescriptorBuilder('get')
                                            .setClassName('Router')
                let actualMethodDescriptor =apiMetaService.cacheApiWithBuilder(actualBuilder)
                let actualSpanEvent = trace.span.spanEventList.find( spanEvent => spanEvent.sequence == 0)
                t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'apiId in sampled Trace of DisableTrace Functional Tests')
                t.equal(actualMethodDescriptor.apiDescriptor, 'Router.get', 'apiDescriptor in sampled Trace of DisableTrace Functional Tests')
                t.equal(actualMethodDescriptor.className, 'Router', 'className in sampled Trace of DisableTrace Functional Tests')
                t.equal(actualMethodDescriptor.methodName, 'get', 'methodName in sampled Trace of DisableTrace Functional Tests')
                t.equal(actualSpanEvent.sequence, 0, 'spanEvent.sequence Router.get in sampled Trace of DisableTrace Functional Tests')
                t.equal(actualSpanEvent.depth, 1, 'spanEvent.depth Router.get in sampled Trace of DisableTrace Functional Tests')
                t.equal(actualSpanEvent.serviceType, ServiceType.express.getCode(), 'spanEvent.serviceType Router.get in sampled Trace of DisableTrace Functional Tests')
                t.equal(actualSpanEvent.destinationId, 'localhost:5006', 'spanEvent.destinationId Router.get in sampled Trace of DisableTrace Functional Tests')
                t.equal(actualSpanEvent.endPoint, 'localhost:5006', 'spanEvent.endPoint Router.get in sampled Trace of DisableTrace Functional Tests')
                t.equal(actualSpanEvent.nextSpanId, -1, 'spanEvent.nextSpanId Router.get in sampled Trace of DisableTrace Functional Tests')

                actualBuilder = new MethodDescriptorBuilder('query')
                                            .setClassName('Connection')
                actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
                actualSpanEvent = trace.span.spanEventList.find( spanEvent => spanEvent.sequence == 1)
                t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'apiId Connection.query in sampled Trace of DisableTrace Functional Tests')
                t.equal(actualMethodDescriptor.apiDescriptor, 'Connection.query', 'apiDescriptor Connection.query in sampled Trace of DisableTrace Functional Tests')
                t.equal(actualMethodDescriptor.className, 'Connection', 'className Connection.query in sampled Trace of DisableTrace Functional Tests')
                t.equal(actualMethodDescriptor.methodName, 'query', 'methodName Connection.query in sampled Trace of DisableTrace Functional Tests')
                t.equal(actualSpanEvent.sequence, 1, 'spanEvent.sequence Connection.query in sampled Trace of DisableTrace Functional Tests')
                t.equal(actualSpanEvent.depth, 2, 'spanEvent.depth Connection.query in sampled Trace of DisableTrace Functional Tests')
                t.equal(actualSpanEvent.serviceType, mysqlExecuteQueryServiceType.getCode(), 'spanEvent.serviceType Connection.query in sampled Trace of DisableTrace Functional Tests')
                t.equal(actualSpanEvent.destinationId, 'test', 'spanEvent.destinationId Connection.query in sampled Trace of DisableTrace Functional Tests')
                t.equal(actualSpanEvent.endPoint, 'localhost', 'spanEvent.endPoint Connection.query in sampled Trace of DisableTrace Functional Tests')
                t.equal(actualSpanEvent.nextSpanId, -1, 'spanEvent.nextSpanId Connection.query in sampled Trace of DisableTrace Functional Tests')
                let actualNextAsyncId = actualSpanEvent.nextAsyncId
                let actualSpanChunk = trace.storage.dataSender.findSpanChunk(actualNextAsyncId)
                t.equal(actualSpanChunk.spanId, actualSpanEvent.spanId, 'spanChunk.spanId equals to spanEvent.spanId Connection.query in sampled Trace of DisableTrace Functional Tests')
                t.equal(actualSpanChunk.transactionIdObject, trace.traceId.transactionId, 'spanChunk.transactionIdObject Connection.query in sampled Trace of DisableTrace Functional Tests')
                t.equal(actualSpanChunk.localAsyncId.asyncId, actualSpanEvent.nextAsyncId, 'spanChunk.localAsyncId.asyncId Connection.query in sampled Trace of DisableTrace Functional Tests')
                t.equal(actualSpanChunk.localAsyncId.sequence, 1, 'spanChunk.localAsyncId.sequence Connection.query in sampled Trace of DisableTrace Functional Tests')
                t.equal(actualSpanChunk.spanEventList[0].apiId, defaultPredefinedMethodDescriptorRegistry.asyncInvocationDescriptor.apiId, 'spanChunk.spanEventList[0].apiId is asyncInvocationDescriptor.apiId Connection.query in sampled Trace of DisableTrace Functional Tests')
                t.equal(actualSpanChunk.spanEventList[0].depth, 1, 'spanChunk.spanEventList[0].depth is 1 Connection.query in sampled Trace of DisableTrace Functional Tests')
                t.equal(actualSpanChunk.spanEventList[0].sequence, 0, 'spanChunk.spanEventList[0].sequence is 0 Connection.query in sampled Trace of DisableTrace Functional Tests')
                t.equal(actualSpanChunk.spanEventList[0].serviceType, ServiceType.async.getCode(), 'spanChunk.spanEventList[0].serviceType is async Connection.query in sampled Trace of DisableTrace Functional Tests')
            } else if (callCount == 2) {
                t.false(trace.span, 'trace.span is undefined')
            }
        })
    })

    const server = app.listen(5006, async () => {
        let result = await axios.get('http://localhost:5006/test1')
        t.equal(result.status, 200, 'status code is 200')

        agent.bindHttp({ 'sampling': { 'enable': false } })
        result = await axios.get('http://localhost:5006/test1')
        t.equal(result.status, 200, 'status code is 200')

        connection.end()
        await container.stop()
        t.end()
        server.close()
    })
})