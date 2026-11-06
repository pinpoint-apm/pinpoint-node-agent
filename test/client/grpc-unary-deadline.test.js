/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const agent = require('../support/agent-singleton-mock')
const AgentInfo = require('../../lib/data/dto/agent-info')
const { ClientHeader, makeClientHeaderInterceptor } = require('../../lib/name/client-header')
const grpc = require('@grpc/grpc-js')
const services = require('../../lib/data/v1/Service_grpc_pb')
var _ = require('lodash')
const GrpcDataSender = require('../../lib/client/grpc-data-sender')
const { ConfigBuilder } = require('../../lib/config-builder')
const spanMessages = require('../../lib/data/v1/Span_pb')

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

function buildGrpcDataSender(port) {
    const collector = Object.assign({}, agent.getConfig().collector, { ip: 'localhost', spanPort: port, statPort: port, tcpPort: port })
    const config = new ConfigBuilder(Object.assign({}, agent.getConfig(), { collector })).build()
    return new GrpcDataSender(config, [makeClientHeaderInterceptor(ClientHeader.make(agent.agentStartTime, agent.getConfig()))])
}
