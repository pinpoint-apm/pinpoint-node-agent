/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const services = require('../../lib/data/grpc/Service_grpc_pb')
const { Empty } = require('google-protobuf/google/protobuf/empty_pb')
const { log } = require('../test-helper')
const GrpcDataSender = require('../../lib/client/grpc-data-sender')
const GrpcServer = require('./grpc-server')
const Span = require('../../lib/context/span')

let endAction

const expectedSpan = {
    "traceId": {
        "transactionId": {
            "agentId": "express-node-sample-id",
            "agentStartTime": 1592572771026,
            "sequence": 5
        },
        "spanId": 2894367178713953,
        "parentSpanId": -1,
        "flag": 0
    },
    "agentId": "express-node-sample-id",
    "applicationName": "express-node-sample-name",
    "agentStartTime": 1592572771026,
    "serviceType": 1400,
    "spanId": '2894367178713953',
    "parentSpanId": -1,
    "transactionId": {
        "type": "Buffer",
        "data": [0, 44, 101, 120, 112, 114, 101, 115, 115, 45, 110, 111, 100, 101, 45, 115, 97, 109, 112, 108, 101, 45, 105, 100, 210, 245, 239, 229, 172, 46, 5]
    },
    "startTime": 1592574173350,
    "elapsedTime": 28644,
    "rpc": "/",
    "endPoint": "localhost:3000",
    "remoteAddr": "::1",
    "annotations": [],
    "flag": 0,
    "err": 1,
    "spanEventList": null,
    "apiId": 1,
    "exceptionInfo": null,
    "applicationServiceType": 1400,
    "loggingTransactionInfo": null,
    "version": 1
}

const span = Object.assign(new Span({
    spanId: 2894367178713953,
    parentSpanId: -1,
    transactionId: {
        "agentId": "express-node-sample-id",
        "agentStartTime": 1592574173350,
        "sequence": 0
    }
}, {
    agentId: "express-node-sample-id",
    applicationName: "express-node-sample-name",
    agentStartTime: 1592574173350
}), expectedSpan)

// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/server.ts
function sendAgentStat(call, callback) {
    call.on('data', function (statMessage) {
        
    })
    call.on('error', function (error) {
        log.debug(`error: ${error}`)
    })
    call.on('end', function () {
        callback(null, new Empty())
    })
}

function sendSpan(call, callback) {
    actualsCancellation.serverDataCount = 0
    call.on('data', function (spanMessage) {
        actualsCancellation.serverDataCount++
    })
    call.on('error', function (error) {
        log.debug(`error: ${error}`)
    })
    call.on('end', function () {
        callback(null, new Empty())
    })
}
function pingSession(call) {
    actualsCancellation.pingCount = 0
    call.on('data', function () {
        actualsCancellation.serverDataCount++
    })
    call.on('end', () => {
        call.end()
    })
}


let actualsCancellation
// https://github.com/grpc/grpc-node/issues/1542
// https://github.com/grpc/grpc-node/pull/1616/files
// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/client.ts
// stream.isReady() newRunnable(DefaultStreamTask.java)
test('client side streaming with deadline and cancellation', function (t) {
    t.plan(0)
    actualsCancellation = {}

    const server = new GrpcServer()
    server.addService(services.AgentService, {
        pingSession: pingSession
    })
    server.addService(services.StatService, {
        sendAgentStat: sendAgentStat
    })
    server.addService(services.SpanService, {
        sendSpan: sendSpan
    })

    server.startup((port) => {
        actualsCancellation.dataCount = 1
        actualsCancellation.t = t
        actualsCancellation.sendSpanCount = 0
        actualsCancellation.sendStatCount = 0

        this.grpcDataSender = new GrpcDataSender('localhost', port, port, port, {
            'agentid': '12121212',
            'applicationname': 'applicationName',
            'starttime': Date.now()
        })

        // when server send stream
        let callOrder = 0

        const originCallback = this.grpcDataSender.spanStream.callback
        this.grpcDataSender.spanStream.callback = (err, response) => {
            callOrder++
            originCallback(err, response)
            endAction()
        }

        
        endAction = () => {
            setTimeout(() => {
                server.tryShutdown(() => {
                    t.end()
                })
            }, 0)
        }

        this.grpcDataSender.sendSpan(span)
        this.grpcDataSender.sendSpan(span)
        this.grpcDataSender.spanStream.end()
        this.grpcDataSender.pingStream.end()
        this.grpcDataSender.statStream.end()
    })
})