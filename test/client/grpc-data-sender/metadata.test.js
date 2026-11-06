/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')

const grpc = require('@grpc/grpc-js')
const ApiMetaInfo = require('../../../lib/data/dto/api-meta-info')
const StringMetaInfo = require('../../../lib/data/dto/string-meta-info')
const MethodDescriptorBuilder = require('../../../lib/context/method-descriptor-builder')
const SqlMetaData = require('../../../lib/client/sql-meta-data')
const SqlUidMetaData = require('../../../lib/client/sql-uid-meta-data')
const { fastRetryServiceConfig, TestGrpcDataSenderBuilder, MetadataAdaptor } = require('../../support/test-grpc-data-sender')
const InterceptingCall = grpc.InterceptingCall
const { ConfigBuilder } = require('../../../lib/config-builder')
const AgentInfo = require('../../../lib/data/dto/agent-info')
const { SqlMetadataService } = require('../../../lib/instrumentation/sql/sql-metadata-service')
const { IntIdParsingResultFactory } = require('../../../lib/context/trace/parsing-result-factory')
const { UidParsingResultFactory } = require('../../../lib/metric/sql/uid-parsing-result-factory')
const { SqlStatsConfigBuilder } = require('../../../lib/metric/sql/sql-stats-config-builder')

const retryTestTimeout = { timeout: 10 * 1000 }

let fixtureMetadata = []
function fixtureMetadataInterceptor(options, nextCall) {
    return new InterceptingCall(nextCall(options), {
        start: function (metadata, listener, next) {
            fixtureMetadata.forEach((each) => {
                Object.entries(each).forEach(([key, value]) => {
                    metadata.add(key, value)
                })
            })
            next(metadata, listener, next)
        }
    })
}

function buildRetryTestGrpcDataSender(metadataAdaptor) {
    return new TestGrpcDataSenderBuilder({ collector: { grpcServiceConfig: fastRetryServiceConfig } })
        .addAdaptor(metadataAdaptor)
        .addInterceptor(fixtureMetadataInterceptor)
        .build()
}

test('sendApiMetaInfo lineNumber and location', async (t) => {
    const metadataAdaptor = new MetadataAdaptor()
    const dataSender = await buildRetryTestGrpcDataSender(metadataAdaptor)
    t.teardown(() => {
        dataSender.close()
    })
    const callRequests = metadataAdaptor.requests
    const callMetadata = metadataAdaptor.metadata

    let apiMetaInfoActual = ApiMetaInfo.create(new MethodDescriptorBuilder()
        .setApiId(1)
        .setClassName('Router')
        .setMethodName('get')
        .setType(1400)
        .setLineNumber(481)
        .setLocation('node_modules/express/lib/application.js')
        .build()
    )
    fixtureMetadata = []
    const first = new Promise(resolve => dataSender.sendApiMetaInfo(apiMetaInfoActual, function (error, response) {
        t.true(response.getSuccess(), '1st PResult.success is true')

        const data = callRequests[0]
        t.equal(data.getApiid(), 1, 'apiId')
        t.equal(data.getApiinfo(), 'Router.get', 'Apiinfo')
        t.equal(data.getType(), 1400, 'type')
        t.equal(data.getLine(), 481, 'line')
        t.equal(data.getLocation(), 'node_modules/express/lib/application.js', 'location')

        const metadata = callMetadata[0]
        t.deepEqual(metadata.get('grpc.built-in.retry'), ['true'], '1st metadata.get("grpc.built-in.retry") is "true"')
        t.equal(metadata.get('servicetype')[0], '1400', '1st metadata.get("servicetype") is 1400')
        resolve()
    }))

    apiMetaInfoActual = ApiMetaInfo.create(new MethodDescriptorBuilder()
        .setApiId(2)
        .setClassName('Router')
        .setMethodName('post')
        .setType(1400)
        .setLineNumber(482)
        .setLocation('node_modules/express/lib/application.js')
        .build()
    )
    fixtureMetadata = [{ 'succeed-on-retry-attempt': '2', 'respond-with-status': '14' }]
    dataSender.initializeMetadataClients()
    const second = new Promise(resolve => dataSender.sendApiMetaInfo(apiMetaInfoActual, function (error, response) {
        t.true(response.getSuccess(), '2nd PResult.success is true')
        t.equal(response.getMessage(), 'succeed-on-retry-attempt: 2, grpc-previous-rpc-attempts: 2', '2nd PResult.message is "succeed-on-retry-attempt: 2, grpc-previous-rpc-attempts: 2"')

        t.equal(callRequests.length, 2, '2nd callRequests.length is 2')
        const data = callRequests[1]
        t.equal(data.getApiid(), 2, 'apiId')
        t.equal(data.getApiinfo(), 'Router.post', 'Apiinfo')
        t.equal(data.getType(), 1400, 'type')
        t.equal(data.getLine(), 482, 'line')
        t.equal(data.getLocation(), 'node_modules/express/lib/application.js', 'location')

        const metadata = callMetadata[1]
        t.deepEqual(metadata.get('grpc.built-in.retry'), ['true'], '2nd metadata.get("grpc.built-in.retry") is "true"')
        resolve()
    }))

    apiMetaInfoActual = ApiMetaInfo.create(new MethodDescriptorBuilder()
        .setApiId(3)
        .setClassName('Router')
        .setMethodName('put')
        .setType(1400)
        .setLineNumber(483)
        .setLocation('node_modules/express/lib/application.js')
        .build()
    )
    fixtureMetadata = [{ 'succeed-on-retry-attempt': '3', 'respond-with-status': '14' }]
    dataSender.initializeMetadataClients()
    const third = new Promise(resolve => dataSender.sendApiMetaInfo(apiMetaInfoActual, function (error, response) {
        t.equal(error.code, 14, `3rd error.code is 14`)
        t.equal(error.details, 'Failed on retry 2', `3rd error.details is "Failed on retry 2"`)
        t.equal(error.message, '14 UNAVAILABLE: Failed on retry 2', `3rd error.message is "14 UNAVAILABLE: Failed on retry 2"`)
        resolve()
    }))

    await Promise.all([first, second, third])
    t.end()
})

// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/client.ts
test('sendStringMetaInfo retry', retryTestTimeout, async (t) => {
    const metadataAdaptor = new MetadataAdaptor()
    const dataSender = await buildRetryTestGrpcDataSender(metadataAdaptor)
    t.teardown(() => {
        dataSender.close()
    })
    const callRequests = metadataAdaptor.requests

    fixtureMetadata = []
    const stringMetaInfo = new StringMetaInfo({
        stringId: '12121212',
        stringValue: 'agentInfo'
    })
    const first = new Promise(resolve => dataSender.sendStringMetaInfo(stringMetaInfo, function (error, response) {
        t.true(response.getSuccess(), '1st PResult.success is true')
        resolve()
    }))

    fixtureMetadata = [{ 'succeed-on-retry-attempt': '2', 'respond-with-status': '14' }]
    dataSender.initializeMetadataClients()
    const second = new Promise(resolve => dataSender.sendStringMetaInfo(new StringMetaInfo({ stringId: '2', stringValue: 'retried' }), function (error, response) {
        t.true(response.getSuccess(), '2nd PResult.success is true')
        t.equal(response.getMessage(), 'succeed-on-retry-attempt: 2, grpc-previous-rpc-attempts: 2', '2nd PResult.message is "succeed-on-retry-attempt: 2, grpc-previous-rpc-attempts: 2"')
        t.equal(callRequests.length, 2, '2nd callRequests.length is 2')
        t.equal(callRequests[1].getStringvalue(), 'retried', '2nd callRequests[1].stringValue is "retried"')
        resolve()
    }))

    await Promise.all([first, second])
    t.end()
})

test('sendSqlMetaData retry', retryTestTimeout, async (t) => {
    const metadataAdaptor = new MetadataAdaptor()
    const dataSender = await buildRetryTestGrpcDataSender(metadataAdaptor)
    t.teardown(() => {
        dataSender.close()
    })
    const callRequests = metadataAdaptor.requests

    fixtureMetadata = []
    const sqlMetadataService = new SqlMetadataService(dataSender, new IntIdParsingResultFactory())

    const parsingResult = sqlMetadataService.cacheSql('SELECT DATABASE() as res')
    const actual = new SqlMetaData(parsingResult)
    const first = new Promise(resolve => dataSender.sendSqlMetaInfo(actual, function (error, response) {
        t.true(response.getSuccess(), '1st PResult.success is true')
        t.equal(callRequests[0].getSqlid(), parsingResult.getId(), '1st callRequests[0].getSqlid() is parsingResult.getId()')
        t.equal(callRequests[0].getSql(), parsingResult.getSql(), '1st callRequests[0].getSql() is parsingResult.getSql()')
        resolve()
    }))

    const parsingResult2 = sqlMetadataService.cacheSql('SELECT DATABASE() as res2')
    const actual2 = new SqlMetaData(parsingResult2)
    fixtureMetadata = [{ 'succeed-on-retry-attempt': '2', 'respond-with-status': '14' }]
    dataSender.initializeMetadataClients()
    const second = new Promise(resolve => dataSender.sendSqlMetaInfo(actual2, function (error, response) {
        t.true(response.getSuccess(), '2nd PResult.success is true')
        t.equal(callRequests[1].getSqlid(), parsingResult2.getId(), '2nd callRequests[1].getSqlid() is parsingResult.getId()')
        t.equal(callRequests[1].getSql(), parsingResult2.getSql(), '2nd callRequests[1].getSql() is parsingResult.getSql()')
        resolve()
    }))

    await Promise.all([first, second])
    t.end()
})

test('sendSqlUidMetaData retry', retryTestTimeout, async (t) => {
    process.env['PINPOINT_PROFILER_SQL_STAT'] = 'true'
    const conf = new ConfigBuilder().build()
    const sqlStatsConfig = new SqlStatsConfigBuilder(conf).build()
    t.true(sqlStatsConfig.isSqlStatsEnabled(), 'profiler SQL Stat is true')

    const metadataAdaptor = new MetadataAdaptor()
    const dataSender = await buildRetryTestGrpcDataSender(metadataAdaptor)
    t.teardown(() => {
        dataSender.close()
        delete process.env.PINPOINT_PROFILER_SQL_STAT
    })
    const callRequests = metadataAdaptor.requests
    const callMetadata = metadataAdaptor.metadata

    fixtureMetadata = []
    const sqlMetadataService = new SqlMetadataService(dataSender, new UidParsingResultFactory())

    const parsingResult = sqlMetadataService.cacheSql('SELECT DATABASE() as res')
    const actual = new SqlUidMetaData(parsingResult)
    const first = new Promise(resolve => dataSender.sendSqlUidMetaData(actual, function (error, response) {
        t.true(response.getSuccess(), '1st PResult.success is true')
        t.deepEqual(callRequests[0].getSqluid(), parsingResult.getId(), '1st callRequests[0].getSqlid() is parsingResult.getId()')
        t.equal(callRequests[0].getSql(), parsingResult.getSql(), '1st callRequests[0].getSql() is parsingResult.getSql()')
        t.deepEqual(callMetadata[0].get('grpc.built-in.retry'), ['true'], '1st metadata.get("grpc.built-in.retry") is "true"')
        resolve()
    }))

    const parsingResult2 = sqlMetadataService.cacheSql('SELECT DATABASE() as res2')
    const actual2 = new SqlUidMetaData(parsingResult2)
    fixtureMetadata = [{ 'succeed-on-retry-attempt': '2', 'respond-with-status': '14' }]
    dataSender.initializeMetadataClients()
    const second = new Promise(resolve => dataSender.sendSqlUidMetaData(actual2, function (error, response) {
        t.true(response.getSuccess(), '2nd PResult.success is true')
        t.deepEqual(callRequests[1].getSqluid(), parsingResult2.getId(), '2nd callRequests[1].getSqlid() is parsingResult.getId()')
        t.equal(callRequests[1].getSql(), parsingResult2.getSql(), '2nd callRequests[1].getSql() is parsingResult.getSql()')
        t.deepEqual(callMetadata[1].get('grpc.built-in.retry'), ['true'], '2nd metadata.get("grpc.built-in.retry") is "true"')
        resolve()
    }))

    await Promise.all([first, second])
    t.end()
})

// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/client.ts
test('sendApiMetaInfo deadline', retryTestTimeout, async (t) => {
    const metadataAdaptor = new MetadataAdaptor()
    const grpcDataSender = await new TestGrpcDataSenderBuilder()
        .addAdaptor(metadataAdaptor)
        .build()
    t.teardown(() => {
        grpcDataSender.close()
    })

    await new Promise(resolve => grpcDataSender.sendApiMetaInfo(Object.assign(new AgentInfo(grpcDataSender.config, String(Date.now())), {
        hostname: 'hostname',
        "serviceType": 1400,
    }), (err, response) => {
        t.true(response, '1st sendApiMetaInfo response is success')
        t.false(err, '1st sendApiMetaInfo err is false')
        resolve()
    }))

    grpcDataSender.unaryDeadlineOptionsBuilder.setSeconds(0.1)
    metadataAdaptor.stopResponding()
    await new Promise(resolve => grpcDataSender.sendApiMetaInfo(Object.assign(new AgentInfo(grpcDataSender.config, String(Date.now())), {
        hostname: 'hostname',
        "serviceType": 1400,
    }), (err, response) => {
        t.false(response, '2st sendApiMetaInfo response is undefined')
        t.equal(err.code, 4, '2st sendApiMetaInfo err.code is 4')
        t.true(err.details.startsWith('Deadline exceeded'), '2st sendApiMetaInfo err.details is Deadline exceeded')
        t.true(err.message.startsWith('4 DEADLINE_EXCEEDED: Deadline exceeded'), '2st sendApiMetaInfo err.message is Deadline exceeded')
        resolve()
    }))
    t.end()
})

// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/client.ts
test('sendStringMetaInfo deadline', retryTestTimeout, async (t) => {
    const metadataAdaptor = new MetadataAdaptor()
    const grpcDataSender = await new TestGrpcDataSenderBuilder()
        .addAdaptor(metadataAdaptor)
        .build()
    t.teardown(() => {
        grpcDataSender.close()
    })

    await new Promise(resolve => grpcDataSender.sendStringMetaInfo(Object.assign(new AgentInfo(grpcDataSender.config, String(Date.now())), {
        hostname: 'hostname',
        "serviceType": 1400,
    }), (err, response) => {
        t.true(response, '1st sendStringMetaInfo response is success')
        t.false(err, '1st sendStringMetaInfo err is false')
        resolve()
    }))

    grpcDataSender.unaryDeadlineOptionsBuilder.setSeconds(0.1)
    metadataAdaptor.stopResponding()
    await new Promise(resolve => grpcDataSender.sendStringMetaInfo(Object.assign(new AgentInfo(grpcDataSender.config, String(Date.now())), {
        hostname: 'hostname',
        "serviceType": 1400,
    }), (err, response) => {
        t.false(response, '2st sendStringMetaInfo response is undefined')
        t.equal(err.code, 4, '2st sendStringMetaInfo err.code is 4')
        t.true(err.details.startsWith('Deadline exceeded'), '2st sendStringMetaInfo err.details is Deadline exceeded')
        t.true(err.message.startsWith('4 DEADLINE_EXCEEDED: Deadline exceeded'), '2st sendStringMetaInfo err.message is Deadline exceeded')
        resolve()
    }))
    t.end()
})
