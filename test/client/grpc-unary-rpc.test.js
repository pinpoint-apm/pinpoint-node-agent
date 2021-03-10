/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')

const services = require('../../lib/data/grpc/Service_grpc_pb')

var _ = require('lodash')
const GrpcServer = require('./grpc-server')
const GrpcDataSender = require('../../lib/client/grpc-data-sender')

const spanMessages = require('../../lib/data/grpc/Span_pb')
const dataSenderFactory = require('../../lib/client/data-sender-factory')
const AgentInfo = require('../../lib/data/dto/agent-info')

let agentInfo = 0
// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/server.ts
function requestAgentInfo(call, callback) {
    agentInfo++

    const result = new spanMessages.PResult()

    if (agentInfo == 1) {
        callback(null, result)
        tryShutdown()
    } else if (agentInfo == 2) {
        _.delay(() => {
            callback(null, result)
        }, 100)
    }
}

let tryShutdown
// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/client.ts
test('sendAgentInfo deadline', (t) => {
    const server = new GrpcServer()
    server.addService(services.AgentService, {
        requestAgentInfo: requestAgentInfo
    })
    server.startup((port) => {
        const agentInfo = new AgentInfo({
            agentId: '12121212',
            applicationName: 'applicationName',
            agentStartTime: Date.now()
        })

        this.dataSender = dataSenderFactory.create({
            collectorIp: 'localhost',
            collectorTcpPort: port,
            collectorStatPort: port,
            collectorSpanPort: port,
            enabledDataSending: true
        }, agentInfo)
        this.dataSender.send(agentInfo)

        tryShutdown = () => {
            setTimeout(() => {
                server.tryShutdown(() => {
                    t.end()
                })
            }, 0)
        }
    })
})
