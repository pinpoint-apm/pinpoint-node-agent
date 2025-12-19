/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')

const services = require('../../lib/data/v1/Service_grpc_pb')
const MethodType = require('../../lib/constant/method-type')
const grpc = require('@grpc/grpc-js')
const spanMessages = require('../../lib/data/v1/Span_pb')
const AgentInfo = require('../../lib/data/dto/agent-info')
const ApiMetaInfo = require('../../lib/data/dto/api-meta-info')
const StringMetaInfo = require('../../lib/data/dto/string-meta-info')
const MethodDescriptorBuilder = require('../../lib/context/method-descriptor-builder')
const SqlMetaData = require('../../lib/client/sql-meta-data')
const SqlUidMetaData = require('../../lib/client/sql-uid-meta-data')
const { beforeSpecificOne, afterOne, getCallRequests, getMetadata, DataSourceCallCountable } = require('./grpc-fixture')
const InterceptingCall = grpc.InterceptingCall
const { ConfigBuilder } = require('../../lib/config-builder')
const { SqlMetadataService } = require('../../lib/instrumentation/sql/sql-metadata-service')

// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/client.ts
const service = (call, callback) => {
    const succeedOnRetryAttempt = call.metadata.get('succeed-on-retry-attempt')
    const previousAttempts = call.metadata.get('grpc-previous-rpc-attempts')
    const callRequests = getCallRequests()
    const callMetadata = getMetadata()
    // console.debug(`succeed-on-retry-attempt: ${succeedOnRetryAttempt[0]}, grpc-previous-rpc-attempts: ${previousAttempts[0]}`)
    if (succeedOnRetryAttempt.length === 0 || (previousAttempts.length > 0 && previousAttempts[0] === succeedOnRetryAttempt[0])) {
        const result = new spanMessages.PResult()
        result.setSuccess(true)
        result.setMessage(`succeed-on-retry-attempt: ${succeedOnRetryAttempt[0]}, grpc-previous-rpc-attempts: ${previousAttempts[0]}`)
        callRequests.push(call.request)
        callMetadata.push(call.metadata)
        callback(null, result)
    } else {
        const statusCode = call.metadata.get('respond-with-status')
        const code = statusCode[0] ? Number.parseInt(statusCode[0]) : grpc.status.UNKNOWN
        callback({ code: code, details: `Failed on retry ${previousAttempts[0] ?? 0}` })
    }
}

function agentInfo() {
    return Object.assign(new AgentInfo({
        agentId: '12121212',
        applicationName: 'applicationName',
        agentStartTime: Date.now()
    }), {
        ip: '1'
    })
}

let agentInfoRefreshInterval
let fixtureMetadata = []
let enableAgentInfoScheduler = false
class AgentInfoOnlyDataSource extends DataSourceCallCountable {
    constructor(collectorIp, collectorTcpPort, collectorStatPort, collectorSpanPort, agentInfo, config) {
        config = Object.assign({}, config, {
            sendAgentInfo: true,
            agentInfoScheduler: enableAgentInfoScheduler
        })
        super(collectorIp, collectorTcpPort, collectorStatPort, collectorSpanPort, agentInfo, config)
    }
    agentInfoRefreshInterval() {
        return agentInfoRefreshInterval ? agentInfoRefreshInterval : super.agentInfoRefreshInterval()
    }

    agentClientOptionsBuilder() {
        return super.agentClientOptionsBuilder()
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

test('AgentInfo with retries enabled but not configured', (t) => {
    const server = new grpc.Server()
    // https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/server.ts
    server.addService(services.AgentService, {
        requestAgentInfo: service
    })
    let dataSender
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
        dataSender = beforeSpecificOne(port, AgentInfoOnlyDataSource)

        fixtureMetadata = []
        dataSender.sendAgentInfo(agentInfo(), function (error, response) {
            t.true(response.getSuccess(), '1st PResult.success is true')
        })

        fixtureMetadata = [{ 'succeed-on-retry-attempt': '1' }]
        dataSender.initializeClients()
        dataSender.sendAgentInfo(agentInfo(), function (error) {
            t.equal(error.details, 'Failed on retry 0', '2nd error.details is "Failed on retry 0"')
        })

        fixtureMetadata = []
        dataSender.initializeClients()
        dataSender.sendAgentInfo(agentInfo(), function (error, response) {
            t.true(response.getSuccess(), '3st PResult.success is true')
            t.end()
        })
    })

    t.teardown(() => {
        dataSender.close()
        server.forceShutdown()
    })
})

test('AgentInfo with retries enabled and configured', (t) => {
    const server = new grpc.Server()
    // https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/server.ts
    server.addService(services.AgentService, {
        requestAgentInfo: service
    })

    let dataSender
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
        dataSender = beforeSpecificOne(port, AgentInfoOnlyDataSource)

        fixtureMetadata = []
        dataSender.sendAgentInfo(agentInfo(), function (error, response) {
            t.true(response.getSuccess(), '1st PResult.success is true')
            t.equal(response.getMessage(), 'succeed-on-retry-attempt: undefined, grpc-previous-rpc-attempts: undefined', '1st PResult.message is "succeed-on-retry-attempt: undefined, grpc-previous-rpc-attempts: undefined"')
            afterOne(t)
        })

        fixtureMetadata = [{ 'succeed-on-retry-attempt': '2', 'respond-with-status': '14' }]
        dataSender.initializeClients()
        dataSender.sendAgentInfo(agentInfo(), function (error, response) {
            t.true(response.getSuccess(), '2nd PResult.success is true')
            t.equal(response.getMessage(), 'succeed-on-retry-attempt: 2, grpc-previous-rpc-attempts: 2', '2nd PResult.message is "succeed-on-retry-attempt: 2, grpc-previous-rpc-attempts: 2"')
            afterOne(t)
        })

        fixtureMetadata = []
        dataSender.initializeClients()
        dataSender.sendAgentInfo(agentInfo(), function (error, response) {
            t.true(response.getSuccess(), '3st PResult.success is true')
            t.equal(response.getMessage(), 'succeed-on-retry-attempt: undefined, grpc-previous-rpc-attempts: undefined', '3st PResult.message is "succeed-on-retry-attempt: undefined, grpc-previous-rpc-attempts: undefined"')
            afterOne(t)
        })
    })

    t.teardown(() => {
        dataSender.close()
        server.forceShutdown()
    })
})

// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/client.ts
test('sendAgentInfo schedule', (t) => {
    const server = new grpc.Server()
    server.addService(services.AgentService, {
        requestAgentInfo: service
    })
    let dataSender
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
        fixtureMetadata = []
        agentInfoRefreshInterval = 100
        enableAgentInfoScheduler = true
        dataSender = beforeSpecificOne(port, AgentInfoOnlyDataSource)
        let count = 0
        dataSender.sendAgentInfo(agentInfo(), function (error, response) {
            count++
            t.true(response.getSuccess(), `${count}st PResult.success is true`)
            t.equal(response.getMessage(), 'succeed-on-retry-attempt: undefined, grpc-previous-rpc-attempts: undefined', `${count}st PResult.message is "succeed-on-retry-attempt: undefined, grpc-previous-rpc-attempts: undefined"`)
            if (count === 3) {
                t.equal(dataSender.agentInfoDailyScheduler.jobList.length, 1, 'agentInfoDailyScheduler.jobList.length is 1 for memory leak prevention test')
                t.end()
            }
        })
    })

    t.teardown(() => {
        dataSender.close()
        server.forceShutdown()
        agentInfoRefreshInterval = null
    })
})

class MetaInfoOnlyDataSource extends DataSourceCallCountable {
    constructor(collectorIp, collectorTcpPort, collectorStatPort, collectorSpanPort, agentInfo, config) {
        config = Object.assign({}, config, {
            sendApiMetaInfo: true,
            sendStringMetaInfo: true,
            sendSqlMetaInfo: true,
            sendSqlUidMetaData: true
        })
        super(collectorIp, collectorTcpPort, collectorStatPort, collectorSpanPort, agentInfo, config)
    }
    initializeClients() { }
    initializeSpanStream() { }
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
// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/client.ts
test('sendApiMetaInfo retry', (t) => {
    const server = new grpc.Server()
    server.addService(services.MetadataService, {
        requestApiMetaData: service
    })
    let dataSender
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
        fixtureMetadata = []
        dataSender = beforeSpecificOne(port, MetaInfoOnlyDataSource)
        const callRequests = getCallRequests()
        const callMetadata = getMetadata()

        let actual = new ApiMetaInfo(1, 'ApiDescriptor', MethodType.DEFAULT)
        dataSender.sendApiMetaInfo(actual, function (error, response) {
            t.true(response.getSuccess(), '1st PResult.success is true')

            const metadata = callMetadata[0]
            t.deepEqual(metadata.get('grpc.built-in.retry'), ['true'], '1st metadata.get("grpc.built-in.retry") is "true"')
            afterOne(t)
        })

        actual = new ApiMetaInfo(2, 'ApiDescriptor2', MethodType.DEFAULT)
        fixtureMetadata = [{ 'succeed-on-retry-attempt': '2', 'respond-with-status': '14' }]
        dataSender.initializeMetadataClients()
        dataSender.sendApiMetaInfo(actual, function (error, response) {
            t.true(response.getSuccess(), '2nd PResult.success is true')
            t.equal(response.getMessage(), 'succeed-on-retry-attempt: 2, grpc-previous-rpc-attempts: 2', '2nd PResult.message is "succeed-on-retry-attempt: 2, grpc-previous-rpc-attempts: 2"')

            t.equal(callRequests.length, 2, '2nd callRequests.length is 2')
            t.equal(callRequests[1].getApiid(), 2, '2nd callRequests[1].apiId is 2')
            t.equal(callRequests[1].getApiinfo(), 'ApiDescriptor2', '2nd callRequests[1].apiInfo is "ApiDescriptor2"')
            t.equal(callRequests[1].getType(), MethodType.DEFAULT, '2nd callRequests[1].type is MethodType.DEFAULT')

            const metadata = callMetadata[1]
            t.deepEqual(metadata.get('grpc.built-in.retry'), ['true'], '2nd metadata.get("grpc.built-in.retry") is "true"')
            afterOne(t)
        })

        t.teardown(() => {
            dataSender.close()
            server.forceShutdown()
        })
    })
})

test('sendApiMetaInfo lineNumber and location', (t) => {
    const server = new grpc.Server()
    server.addService(services.MetadataService, {
        requestApiMetaData: service
    })
    let dataSender
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
        dataSender = beforeSpecificOne(port, MetaInfoOnlyDataSource)
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
test('sendStringMetaInfo retry', (t) => {
    const server = new grpc.Server()
    server.addService(services.MetadataService, {
        requestStringMetaData: service
    })
    let dataSender
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
        fixtureMetadata = []
        dataSender = beforeSpecificOne(port, MetaInfoOnlyDataSource)

        const stringMetaInfo = new StringMetaInfo({
            stringId: '12121212',
            stringValue: 'agentInfo'
        })
        dataSender.sendStringMetaInfo(stringMetaInfo, function (error, response) {
            t.true(response.getSuccess(), '1st PResult.success is true')
            afterOne(t)
        })

        t.teardown(() => {
            dataSender.close()
            server.forceShutdown()
        })
    })
})

test('sendSqlMetaData retry', (t) => {
    const server = new grpc.Server()
    server.addService(services.MetadataService, {
        requestSqlMetaData: service
    })
    let dataSender
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
        fixtureMetadata = []
        dataSender = beforeSpecificOne(port, MetaInfoOnlyDataSource)
        const sqlMetadataService = new SqlMetadataService(dataSender, dataSender.config)
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

test('sendSqlUidMetaData retry', (t) => {
    process.env['PINPOINT_PROFILER_SQL_STAT'] = 'true'
    const conf = new ConfigBuilder().build()
    t.true(conf.hasSqlStats(), 'profiler SQL Stat is false')

    const server = new grpc.Server()
    server.addService(services.MetadataService, {
        requestSqlUidMetaData: service
    })
    let dataSender
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
        fixtureMetadata = []
        dataSender = beforeSpecificOne(port, MetaInfoOnlyDataSource)
        const sqlMetadataService = new SqlMetadataService(dataSender, dataSender.config)
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