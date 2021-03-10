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
const require('../../lib/data/dto/agent-info')

let agentInfo = 0
// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/server.ts
function requestAgentInfo(call, callback) {
    agentInfo++

    const result = new spanMessages.PResult()

    if (agentInfo == 1) {
        callback(null, result)
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
        this.grpcDataSender = new GrpcDataSender('localhost', port, port, port, {
            'agentid': '12121212',
            'applicationname': 'applicationName',
            'starttime': Date.now()
        })

        this.dataSender = dataSenderFactory.create({
            collectorIp: 'localhost',
            collectorTcpPort: port,
            collectorStatPort: port,
            collectorSpanPort: port,
            enabledDataSending: true
        }, {
            'agentid': '12121212',
            'applicationname': 'applicationName',
            'starttime': Date.now()
        })



        this.grpcDataSender.sendAgentInfo({
            hostname: 'hostname',
            "serviceType": 1400,
        }, (err, response) => {
            t.true(response, '1st sendAgentInfo response is success')
            t.false(err, '1st sendAgentInfo err is false')
        })

        this.grpcDataSender.sendAgentInfo({
            hostname: 'hostname',
            "serviceType": 1400,
        }, (err, response) => {
            // t.false(response, '2st sendAgentInfo response is undefined')
            // t.equal(err.code, 4, '2st sendAgentInfo err.code is 4')
            // t.equal(err.details, 'Deadline exceeded', '2st sendAgentInfo err.details is Deadline exceeded')
            // t.equal(err.message, '4 DEADLINE_EXCEEDED: Deadline exceeded', '2st sendAgentInfo err.message is Deadline exceeded')

            tryShutdown()
        })

        tryShutdown = () => {
            setTimeout(() => {
                server.tryShutdown(() => {
                    t.end()
                })
            }, 0)
        }
    })
})
