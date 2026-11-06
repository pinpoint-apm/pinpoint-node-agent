/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const agent = require('../../support/agent-singleton-mock')
const AgentInfo = require('../../../lib/data/dto/agent-info')
const grpc = require('@grpc/grpc-js')
const services = require('../../../lib/data/v1/Service_grpc_pb')
var _ = require('lodash')
const { ConfigBuilder } = require('../../../lib/config-builder')
const spanMessages = require('../../../lib/data/v1/Span_pb')
const { fastRetryServiceConfig, beforeSpecificOne, afterOne, getCallRequests, DataSourceCallCountable, retryTestService, buildGrpcDataSender } = require('../../support/grpc-data-sources')
const InterceptingCall = grpc.InterceptingCall

const retryTestTimeout = { timeout: 10 * 1000 }

// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/client.ts
test('sendAgentInfo deadline and metadata', retryTestTimeout, (t) => {
    agent.bindHttp({ 'agentName': 'testAgentName' })
    const server = new grpc.Server()
    let agentInfo = 0
    server.addService(services.AgentService, {
        // https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/server.ts
        requestAgentInfo: (call, callback) => {
            agentInfo++

            t.equal(call.metadata.get('agentid')[0], agent.getConfig().getAgentId(), 'call.metadata.get("agentid")[0] is the generated v4 agentId')
            t.equal(call.metadata.get('applicationname')[0], 'test.application.name', 'call.metadata.get("applicationname")[0] is test.application.name')
            t.equal(call.metadata.get('agentName')[0], 'testAgentName', 'call.metadata.get("agentName")[0] is testAgentName')
            t.equal(call.metadata.get('servicetype')[0], '1400', 'call.metadata.get("servicetype")[0] is 1400')

            const result = new spanMessages.PResult()
            if (agentInfo == 1) {
                callback(null, result)
            } else if (agentInfo == 2) {
                _.delay(() => {
                    callback(null, result)
                }, 100)
            }
        }
    })
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (err, port) => {
        const grpcDataSender = buildGrpcDataSender(port)

        const agentInfo = Object.assign(new AgentInfo(agent.getConfig(), agent.agentStartTime), {
            hostname: 'hostname',
        })
        grpcDataSender.sendAgentInfo(agentInfo, (err, response) => {
            t.true(response, '1st sendAgentInfo response is success')
            t.false(err, '1st sendAgentInfo err is false')
            deadlineFunctionalTest()
        })


        t.teardown(() => {
            grpcDataSender.close()
            server.forceShutdown()
        })

        function deadlineFunctionalTest() {
            const callback = (err, response) => {
                t.false(response, '2st sendAgentInfo response is undefined')
                t.equal(err.code, 4, '2st sendAgentInfo err.code is 4')
                t.true(err.details.startsWith('Deadline exceeded'), '2st sendAgentInfo err.details is Deadline exceeded')
                t.true(err.message.startsWith('4 DEADLINE_EXCEEDED: Deadline exceeded'), '2st sendAgentInfo err.message is Deadline exceeded')

                t.end()
            }
            grpcDataSender.unaryDeadlineOptionsBuilder.setSeconds(0.1)

            grpcDataSender.sendAgentInfo(Object.assign(new AgentInfo(agent.getConfig(), agent.agentStartTime), {
                hostname: 'hostname',
                "serviceType": 1400,
            }), callback)
        }
    })
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

let agentInfoRefreshInterval
let fixtureMetadata = []
let enableAgentInfoScheduler = false
class AgentInfoOnlyDataSource extends DataSourceCallCountable {
    constructor(config, interceptors) {
        config = Object.assign({}, config, {
            sendAgentInfo: true,
            agentInfoScheduler: enableAgentInfoScheduler
        })
        super(config, interceptors)
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

test('AgentInfo sends the Node.js version as vmVersion', (t) => {
    const server = new grpc.Server()
    server.addService(services.AgentService, {
        requestAgentInfo: retryTestService
    })
    let dataSender
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
        dataSender = beforeSpecificOne(port, AgentInfoOnlyDataSource)

        fixtureMetadata = []
        dataSender.sendAgentInfo(agentInfo(), function (error, response) {
            t.true(response.getSuccess(), 'PResult.success is true')
            t.equal(getCallRequests()[0].getVmversion(), process.versions.node, 'PAgentInfo.vmVersion is process.versions.node')
            t.end()
        })
    })

    t.teardown(() => {
        dataSender.close()
        server.forceShutdown()
    })
})

test('AgentInfo with retries enabled but not configured', (t) => {
    const server = new grpc.Server()
    // https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/server.ts
    server.addService(services.AgentService, {
        requestAgentInfo: retryTestService
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
        requestAgentInfo: retryTestService
    })

    let dataSender
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
        dataSender = beforeSpecificOne(port, AgentInfoOnlyDataSource, fastRetryServiceConfig)

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
        requestAgentInfo: retryTestService
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
