/**
 * Pinpoint Node.js Agent
 * Copyright 2023-present NAVER Corp.
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
                .setLineNumber(41)
                .setFileName('mysql.test.js')
            let actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            const createConnectionSpanEvent = trace.span.spanEventList[0]
            t.equal(createConnectionSpanEvent.endPoint, 'localhost', 'the createConnection SpanEvent endPoint')
            t.equal(createConnectionSpanEvent.destinationId, 'test', 'the createConnection SpanEvent destinationId')
            t.equal(actualMethodDescriptor.apiId, createConnectionSpanEvent.apiId, 'apiId')
    
            actualBuilder = new MethodDescriptorBuilder('connect')
                .setClassName('Connection')
                .setLineNumber(50)
                .setFileName('mysql.test.js')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            const connectionSpanEvent = trace.span.spanEventList[1]
            t.equal(connectionSpanEvent.depth, 1, 'connection spanEvent depth')
            t.equal(connectionSpanEvent.sequence, 1, 'connection spanEvent sequence')
            t.equal(actualMethodDescriptor.apiId, connectionSpanEvent.apiId, 'apiId')
            
            actualBuilder = new MethodDescriptorBuilder('query')
            .setClassName('Connection')
            .setLineNumber(56)
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
                .setLineNumber(117)
                .setFileName('mysql.test.js')
            let actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            const createConnectionSpanEvent = trace.span.spanEventList[0]
            t.equal(createConnectionSpanEvent.endPoint, 'localhost', 'the createConnection SpanEvent endPoint')
            t.equal(createConnectionSpanEvent.destinationId, 'test', 'the createConnection SpanEvent destinationId')
            t.equal(actualMethodDescriptor.apiId, createConnectionSpanEvent.apiId, 'apiId')
        
            actualBuilder = new MethodDescriptorBuilder('connect')
                .setClassName('Connection')
                .setLineNumber(126)
                .setFileName('mysql.test.js')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            const connectionSpanEvent = trace.span.spanEventList[1]
            t.equal(connectionSpanEvent.depth, 1, 'connection spanEvent depth')
            t.equal(connectionSpanEvent.sequence, 1, 'connection spanEvent sequence')
            t.equal(actualMethodDescriptor.apiId, connectionSpanEvent.apiId, 'apiId')
        
            actualBuilder = new MethodDescriptorBuilder('query')
                .setClassName('Connection')
                .setLineNumber(133)
                .setFileName('mysql.test.js')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            let querySpanEvent = trace.span.spanEventList[2]
            t.equal(querySpanEvent.endPoint, 'localhost', 'the createConnection SpanEvent endPoint')
            t.equal(querySpanEvent.destinationId, 'test', 'the createConnection SpanEvent destinationId')
            t.equal(actualMethodDescriptor.apiId, querySpanEvent.apiId, 'apiId')
        
            let actualParsingResult = sqlMetadataService.cacheSql('SELECT DATABASE() as res')
            let actualQueryAnnotation = querySpanEvent.annotations[0]
            t.equal(actualQueryAnnotation.key, annotationKey.SQL_ID.getCode(), 'the query annotation key')
            t.equal(actualQueryAnnotation.value.intValue, actualParsingResult.sqlId, 'the query annotation value')
            t.equal(actualParsingResult.sql.normalizedSql, 'SELECT DATABASE() as res', 'the query annotation squl normalizedSql')
        
            actualBuilder = new MethodDescriptorBuilder('query')
                .setClassName('Connection')
                .setLineNumber(137)
                .setFileName('mysql.test.js')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            querySpanEvent = trace.span.spanEventList[3]
            t.equal(querySpanEvent.endPoint, 'localhost', 'the createConnection SpanEvent endPoint')
            t.equal(querySpanEvent.destinationId, 'test', 'the createConnection SpanEvent destinationId')
            t.equal(actualMethodDescriptor.apiId, querySpanEvent.apiId, 'apiId')
        
            actualParsingResult = sqlMetadataService.cacheSql('SHOW TABLES')
            actualQueryAnnotation = querySpanEvent.annotations[0]
            t.equal(actualQueryAnnotation.key, annotationKey.SQL_ID.getCode(), 'the query annotation key')
            t.equal(actualQueryAnnotation.value.intValue, actualParsingResult.sqlId, 'the query annotation value')
            t.equal(actualParsingResult.sql.normalizedSql, 'SHOW TABLES', 'the query annotation squl normalizedSql')
        
            actualBuilder = new MethodDescriptorBuilder('query')
                .setClassName('Connection')
                .setLineNumber(141)
                .setFileName('mysql.test.js')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            querySpanEvent = trace.span.spanEventList[4]
            t.equal(querySpanEvent.endPoint, 'localhost', 'the createConnection SpanEvent endPoint')
            t.equal(querySpanEvent.destinationId, 'test', 'the createConnection SpanEvent destinationId')
            t.equal(actualMethodDescriptor.apiId, querySpanEvent.apiId, 'apiId')
        
            actualParsingResult = sqlMetadataService.cacheSql('SELECT * FROM `member` WHERE id = ?')
            actualQueryAnnotation = querySpanEvent.annotations[0]
            t.equal(actualQueryAnnotation.key, annotationKey.SQL_ID.getCode(), 'the query annotation key')
            t.equal(actualQueryAnnotation.value.intValue, actualParsingResult.sqlId, 'the query annotation value')
            t.equal(actualQueryAnnotation.value.stringValue1, '', 'the query annotation value stringValue1 is sql normalizedSql parsedParameters')
            t.equal(actualQueryAnnotation.value.stringValue2, 'a', 'the query annotation value stringValue2 is bind value')
            t.equal(actualParsingResult.sql.normalizedSql, 'SELECT * FROM `member` WHERE id = ?', 'the query annotation sql normalizedSql')
        
            actualBuilder = new MethodDescriptorBuilder('query')
                .setClassName('Connection')
                .setLineNumber(144)
                .setFileName('mysql.test.js')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            querySpanEvent = trace.span.spanEventList[5]
            t.equal(querySpanEvent.endPoint, 'localhost', 'the createConnection SpanEvent endPoint')
            t.equal(querySpanEvent.destinationId, 'test', 'the createConnection SpanEvent destinationId')
            t.equal(actualMethodDescriptor.apiId, querySpanEvent.apiId, 'apiId')
        
            actualParsingResult = sqlMetadataService.cacheSql('INSERT INTO `member` (id, name, joined) VALUES (?, ?, ?)')
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
                setImmediate(async () => {
                    trace.close()
                    pool.end()
                    await container.stop()
                })
            }
        })
        
        pool.query('SELECT * FROM `member` where id = ?', 'b', async function (error, results) {
            if (error) throw error
            t.equal(results[0].id, 'b', 'SELECT member id')
            t.equal(results[0].name, 'name2', 'SELECT member name')
            t.equal(results[0].joined.getDate(), new Date('2022-07-27T00:00:00+09:00').getDate(), 'SELECT member joined')
            queryIndex++
            if (queryIndex == 2) {
                setImmediate(async () => {
                    trace.close()
                    pool.end()
                    await container.stop()
                })
            }
        })
    
        agent.callbackTraceClose((trace) => {
            let actualBuilder = new MethodDescriptorBuilder('createPool')
                    .setLineNumber(272)
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
                .setLineNumber(283)
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
            t.equal(actualSpanChunk.localAsyncId.sequence, 0, 'spanChunk localAsyncId.sequence is spanEvent 0')
            t.equal(actualSpanChunk.spanEventList[0].apiId, defaultPredefinedMethodDescriptorRegistry.asyncInvocationDescriptor.apiId, 'spanChunk spanEventList[0].apiId must be asyncInvocationDescriptor.apiId')
            t.equal(actualSpanChunk.spanEventList[0].depth, 1, 'spanChunk spanEventList[0].depth is 1')
            t.equal(actualSpanChunk.spanEventList[0].sequence, 0, 'spanChunk spanEventList[0].sequence is 0')
            t.equal(actualSpanChunk.spanEventList[0].serviceType, ServiceType.async.getCode(), 'spanChunk spanEventList[0].serviceType is ServiceTypeCode.async')
            t.equal(actualSpanChunk.spanEventList[2].apiId, actualSpanEvent.apiId, 'spanChunk spanEventList[1].apiId must be actualSpanEvent.apiId')
            t.equal(actualSpanChunk.spanEventList[2].depth, 2, 'spanChunk spanEventList[1].depth is 2')
            t.equal(actualSpanChunk.spanEventList[2].sequence, 1, 'spanChunk spanEventList[1].sequence is 1')
            t.equal(actualSpanChunk.spanEventList[2].serviceType, mysqlServiceType.getCode(), 'spanChunk spanEventList[1].serviceType is null')

            actualBuilder = new MethodDescriptorBuilder('query')
            .setClassName('PoolConnection')
            .setLineNumber(285)
            .setFileName('mysql.test.js')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            actualSpanEvent = actualSpanChunk.spanEventList[1]
            t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'PoolConnection.query spanEvent apiId on pool.query')
            t.equal(actualSpanEvent.depth, 3, 'PoolConnection.query spanEvent depth on pool.query')
            t.equal(actualSpanEvent.sequence, 2, 'PoolConnection.query spanEvent sequence on pool.query')
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
            t.equal(actualSpanChunk.localAsyncId.sequence, 0, 'spanChunk localAsyncId.sequence is spanEvent 0 on pool.query')
            t.equal(actualSpanChunk.spanEventList[0].apiId, defaultPredefinedMethodDescriptorRegistry.asyncInvocationDescriptor.apiId, 'spanChunk spanEventList[0].apiId must be asyncInvocationDescriptor.apiId on pool.query')
            t.equal(actualSpanChunk.spanEventList[0].depth, 1, 'spanChunk spanEventList[0].depth is 1 on pool.query')
            t.equal(actualSpanChunk.spanEventList[0].sequence, 0, 'spanChunk spanEventList[0].sequence is 0 on pool.query')
            t.equal(actualSpanChunk.spanEventList[0].serviceType, ServiceType.async.getCode(), 'spanChunk spanEventList[0].serviceType is ServiceTypeCode.async on pool.query')
            t.equal(actualSpanChunk.spanEventList[2].apiId, actualSpanEvent.apiId, 'spanChunk spanEventList[1].apiId must be actualSpanEvent.apiId on pool.query')
            t.equal(actualSpanChunk.spanEventList[2].depth, 2, 'spanChunk spanEventList[1].depth is 2 on pool.query')
            t.equal(actualSpanChunk.spanEventList[2].sequence, 1, 'spanChunk spanEventList[1].sequence is 1 on pool.query')
            t.equal(actualSpanChunk.spanEventList[2].serviceType, mysqlServiceType.getCode(), 'spanChunk spanEventList[1].serviceType is null on pool.query')
    
            actualBuilder = new MethodDescriptorBuilder('query')
                .setClassName('PoolConnection')
                .setLineNumber(214)
                .setFileName('Pool.js')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            actualSpanEvent = actualSpanChunk.spanEventList[1]
            t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'PoolConnection.query spanEvent apiId on pool.query')
            t.equal(actualSpanEvent.depth, 3, 'PoolConnection.query spanEvent depth on pool.query')
            t.equal(actualSpanEvent.sequence, 2, 'PoolConnection.query spanEvent sequence on pool.query')
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
                    .setLineNumber(423)
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
            t.equal(actualSpanChunk.localAsyncId.sequence, 0, 'spanChunk localAsyncId.sequence is spanEvent 0 in poolCluster.getConnection')
            t.equal(actualSpanChunk.spanEventList[0].apiId, defaultPredefinedMethodDescriptorRegistry.asyncInvocationDescriptor.apiId, 'spanChunk spanEventList[0].apiId must be asyncInvocationDescriptor.apiId in poolCluster.getConnection')
            t.equal(actualSpanChunk.spanEventList[0].depth, 1, 'spanChunk spanEventList[0].depth is 1 in poolCluster.getConnection')
            t.equal(actualSpanChunk.spanEventList[0].sequence, 0, 'spanChunk spanEventList[0].sequence is 0 in poolCluster.getConnection')
            t.equal(actualSpanChunk.spanEventList[0].serviceType, ServiceType.async.getCode(), 'spanChunk spanEventList[0].serviceType is ServiceTypeCode.async in poolCluster.getConnection')
            t.equal(actualSpanChunk.spanEventList[2].apiId, actualSpanEvent.apiId, 'spanChunk spanEventList[1].apiId must be actualSpanEvent.apiId in poolCluster.getConnection')
            t.equal(actualSpanChunk.spanEventList[2].depth, 2, 'spanChunk spanEventList[1].depth is 2 in poolCluster.getConnection')
            t.equal(actualSpanChunk.spanEventList[2].sequence, 1, 'spanChunk spanEventList[1].sequence is 1 in poolCluster.getConnection')
            t.equal(actualSpanChunk.spanEventList[2].serviceType, mysqlServiceType.getCode(), 'spanChunk spanEventList[1].serviceType is null in poolCluster.getConnection')
    
            actualBuilder = new MethodDescriptorBuilder('query')
                .setClassName('PoolConnection')
                .setLineNumber(454)
                .setFileName('mysql.test.js')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            actualSpanEvent = actualSpanChunk.spanEventList[1]
            t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'PoolConnection.query spanEvent apiId in poolCluster.getConnection')
            t.equal(actualSpanEvent.depth, 3, 'PoolConnection.query spanEvent depth in poolCluster.getConnection')
            t.equal(actualSpanEvent.sequence, 2, 'PoolConnection.query spanEvent sequence in poolCluster.getConnection')
            t.equal(actualSpanEvent.serviceType, mysqlExecuteQueryServiceType.getCode(), 'PoolConnection.query spanEvent serviceType in poolCluster.getConnection')
    
            asyncSpanChunkMySQLMatcher(t, trace, actualSpanEvent)  
            t.end()
        })
    })
})