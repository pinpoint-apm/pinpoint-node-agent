/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const AgentInfo = require('../../../lib/data/dto/agent-info')
const grpc = require('@grpc/grpc-js')
const { ConfigBuilder } = require('../../../lib/config-builder')
const { fastRetryServiceConfig, TestGrpcDataSenderBuilder, AgentInfoAdaptor } = require('../../support/test-grpc-data-sender')
const InterceptingCall = grpc.InterceptingCall

const retryTestTimeout = { timeout: 10 * 1000 }

// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/client.ts
test('sendAgentInfo deadline and metadata', retryTestTimeout, async (t) => {
    const agentInfoAdaptor = new AgentInfoAdaptor()
    const grpcDataSender = await new TestGrpcDataSenderBuilder({ 'agentName': 'testAgentName' })
        .addAdaptor(agentInfoAdaptor)
        .build()
    t.teardown(() => {
        grpcDataSender.close()
    })

    await new Promise(resolve => grpcDataSender.sendAgentInfo(Object.assign(new AgentInfo(grpcDataSender.config, String(Date.now())), {
        hostname: 'hostname',
    }), (err, response) => {
        t.true(response, '1st sendAgentInfo response is success')
        t.false(err, '1st sendAgentInfo err is false')
        resolve()
    }))

    grpcDataSender.unaryDeadlineOptionsBuilder.setSeconds(0.1)
    agentInfoAdaptor.stopResponding()
    await new Promise(resolve => grpcDataSender.sendAgentInfo(Object.assign(new AgentInfo(grpcDataSender.config, String(Date.now())), {
        hostname: 'hostname',
        "serviceType": 1400,
    }), (err, response) => {
        t.false(response, '2st sendAgentInfo response is undefined')
        t.equal(err.code, 4, '2st sendAgentInfo err.code is 4')
        t.true(err.details.startsWith('Deadline exceeded'), '2st sendAgentInfo err.details is Deadline exceeded')
        t.true(err.message.startsWith('4 DEADLINE_EXCEEDED: Deadline exceeded'), '2st sendAgentInfo err.message is Deadline exceeded')
        resolve()
    }))

    agentInfoAdaptor.metadata.forEach((metadata) => {
        t.equal(metadata.get('agentid')[0], grpcDataSender.config.getAgentId(), 'metadata.get("agentid")[0] is the agentId of the config')
        t.equal(metadata.get('applicationname')[0], 'test.application.name', 'metadata.get("applicationname")[0] is test.application.name')
        t.equal(metadata.get('agentName')[0], 'testAgentName', 'metadata.get("agentName")[0] is testAgentName')
        t.equal(metadata.get('servicetype')[0], '1400', 'metadata.get("servicetype")[0] is 1400')
    })
    t.end()
})

function agentInfo() {
    const config = new ConfigBuilder({
        agentId: '12121212',
        applicationName: 'applicationName',
        serviceName: 'serviceName',
    }).setUserDefinedJson({}).build()
    return Object.assign(new AgentInfo(config, String(Date.now())), {
        ip: '1'
    })
}

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

test('AgentInfo sends the Node.js version as vmVersion', async (t) => {
    const agentInfoAdaptor = new AgentInfoAdaptor()
    const grpcDataSender = await new TestGrpcDataSenderBuilder()
        .addAdaptor(agentInfoAdaptor)
        .addInterceptor(fixtureMetadataInterceptor)
        .build()
    t.teardown(() => {
        grpcDataSender.close()
    })

    fixtureMetadata = []
    await new Promise(resolve => grpcDataSender.sendAgentInfo(agentInfo(), function (error, response) {
        t.true(response.getSuccess(), 'PResult.success is true')
        resolve()
    }))
    t.equal(agentInfoAdaptor.requests[0].getVmversion(), process.versions.node, 'PAgentInfo.vmVersion is process.versions.node')
    t.end()
})

test('AgentInfo with retries enabled but not configured', async (t) => {
    const dataSender = await new TestGrpcDataSenderBuilder()
        .addAdaptor(new AgentInfoAdaptor())
        .addInterceptor(fixtureMetadataInterceptor)
        .build()
    t.teardown(() => {
        dataSender.close()
    })

    fixtureMetadata = []
    const first = new Promise(resolve => dataSender.sendAgentInfo(agentInfo(), function (error, response) {
        t.true(response.getSuccess(), '1st PResult.success is true')
        resolve()
    }))

    fixtureMetadata = [{ 'succeed-on-retry-attempt': '1' }]
    dataSender.initializeClients()
    const second = new Promise(resolve => dataSender.sendAgentInfo(agentInfo(), function (error) {
        t.equal(error.details, 'Failed on retry 0', '2nd error.details is "Failed on retry 0"')
        resolve()
    }))

    fixtureMetadata = []
    dataSender.initializeClients()
    const third = new Promise(resolve => dataSender.sendAgentInfo(agentInfo(), function (error, response) {
        t.true(response.getSuccess(), '3st PResult.success is true')
        resolve()
    }))

    await Promise.all([first, second, third])
    t.end()
})

test('AgentInfo with retries enabled and configured', async (t) => {
    const dataSender = await new TestGrpcDataSenderBuilder({ collector: { grpcServiceConfig: fastRetryServiceConfig } })
        .addAdaptor(new AgentInfoAdaptor())
        .addInterceptor(fixtureMetadataInterceptor)
        .build()
    t.teardown(() => {
        dataSender.close()
    })

    fixtureMetadata = []
    const first = new Promise(resolve => dataSender.sendAgentInfo(agentInfo(), function (error, response) {
        t.true(response.getSuccess(), '1st PResult.success is true')
        t.equal(response.getMessage(), 'succeed-on-retry-attempt: undefined, grpc-previous-rpc-attempts: undefined', '1st PResult.message is "succeed-on-retry-attempt: undefined, grpc-previous-rpc-attempts: undefined"')
        resolve()
    }))

    fixtureMetadata = [{ 'succeed-on-retry-attempt': '2', 'respond-with-status': '14' }]
    dataSender.initializeClients()
    const second = new Promise(resolve => dataSender.sendAgentInfo(agentInfo(), function (error, response) {
        t.true(response.getSuccess(), '2nd PResult.success is true')
        t.equal(response.getMessage(), 'succeed-on-retry-attempt: 2, grpc-previous-rpc-attempts: 2', '2nd PResult.message is "succeed-on-retry-attempt: 2, grpc-previous-rpc-attempts: 2"')
        resolve()
    }))

    fixtureMetadata = []
    dataSender.initializeClients()
    const third = new Promise(resolve => dataSender.sendAgentInfo(agentInfo(), function (error, response) {
        t.true(response.getSuccess(), '3st PResult.success is true')
        t.equal(response.getMessage(), 'succeed-on-retry-attempt: undefined, grpc-previous-rpc-attempts: undefined', '3st PResult.message is "succeed-on-retry-attempt: undefined, grpc-previous-rpc-attempts: undefined"')
        resolve()
    }))

    await Promise.all([first, second, third])
    t.end()
})

// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/client.ts
test('sendAgentInfo schedule', async (t) => {
    const dataSender = await new TestGrpcDataSenderBuilder()
        .addAdaptor(new AgentInfoAdaptor().enableScheduler(100))
        .addInterceptor(fixtureMetadataInterceptor)
        .build()
    t.teardown(() => {
        dataSender.close()
    })

    fixtureMetadata = []
    let count = 0
    await new Promise(resolve => dataSender.sendAgentInfo(agentInfo(), function (error, response) {
        count++
        t.true(response.getSuccess(), `${count}st PResult.success is true`)
        t.equal(response.getMessage(), 'succeed-on-retry-attempt: undefined, grpc-previous-rpc-attempts: undefined', `${count}st PResult.message is "succeed-on-retry-attempt: undefined, grpc-previous-rpc-attempts: undefined"`)
        if (count === 3) {
            t.equal(dataSender.agentInfoDailyScheduler.jobList.length, 1, 'agentInfoDailyScheduler.jobList.length is 1 for memory leak prevention test')
            resolve()
        }
    }))
    t.end()
})
