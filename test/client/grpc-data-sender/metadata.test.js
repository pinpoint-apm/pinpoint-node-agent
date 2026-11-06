/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const agent = require('../../support/agent-singleton-mock')
const _ = require('lodash')

const services = require('../../../lib/data/v1/Service_grpc_pb')
const grpc = require('@grpc/grpc-js')
const spanMessages = require('../../../lib/data/v1/Span_pb')
const ApiMetaInfo = require('../../../lib/data/dto/api-meta-info')
const StringMetaInfo = require('../../../lib/data/dto/string-meta-info')
const MethodDescriptorBuilder = require('../../../lib/context/method-descriptor-builder')
const SqlMetaData = require('../../../lib/client/sql-meta-data')
const SqlUidMetaData = require('../../../lib/client/sql-uid-meta-data')
const { fastRetryServiceConfig, beforeSpecificOne, afterOne, getCallRequests, getMetadata, DataSourceCallCountable, retryTestService, buildGrpcDataSender } = require('../../support/grpc-data-sources')
const InterceptingCall = grpc.InterceptingCall
const { ConfigBuilder } = require('../../../lib/config-builder')
const AgentInfo = require('../../../lib/data/dto/agent-info')
const { SqlMetadataService } = require('../../../lib/instrumentation/sql/sql-metadata-service')
const { IntIdParsingResultFactory } = require('../../../lib/context/trace/parsing-result-factory')
const { UidParsingResultFactory } = require('../../../lib/metric/sql/uid-parsing-result-factory')
const { SqlStatsConfigBuilder } = require('../../../lib/metric/sql/sql-stats-config-builder')

const retryTestTimeout = { timeout: 10 * 1000 }

let fixtureMetadata = []
class MetaInfoOnlyDataSource extends DataSourceCallCountable {
    constructor(config, interceptors) {
        config = Object.assign({}, config, {
            sendApiMetaInfo: true,
            sendStringMetaInfo: true,
            sendSqlMetaInfo: true,
            sendSqlUidMetaData: true
        })
        super(config, interceptors)
    }
    initializeClients() { }
    initializeSpanBatchSender() { }
    initializeStatStream() { }
    initializePingStream() { }
    initializeProfilerClients() { }
    initializeAgentInfoScheduler() { }

    metadataClientOptionsBuilder() {
        return super.metadataClientOptionsBuilder()
            .addInterceptor(function (options, nextCall) {
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
            })
    }
}

test('sendApiMetaInfo lineNumber and location', (t) => {
    const server = new grpc.Server()
    server.addService(services.MetadataService, {
        requestApiMetaData: retryTestService
    })
    let dataSender
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
        dataSender = beforeSpecificOne(port, MetaInfoOnlyDataSource, fastRetryServiceConfig)
        const callRequests = getCallRequests()
        const callMetadata = getMetadata()

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
        dataSender.sendApiMetaInfo(apiMetaInfoActual, function (error, response) {
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
            afterOne(t)
        })

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
        dataSender.sendApiMetaInfo(apiMetaInfoActual, function (error, response) {
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
            afterOne(t)
        })

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
        dataSender.sendApiMetaInfo(apiMetaInfoActual, function (error, response) {
            t.equal(error.code, 14, `3rd error.code is 14`)
            t.equal(error.details, 'Failed on retry 2', `3rd error.details is "Failed on retry 2"`)
            t.equal(error.message, '14 UNAVAILABLE: Failed on retry 2', `3rd error.message is "14 UNAVAILABLE: Failed on retry 2"`)
            afterOne(t)
        })

        t.teardown(() => {
            dataSender.close()
            server.forceShutdown()
        })
    })
})

// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/client.ts
test('sendStringMetaInfo retry', retryTestTimeout, (t) => {
    const server = new grpc.Server()
    server.addService(services.MetadataService, {
        requestStringMetaData: retryTestService
    })
    let dataSender
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
        fixtureMetadata = []
        dataSender = beforeSpecificOne(port, MetaInfoOnlyDataSource, fastRetryServiceConfig)
        const callRequests = getCallRequests()

        const stringMetaInfo = new StringMetaInfo({
            stringId: '12121212',
            stringValue: 'agentInfo'
        })
        dataSender.sendStringMetaInfo(stringMetaInfo, function (error, response) {
            t.true(response.getSuccess(), '1st PResult.success is true')
            afterOne(t)
        })

        fixtureMetadata = [{ 'succeed-on-retry-attempt': '2', 'respond-with-status': '14' }]
        dataSender.initializeMetadataClients()
        dataSender.sendStringMetaInfo(new StringMetaInfo({ stringId: '2', stringValue: 'retried' }), function (error, response) {
            t.true(response.getSuccess(), '2nd PResult.success is true')
            t.equal(response.getMessage(), 'succeed-on-retry-attempt: 2, grpc-previous-rpc-attempts: 2', '2nd PResult.message is "succeed-on-retry-attempt: 2, grpc-previous-rpc-attempts: 2"')
            t.equal(callRequests.length, 2, '2nd callRequests.length is 2')
            t.equal(callRequests[1].getStringvalue(), 'retried', '2nd callRequests[1].stringValue is "retried"')
            afterOne(t)
        })

        t.teardown(() => {
            dataSender.close()
            server.forceShutdown()
        })
    })
})

test('sendSqlMetaData retry', retryTestTimeout, (t) => {
    const server = new grpc.Server()
    server.addService(services.MetadataService, {
        requestSqlMetaData: retryTestService
    })
    let dataSender
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
        fixtureMetadata = []
        dataSender = beforeSpecificOne(port, MetaInfoOnlyDataSource, fastRetryServiceConfig)
        const sqlMetadataService = new SqlMetadataService(dataSender, new IntIdParsingResultFactory())
        const callRequests = getCallRequests()

        const parsingResult = sqlMetadataService.cacheSql('SELECT DATABASE() as res')
        const actual = new SqlMetaData(parsingResult)
        dataSender.sendSqlMetaInfo(actual, function (error, response) {
            t.true(response.getSuccess(), '1st PResult.success is true')
            t.equal(callRequests[0].getSqlid(), parsingResult.getId(), '1st callRequests[0].getSqlid() is parsingResult.getId()')
            t.equal(callRequests[0].getSql(), parsingResult.getSql(), '1st callRequests[0].getSql() is parsingResult.getSql()')
            afterOne(t)
        })

        const parsingResult2 = sqlMetadataService.cacheSql('SELECT DATABASE() as res2')
        const actual2 = new SqlMetaData(parsingResult2)
        fixtureMetadata = [{ 'succeed-on-retry-attempt': '2', 'respond-with-status': '14' }]
        dataSender.initializeMetadataClients()
        dataSender.sendSqlMetaInfo(actual2, function (error, response) {
            t.true(response.getSuccess(), '2nd PResult.success is true')
            t.equal(callRequests[1].getSqlid(), parsingResult2.getId(), '2nd callRequests[1].getSqlid() is parsingResult.getId()')
            t.equal(callRequests[1].getSql(), parsingResult2.getSql(), '2nd callRequests[1].getSql() is parsingResult.getSql()')
            afterOne(t)
        })

        t.teardown(() => {
            dataSender.close()
            server.forceShutdown()
        })
    })
})

test('sendSqlUidMetaData retry', retryTestTimeout, (t) => {
    process.env['PINPOINT_PROFILER_SQL_STAT'] = 'true'
    const conf = new ConfigBuilder().build()
    const sqlStatsConfig = new SqlStatsConfigBuilder(conf).build()
    t.true(sqlStatsConfig.isSqlStatsEnabled(), 'profiler SQL Stat is true')

    const server = new grpc.Server()
    server.addService(services.MetadataService, {
        requestSqlUidMetaData: retryTestService
    })
    let dataSender
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
        fixtureMetadata = []
        dataSender = beforeSpecificOne(port, MetaInfoOnlyDataSource, fastRetryServiceConfig)
        const sqlMetadataService = new SqlMetadataService(dataSender, new UidParsingResultFactory())
        const callRequests = getCallRequests()
        const callMetadata = getMetadata()

        const parsingResult = sqlMetadataService.cacheSql('SELECT DATABASE() as res')
        const actual = new SqlUidMetaData(parsingResult)
        dataSender.sendSqlUidMetaData(actual, function (error, response) {
            t.true(response.getSuccess(), '1st PResult.success is true')
            t.deepEqual(callRequests[0].getSqluid(), parsingResult.getId(), '1st callRequests[0].getSqlid() is parsingResult.getId()')
            t.equal(callRequests[0].getSql(), parsingResult.getSql(), '1st callRequests[0].getSql() is parsingResult.getSql()')
            t.deepEqual(callMetadata[0].get('grpc.built-in.retry'), ['true'], '1st metadata.get("grpc.built-in.retry") is "true"')
            afterOne(t)
        })

        const parsingResult2 = sqlMetadataService.cacheSql('SELECT DATABASE() as res2')
        const actual2 = new SqlUidMetaData(parsingResult2)
        fixtureMetadata = [{ 'succeed-on-retry-attempt': '2', 'respond-with-status': '14' }]
        dataSender.initializeMetadataClients()
        dataSender.sendSqlUidMetaData(actual2, function (error, response) {
            t.true(response.getSuccess(), '2nd PResult.success is true')
            t.deepEqual(callRequests[1].getSqluid(), parsingResult2.getId(), '2nd callRequests[1].getSqlid() is parsingResult.getId()')
            t.equal(callRequests[1].getSql(), parsingResult2.getSql(), '2nd callRequests[1].getSql() is parsingResult.getSql()')
            t.deepEqual(callMetadata[1].get('grpc.built-in.retry'), ['true'], '2nd metadata.get("grpc.built-in.retry") is "true"')
            afterOne(t)
        })

        t.teardown(() => {
            dataSender.close()
            server.forceShutdown()
            delete process.env.PINPOINT_PROFILER_SQL_STAT
        })
    })
})

let apiMetaInfo = 0
// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/server.ts
function requestApiMetaData(call, callback) {
    apiMetaInfo++

    const result = new spanMessages.PResult()

    if (apiMetaInfo == 1) {
        callback(null, result)
    } else if (apiMetaInfo == 2) {
        _.delay(() => {
            callback(null, result)
        }, 100)
    }
}

// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/client.ts
test('sendApiMetaInfo deadline', retryTestTimeout, (t) => {
    const server = new grpc.Server()
    server.addService(services.MetadataService, {
        requestApiMetaData: requestApiMetaData
    })
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (err, port) => {
        const grpcDataSender = buildGrpcDataSender(port)

        grpcDataSender.sendApiMetaInfo(Object.assign(new AgentInfo(agent.getConfig(), agent.agentStartTime), {
            hostname: 'hostname',
            "serviceType": 1400,
        }), (err, response) => {
            t.true(response, '1st sendApiMetaInfo response is success')
            t.false(err, '1st sendApiMetaInfo err is false')

            apiMetaInfoFunctionalTest()
        })

        t.teardown(() => {
            grpcDataSender.close()
            server.forceShutdown()
        })

        function apiMetaInfoFunctionalTest() {
            grpcDataSender.unaryDeadlineOptionsBuilder.setSeconds(0.1)
            grpcDataSender.sendApiMetaInfo(Object.assign(new AgentInfo(agent.getConfig(), agent.agentStartTime), {
                hostname: 'hostname',
                "serviceType": 1400,
            }), (err, response) => {
                t.false(response, '2st sendApiMetaInfo response is undefined')
                t.equal(err.code, 4, '2st sendApiMetaInfo err.code is 4')
                t.true(err.details.startsWith('Deadline exceeded'), '2st sendApiMetaInfo err.details is Deadline exceeded')
                t.true(err.message.startsWith('4 DEADLINE_EXCEEDED: Deadline exceeded'), '2st sendApiMetaInfo err.message is Deadline exceeded')
                t.end()
            })
        }
    })
})

let stringMetaInfo = 0
// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/server.ts
function requestStringMetaData(call, callback) {
    stringMetaInfo++

    const result = new spanMessages.PResult()

    if (stringMetaInfo == 1) {
        callback(null, result)
    } else if (stringMetaInfo == 2) {
        _.delay(() => {
            callback(null, result)
        }, 100)
    }
}

// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/client.ts
test('sendStringMetaInfo deadline', retryTestTimeout, (t) => {
    const server = new grpc.Server()
    server.addService(services.MetadataService, {
        requestStringMetaData: requestStringMetaData
    })
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (err, port) => {
        const grpcDataSender = buildGrpcDataSender(port)
        grpcDataSender.sendStringMetaInfo(Object.assign(new AgentInfo(agent.getConfig(), agent.agentStartTime), {
            hostname: 'hostname',
            "serviceType": 1400,
        }), (err, response) => {
            t.true(response, '1st sendStringMetaInfo response is success')
            t.false(err, '1st sendStringMetaInfo err is false')

            stringMetaInfoFunctionalTest()
        })

        t.teardown(() => {
            grpcDataSender.close()
            server.forceShutdown()
        })

        function stringMetaInfoFunctionalTest() {
            grpcDataSender.unaryDeadlineOptionsBuilder.setSeconds(0.1)
            grpcDataSender.sendStringMetaInfo(Object.assign(new AgentInfo(agent.getConfig(), agent.agentStartTime), {
                hostname: 'hostname',
                "serviceType": 1400,
            }), (err, response) => {
                t.false(response, '2st sendStringMetaInfo response is undefined')
                t.equal(err.code, 4, '2st sendStringMetaInfo err.code is 4')
                t.true(err.details.startsWith('Deadline exceeded'), '2st sendStringMetaInfo err.details is Deadline exceeded')
                t.true(err.message.startsWith('4 DEADLINE_EXCEEDED: Deadline exceeded'), '2st sendStringMetaInfo err.message is Deadline exceeded')
                t.end()
            })
        }
    })
})
