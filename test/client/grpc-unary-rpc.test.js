/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')

const services = require('../../lib/data/grpc/Service_grpc_pb')

var _ = require('lodash')
const GrpcServer = require('./grpc-server')

const spanMessages = require('../../lib/data/grpc/Span_pb')
const dataSenderFactory = require('../../lib/client/data-sender-factory')
const AgentInfo = require('../../lib/data/dto/agent-info')

let agentInfo = 0
// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/server.ts
function requestAgentInfo(call, callback) {
    agentInfo++

    const result = new spanMessages.PResult()

    if (agentInfo == 1) {
        _.delay(() => {
            callback(null, result)
            tryShutdown()
        }, 100)
    } else if (agentInfo == 2) {
        _.delay(() => {
            callback(null, result)
        }, 100)
    }
}

// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/client.ts
// AgentInfoSender.java
// refresh daily
// DEFAULT_AGENT_INFO_REFRESH_INTERVAL_MS = 24 * 60 * 60 * 1000L;
// retry every 3 seconds
// DEFAULT_AGENT_INFO_SEND_INTERVAL_MS = 3 * 1000L;
// retry 3 times per attempt
// DEFAULT_MAX_TRY_COUNT_PER_ATTEMPT = 3;
let tryShutdown
test('sendAgentInfo refresh', (t) => {
    const server = new GrpcServer()
    server.addService(services.AgentService, {
        requestAgentInfo: requestAgentInfo
    })
    server.startup((port) => {
        const agentInfo1 = Object.assign(new AgentInfo({
            agentId: '12121212',
            applicationName: 'applicationName',
            agentStartTime: Date.now()
        }), {
            ip: '1'
        })

        this.dataSender = dataSenderFactory.create({
            collectorIp: 'localhost',
            collectorTcpPort: port,
            collectorStatPort: port,
            collectorSpanPort: port,
            enabledDataSending: true
        }, agentInfo1)

        this.dataSender.dataSender.getDeadline = () => {
            const deadline = new Date()
            deadline.setMilliseconds(deadline.getMilliseconds() + 100)
            return deadline
        }
        this.dataSender.send(agentInfo1)

        tryShutdown = () => {
            setTimeout(() => {
                server.tryShutdown(() => {
                    t.end()
                })
            }, 0)
        }
    })
})
