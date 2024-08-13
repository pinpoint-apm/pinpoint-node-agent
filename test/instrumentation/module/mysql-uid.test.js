/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const agent = require('../../support/agent-singleton-mock')
const { MySqlContainer } = require('@testcontainers/mysql')
const path = require('path')
const localStorage = require('../../../lib/instrumentation/context/local-storage')
const fixtures = path.resolve(__dirname, '..', '..', 'fixtures', 'db')
const mysql = require('mysql')
const MethodDescriptorBuilder = require('../../../lib/context/method-descriptor-builder')
const apiMetaService = require('../../../lib/context/api-meta-service')
const sqlMetadataService = require('../../../lib/instrumentation/sql/sql-metadata-service')
const annotationKey = require('../../../lib/constant/annotation-key')

test('mysql uid query', async (t) => {
    agent.bindHttp({
        'profiler-sql-stat': true
    })
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
                console.error('error connecting: ' + err)
                return
            }
        })
        connection.query(`SELECT * FROM member`, async function (error, results) {
            if (error) throw error
            t.equal(results[0].id, 'a', 'SELECT * FROM member results[0].id is a in mysql uid functional test')
            t.equal(results[0].name, 'name1', 'SELECT * FROM member results[0].name is b in mysql uid functional test')

            trace.close()
            connection.end()
            await container.stop()

            let actualBuilder = new MethodDescriptorBuilder('createConnection')
            let actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            const createConnectionSpanEvent = trace.span.spanEventList[0]
            t.equal(createConnectionSpanEvent.endPoint, 'localhost', 'createConnection endPoint is localhost in mysql uid functional test')
            t.equal(createConnectionSpanEvent.destinationId, 'test', 'createConnection destinationId is test in mysql uid functional test')
            t.equal(createConnectionSpanEvent.apiId, actualMethodDescriptor.apiId, 'createConnection apiId is same in mysql uid functional test')

            actualBuilder = new MethodDescriptorBuilder('connect')
                .setClassName('Connection')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            const connectionSpanEvent = trace.span.spanEventList[1]
            t.equal(connectionSpanEvent.depth, 1, 'connection depth is 1 in mysql uid functional test')
            t.equal(connectionSpanEvent.sequence, 1, 'connection sequence is 1 in mysql uid functional test')

            actualBuilder = new MethodDescriptorBuilder('query')
                .setClassName('Connection')
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
            const querySpanEvent = trace.span.spanEventList[2]
            t.equal(querySpanEvent.depth, 1, 'query depth is 1 in mysql uid functional test')
            t.equal(querySpanEvent.sequence, 2, 'query sequence is 2 in mysql uid functional test')
            t.equal(querySpanEvent.apiId, actualMethodDescriptor.apiId, 'query apiId is same in mysql uid functional test')

            let actualParsingResult = sqlMetadataService.cacheSql('SELECT * FROM member')
            let actualQueryAnnotation = querySpanEvent.annotations[0]
            t.equal(actualQueryAnnotation.key, annotationKey.SQL_UID.getCode(), 'query annotation key is sql in mysql uid functional test')
            t.equal(actualParsingResult.result.sql.normalizedSql, 'SELECT * FROM member', 'query normalizedSql is SELECT * FROM member in mysql uid functional test')

            let actualGrpcSpanEvent = trace.storage.dataSender.mockSpan.spanEventList[2]
            t.equal(actualQueryAnnotation.key, actualGrpcSpanEvent.annotations[0].key, 'query annotation key is same that grpc in mysql uid functional test')
            t.equal(actualQueryAnnotation.value, actualGrpcSpanEvent.annotations[0].value, 'query annotation value is same that grpc in mysql uid functional test')

            t.end()
        })
    })
})