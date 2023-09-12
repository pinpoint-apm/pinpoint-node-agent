/**
 * Pinpoint Node.js Agent
 * Copyright 2023-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const path = require('path')
const agent = require('../../support/agent-singleton-mock')
const { MySqlContainer } = require('testcontainers')
const mysql = require('mysql2')
const mysqlp = require('mysql2/promise')
const MethodDescriptorBuilder2 = require('../../../lib/context/method-descriptor-builder2')
const apiMetaService = require('../../../lib/context/api-meta-service')
const sqlMetadataService = require('../../../lib/instrumentation/sql/sql-metadata-service')
const annotationKey = require('../../../lib/constant/annotation-key')
const mysqlServiceType = require('../../../lib/instrumentation/module/mysql/mysql-service-type')
const mysqlExecuteQueryServiceType = require('../../../lib/instrumentation/module/mysql/mysql-execute-query-service-type')
const defaultPredefinedMethodDescriptorRegistry = require('../../../lib/constant/default-predefined-method-descriptor-registry')
const ServiceType = require('../../../lib/context/service-type')

const fixtures = path.resolve(__dirname, '..', '..', 'fixtures', 'db')
test(`getConnection query hooking`, async (t) => {
    agent.bindHttp()
    const source = path.resolve(fixtures, 'mysql.sql')
    const container = await new MySqlContainer()
        .withCommand('--default-authentication-plugin=mysql_native_password')
        .withEnvironment({
            'MYSQL_DATABASE': 'test',
            'TX': 'Asia/Seoul',
        })
        .withCopyFilesToContainer([{
            source: source,
            target: '/docker-entrypoint-initdb.d/mysql.sql'
        }])
        .start()

    const trace = agent.createTraceObject()
    const connection = mysql.createConnection({
        host: container.getHost(),
        port: container.getPort(3306),
        database: 'test',
        user: container.getUsername(),
        password: container.getUserPassword(),
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
            trace.close()
            connection.end()
            container.stop()
        })
    })

    agent.callbackTraceClose((trace) => {
        let actualBuilder = new MethodDescriptorBuilder2('createConnection')
            .setLineNumber(39)
            .setFileName('mysql2.test.js')
        let actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
        const createConnectionSpanEvent = trace.span.spanEventList[0]
        t.equal(createConnectionSpanEvent.apiId, actualMethodDescriptor.apiId, 'apiId in createConnection spanEvent')
        t.equal(createConnectionSpanEvent.endPoint, 'localhost', 'endPoint in createConnection spanEvent')
        t.equal(createConnectionSpanEvent.destinationId, 'test', 'destinationId in createConnection spanEvent')

        actualBuilder = new MethodDescriptorBuilder2('query')
            .setClassName('Connection')
            .setLineNumber(47)
            .setFileName('mysql2.test.js')
        actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
        let querySpanEvent = trace.span.spanEventList[1]
        t.equal(querySpanEvent.apiId, actualMethodDescriptor.apiId, 'apiId in query spanEvent')
        t.equal(querySpanEvent.endPoint, 'localhost', 'endPoint in query spanEvent')
        t.equal(querySpanEvent.destinationId, 'test', 'destinationId in query spanEvent')

        let actualParsingResult = sqlMetadataService.cacheSql('SELECT * FROM member WHERE id = ?')
        let actualQueryAnnotation = querySpanEvent.annotations[0]
        t.equal(actualQueryAnnotation.key, annotationKey.SQL_ID.getCode(), 'key in query annotation')
        t.equal(actualQueryAnnotation.value.intValue, actualParsingResult.sqlId, 'intValue in query annotation')
        t.equal(actualQueryAnnotation.value.stringValue1, '', 'stringValue1 in query annotation')
        t.equal(actualQueryAnnotation.value.stringValue2, 'a', 'stringValue2 in query annotation')
        t.equal(actualParsingResult.sql.normalizedSql, 'SELECT * FROM member WHERE id = ?', 'normalizedSql in query annotation')

        actualBuilder = new MethodDescriptorBuilder2('query')
            .setClassName('Connection')
            .setLineNumber(55)
            .setFileName('mysql2.test.js')
        actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
        querySpanEvent = trace.span.spanEventList[2]
        t.equal(querySpanEvent.apiId, actualMethodDescriptor.apiId, 'apiId in query spanEvent')
        t.equal(querySpanEvent.endPoint, 'localhost', 'endPoint in query spanEvent')
        t.equal(querySpanEvent.destinationId, 'test', 'destinationId in query spanEvent')

        actualParsingResult = sqlMetadataService.cacheSql('INSERT INTO member (id, name, joined) VALUES (?, ?, ?)')
        actualQueryAnnotation = querySpanEvent.annotations[0]
        t.equal(actualQueryAnnotation.key, annotationKey.SQL_ID.getCode(), 'key in query annotation')
        t.equal(actualQueryAnnotation.value.intValue, actualParsingResult.sqlId, 'intValue in query annotation')
        t.equal(actualQueryAnnotation.value.stringValue1, '', 'stringValue1 in query annotation')
        t.equal(actualQueryAnnotation.value.stringValue2, 'c,cname,2023-08-18', 'stringValue2 in query annotation')
        t.equal(actualParsingResult.sql.normalizedSql, 'INSERT INTO member (id, name, joined) VALUES (?, ?, ?)', 'normalizedSql in query annotation')

        actualBuilder = new MethodDescriptorBuilder2('query')
            .setClassName('Connection')
            .setLineNumber(59)
            .setFileName('mysql2.test.js')
        actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
        querySpanEvent = trace.span.spanEventList[3]
        t.equal(querySpanEvent.apiId, actualMethodDescriptor.apiId, 'apiId in query spanEvent')
        t.equal(querySpanEvent.endPoint, 'localhost', 'endPoint in query spanEvent')
        t.equal(querySpanEvent.destinationId, 'test', 'destinationId in query spanEvent')

        actualParsingResult = sqlMetadataService.cacheSql('UPDATE member SET name = ? WHERE id = ?')
        actualQueryAnnotation = querySpanEvent.annotations[0]
        t.equal(actualQueryAnnotation.key, annotationKey.SQL_ID.getCode(), 'key in query annotation')
        t.equal(actualQueryAnnotation.value.intValue, actualParsingResult.sqlId, 'intValue in query annotation')
        t.equal(actualQueryAnnotation.value.stringValue1, '', 'stringValue1 in query annotation')
        t.equal(actualQueryAnnotation.value.stringValue2, 'cname2,c', 'stringValue2 in query annotation')
        t.equal(actualParsingResult.sql.normalizedSql, 'UPDATE member SET name = ? WHERE id = ?', 'normalizedSql in query annotation')

        actualBuilder = new MethodDescriptorBuilder2('query')
            .setClassName('Connection')
            .setLineNumber(63)
            .setFileName('mysql2.test.js')
        actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
        querySpanEvent = trace.span.spanEventList[4]
        t.equal(querySpanEvent.apiId, actualMethodDescriptor.apiId, 'apiId in query spanEvent')
        t.equal(querySpanEvent.endPoint, 'localhost', 'endPoint in query spanEvent')
        t.equal(querySpanEvent.destinationId, 'test', 'destinationId in query spanEvent')

        actualParsingResult = sqlMetadataService.cacheSql('DELETE FROM member WHERE id = ?')
        actualQueryAnnotation = querySpanEvent.annotations[0]
        t.equal(actualQueryAnnotation.key, annotationKey.SQL_ID.getCode(), 'key in query annotation')
        t.equal(actualQueryAnnotation.value.intValue, actualParsingResult.sqlId, 'intValue in query annotation')
        t.equal(actualQueryAnnotation.value.stringValue1, '', 'stringValue1 in query annotation')
        t.equal(actualQueryAnnotation.value.stringValue2, 'c', 'stringValue2 in query annotation')
        t.equal(actualParsingResult.sql.normalizedSql, 'DELETE FROM member WHERE id = ?', 'normalizedSql in query annotation')
        t.end()
    })
})

test(`getConnection promise query hooking`, async (t) => {
    agent.bindHttp()
    const source = path.resolve(fixtures, 'mysql.sql')
    const container = await new MySqlContainer()
        .withCommand('--default-authentication-plugin=mysql_native_password')
        .withEnvironment({
            'MYSQL_DATABASE': 'test',
            'TX': 'Asia/Seoul',
        })
        .withCopyFilesToContainer([{
            source: source,
            target: '/docker-entrypoint-initdb.d/mysql.sql'
        }])
        .start()
    
    const trace = agent.createTraceObject()
    const connection = mysql.createConnection({
        host: container.getHost(),
        port: container.getPort(3306),
        database: 'test',
        user: container.getUsername(),
        password: container.getUserPassword(),
    })

    const [rows] = await connection.promise().query(`SELECT * FROM member WHERE id = ?`, 'a')
    t.equal(rows[0].id, 'a', 'id in SELECT query hooking')
    t.equal(rows[0].name, 'name1', 'name in SELECT query hooking')
    t.equal(rows[0].joined.toISOString().slice(0, 10), '2023-01-17', 'joined in SELECT query hooking')

    setImmediate(() => {
        trace.close()
        connection.end()
        container.stop()
        t.end()
    })

    agent.callbackTraceClose((trace) => {
        let actualBuilder = new MethodDescriptorBuilder2('createConnection')
            .setLineNumber(174)
            .setFileName('mysql2.test.js')
        let actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
        const createConnectionSpanEvent = trace.span.spanEventList[0]
        t.equal(createConnectionSpanEvent.apiId, actualMethodDescriptor.apiId, 'apiId in createConnection spanEvent')
        t.equal(createConnectionSpanEvent.endPoint, 'localhost', 'endPoint in createConnection spanEvent')
        t.equal(createConnectionSpanEvent.destinationId, 'test', 'destinationId in createConnection spanEvent')

        actualBuilder = new MethodDescriptorBuilder2('query')
            .setClassName('Connection')
        actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
        let querySpanEvent = trace.span.spanEventList[1]
        t.equal(querySpanEvent.apiId, actualMethodDescriptor.apiId, 'apiId in query spanEvent')
        t.equal(querySpanEvent.endPoint, 'localhost', 'endPoint in query spanEvent')
        t.equal(querySpanEvent.destinationId, 'test', 'destinationId in query spanEvent')

        let actualParsingResult = sqlMetadataService.cacheSql('SELECT * FROM member WHERE id = ?')
        let actualQueryAnnotation = querySpanEvent.annotations[0]
        t.equal(actualQueryAnnotation.key, annotationKey.SQL_ID.getCode(), 'key in query annotation')
        t.equal(actualQueryAnnotation.value.intValue, actualParsingResult.sqlId, 'intValue in query annotation')
        t.equal(actualQueryAnnotation.value.stringValue1, '', 'stringValue1 in query annotation')
        t.equal(actualQueryAnnotation.value.stringValue2, 'a', 'stringValue2 in query annotation')
        t.equal(actualParsingResult.sql.normalizedSql, 'SELECT * FROM member WHERE id = ?', 'normalizedSql in query annotation')
    })
})

test(`Connection Pool with query hooking`, async (t) => {
    agent.bindHttp()
    const source = path.resolve(fixtures, 'mysql.sql')
    const container = await new MySqlContainer()
        .withCommand('--default-authentication-plugin=mysql_native_password')
        .withEnvironment({
            'MYSQL_DATABASE': 'test',
            'TX': 'Asia/Seoul',
        })
        .withCopyFilesToContainer([{
            source: source,
            target: '/docker-entrypoint-initdb.d/mysql.sql'
        }])
        .start()
    
    const trace = agent.createTraceObject()
    const pool = mysql.createPool({
        host: container.getHost(),
        port: container.getPort(),
        database: 'test',
        user: container.getUsername(),
        password: container.getUserPassword(),
    })
    const promisePool = pool.promise()
    
    const [rows] = await promisePool.query(`SELECT * FROM member WHERE id = ?`, 'a')
    t.equal(rows[0].id, 'a', 'id in SELECT query hooking')
    t.equal(rows[0].name, 'name1', 'name in SELECT query hooking')
    t.equal(rows[0].joined.toISOString().slice(0, 10), '2023-01-17', 'joined in SELECT query hooking')

    setImmediate(() => {
        trace.close()
        pool.end()
        container.stop()
        t.end()
    })

    agent.callbackTraceClose((trace) => {
        let actualBuilder = new MethodDescriptorBuilder2('createPool')
            .setLineNumber(238)
            .setFileName('mysql2.test.js')
        let actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
        let actualSpanEvent = trace.span.spanEventList[0]
        t.equal(actualSpanEvent.apiId, actualMethodDescriptor.apiId, 'apiId in createPool spanEvent')
        t.equal(actualSpanEvent.endPoint, 'localhost', 'endPoint in createPool spanEvent')
        t.equal(actualSpanEvent.destinationId, 'test', 'destinationId in createPool spanEvent')
        t.equal(actualSpanEvent.sequence, 0, 'sequence in createPool spanEvent')
        t.equal(actualSpanEvent.depth, 1, 'depth in createPool spanEvent')
        t.equal(actualSpanEvent.serviceType, mysqlServiceType.getCode(), 'serviceType in createPool spanEvent')

        actualBuilder = new MethodDescriptorBuilder2('getConnection')
            .setClassName('Pool')
            .setLineNumber(143)
            .setFileName('pool.js')
        actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
        actualSpanEvent = trace.span.spanEventList[1]
        t.equal(actualSpanEvent.apiId, actualMethodDescriptor.apiId, 'apiId in Pool.getConnection() spanEvent')
        t.equal(actualSpanEvent.endPoint, 'localhost', 'endPoint in Pool.getConnection() spanEvent')
        t.equal(actualSpanEvent.destinationId, 'test', 'destinationId in Pool.getConnection() spanEvent')
        t.equal(actualSpanEvent.sequence, 1, 'sequence in Pool.getConnection() spanEvent')
        t.equal(actualSpanEvent.depth, 1, 'depth in Pool.getConnection() spanEvent')
        t.equal(actualSpanEvent.serviceType, mysqlServiceType.getCode(), 'serviceType in Pool.getConnection() spanEvent')

        actualBuilder = new MethodDescriptorBuilder2('query')
            .setClassName('PoolConnection')
        actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
        actualSpanEvent = trace.span.spanEventList[2]
        t.equal(actualSpanEvent.apiId, actualMethodDescriptor.apiId, 'apiId in PoolConnection.query() spanEvent')
        t.equal(actualSpanEvent.sequence, 2, 'sequence in PoolConnection.query() spanEvent')
        t.equal(actualSpanEvent.depth, 1, 'depth in PoolConnection.query() spanEvent')
        t.equal(actualSpanEvent.serviceType, mysqlExecuteQueryServiceType.getCode(), 'serviceType in PoolConnection.query() spanEvent')
    })
})

test(`Cluster with query`, async (t) => {
    agent.bindHttp()
    const source = path.resolve(fixtures, 'mysql.sql')
    const container = await new MySqlContainer()
        .withCommand('--default-authentication-plugin=mysql_native_password')
        .withEnvironment({
            'MYSQL_DATABASE': 'test',
            'TX': 'Asia/Seoul',
        })
        .withCopyFilesToContainer([{
            source: source,
            target: '/docker-entrypoint-initdb.d/mysql.sql'
        }])
        .start()

    const trace = agent.createTraceObject()
    const poolCluster = mysqlp.createPoolCluster()
    poolCluster.add('MASTER', {
        host: container.getHost(),
        port: container.getPort(),
        database: 'test',
        user: container.getUsername(),
        password: container.getUserPassword(),
    })
    poolCluster.add('SLAVE1', {
        host: container.getHost(),
        port: container.getPort(),
        database: 'test',
        user: container.getUsername(),
        password: container.getUserPassword(),
    })
    poolCluster.add('SLAVE2', {
        host: container.getHost(),
        port: container.getPort(),
        database: 'test',
        user: container.getUsername(),
        password: container.getUserPassword(),
    })
    const connection = await poolCluster.getConnection()
    
    const [results] = await connection.query(`SELECT * FROM member WHERE id = ?`, 'a')
    t.equal(results[0].id, 'a', 'id in SELECT query hooking')
    t.equal(results[0].name, 'name1', 'name in SELECT query hooking')
    t.equal(results[0].joined.toISOString().slice(0, 10), '2023-01-17', 'joined in SELECT query hooking')

    agent.callbackTraceClose((trace) => {
        let actualBuilder = new MethodDescriptorBuilder2('createPoolCluster')
            .setLineNumber(545)
            .setFileName('promise.js')
        let actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
        let actualSpanEvent = trace.span.spanEventList[0]
        t.equal(actualSpanEvent.apiId, actualMethodDescriptor.apiId, 'apiId in createPoolCluster spanEvent')
        t.equal(actualSpanEvent.sequence, 0, 'sequence in createPoolCluster spanEvent')
        t.equal(actualSpanEvent.depth, 1, 'depth in createPoolCluster spanEvent')
        t.equal(actualSpanEvent.serviceType, mysqlServiceType.getCode(), 'serviceType in createPoolCluster spanEvent')

        actualBuilder = new MethodDescriptorBuilder2('of')
            .setLineNumber(169)
            .setFileName('pool_cluster.js')
        actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
        actualSpanEvent = trace.span.spanEventList[1]
        t.equal(actualSpanEvent.apiId, actualMethodDescriptor.apiId, 'apiId in PoolCluster.of() spanEvent')
        t.equal(actualSpanEvent.sequence, 1, 'sequence in PoolCluster.of() spanEvent')
        t.equal(actualSpanEvent.depth, 1, 'depth in PoolCluster.of() spanEvent')
        t.equal(actualSpanEvent.serviceType, mysqlServiceType.getCode(), 'serviceType in PoolCluster.of() spanEvent')

        actualBuilder = new MethodDescriptorBuilder2('getConnection')
            .setClassName('Pool')
            .setLineNumber(177)
            .setFileName('pool_cluster.js')
        actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
        actualSpanEvent = trace.span.spanEventList[2]
        t.equal(actualSpanEvent.apiId, actualMethodDescriptor.apiId, 'apiId in Pool.getConnection() spanEvent')
        t.equal(actualSpanEvent.sequence, 2, 'sequence in Pool.getConnection() spanEvent')
        t.equal(actualSpanEvent.depth, 1, 'depth in Pool.getConnection() spanEvent')
        t.equal(actualSpanEvent.serviceType, mysqlServiceType.getCode(), 'serviceType in Pool.getConnection() spanEvent')

        let actualSpanChunk = trace.storage.dataSender.mockSpanChunks[0]
        t.equal(actualSpanChunk.spanId, actualSpanEvent.spanId, 'spanId in spanChunk in PoolCluster.getConnection()')
        t.equal(actualSpanChunk.transactionIdObject, trace.traceId.transactionId, 'transactionIdObject in spanChunk in PoolCluster.getConnection()')
        t.equal(actualSpanChunk.localAsyncId.asyncId, actualSpanEvent.nextAsyncId, 'localAsyncId asyncId in spanChunk in PoolCluster.getConnection()')
        t.equal(actualSpanChunk.localAsyncId.sequence, 0, 'localAsyncId sequence in spanChunk in PoolCluster.getConnection()')
        t.equal(actualSpanChunk.spanEventList[0].apiId, defaultPredefinedMethodDescriptorRegistry.asyncInvocationMethodDescriptor.apiId, 'apiId in spanChunk in PoolCluster.getConnection()')
        t.equal(actualSpanChunk.spanEventList[0].sequence, 0, 'sequence in spanChunk in PoolCluster.getConnection()')
        t.equal(actualSpanChunk.spanEventList[0].depth, 1, 'depth in spanChunk in PoolCluster.getConnection()')
        t.equal(actualSpanChunk.spanEventList[0].serviceType, ServiceType.async.getCode(), 'serviceType in spanChunk in PoolCluster.getConnection()')
        t.equal(actualSpanChunk.spanEventList[1].apiId, actualSpanEvent.apiId, 'apiId in spanChunk in PoolCluster.getConnection()')
        t.equal(actualSpanChunk.spanEventList[1].sequence, 1, 'sequence in spanChunk in PoolCluster.getConnection()')
        t.equal(actualSpanChunk.spanEventList[1].depth, 2, 'depth in spanChunk in PoolCluster.getConnection()')
        t.equal(actualSpanChunk.spanEventList[1].serviceType, mysqlServiceType.getCode(), 'serviceType in spanChunk in PoolCluster.getConnection()')

        actualBuilder = new MethodDescriptorBuilder2('query')
            .setClassName('PoolConnection')
        actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
        actualSpanEvent = trace.span.spanEventList[3]
        t.equal(actualSpanEvent.apiId, actualMethodDescriptor.apiId, 'apiId in PoolConnection.query() spanEvent')
        t.equal(actualSpanEvent.sequence, 3, 'sequence in PoolConnection.query() spanEvent')
        t.equal(actualSpanEvent.depth, 1, 'depth in PoolConnection.query() spanEvent')
        t.equal(actualSpanEvent.serviceType, mysqlExecuteQueryServiceType.getCode(), 'serviceType in PoolConnection.query() spanEvent')

        actualSpanChunk = trace.storage.dataSender.mockSpanChunks[1]
        t.equal(actualSpanChunk.spanId, actualSpanEvent.spanId, 'spanId in spanChunk in PoolConnection.query()')
        t.equal(actualSpanChunk.transactionIdObject, trace.traceId.transactionId, 'transactionIdObject in spanChunk in PoolConnection.query()')
        t.equal(actualSpanChunk.localAsyncId.asyncId, actualSpanEvent.nextAsyncId, 'localAsyncId asyncId in spanChunk in PoolConnection.query()')
        t.equal(actualSpanChunk.localAsyncId.sequence, 0, 'localAsyncId sequence in spanChunk in PoolConnection.query()')
        t.equal(actualSpanChunk.spanEventList[0].apiId, defaultPredefinedMethodDescriptorRegistry.asyncInvocationMethodDescriptor.apiId, 'apiId in spanChunk in PoolConnection.query()')
        t.equal(actualSpanChunk.spanEventList[0].sequence, 0, 'sequence in spanChunk in PoolConnection.query()')
        t.equal(actualSpanChunk.spanEventList[0].depth, 1, 'depth in spanChunk in PoolConnection.query()')
        t.equal(actualSpanChunk.spanEventList[0].serviceType, ServiceType.async.getCode(), 'serviceType in spanChunk in PoolConnection.query()')
        t.equal(actualSpanChunk.spanEventList[1].apiId, actualSpanEvent.apiId, 'apiId in spanChunk in PoolConnection.query()')
        t.equal(actualSpanChunk.spanEventList[1].sequence, 1, 'sequence in spanChunk in PoolConnection.query()')
        t.equal(actualSpanChunk.spanEventList[1].depth, 2, 'depth in spanChunk in PoolConnection.query()')
        t.equal(actualSpanChunk.spanEventList[1].serviceType, mysqlExecuteQueryServiceType.getCode(), 'serviceType in spanChunk in PoolConnection.query()')
    })

    setImmediate(() => {
        trace.close()
        connection.release()
        container.stop()
        t.end()
    })
})