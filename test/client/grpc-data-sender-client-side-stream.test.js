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
let actuals

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
    call.on('data', function (spanMessage) {
        actuals.serverSpanDataCount++

        const span = spanMessage.getSpan()
        if (actuals.serverSpanDataCount == 1) {
            actuals.t.equal(actuals.serverSpanDataCount, 1, '1st sendSpan serverSpanDataCount is 1')
            actuals.t.equal(span.getSpanid(), '2894367178713953', 'span ID match in 1st sendSpan')
        } else if (actuals.serverSpanDataCount == 2) {
            actuals.t.equal(actuals.serverSpanDataCount, 2, '2st sendSpan serverSpanDataCount is 2')
            actuals.t.equal(span.getServicetype(), 1400, 'service type match in 2st sendSpan')
        }
    })
    call.on('error', function (error) {
        log.debug(`error: ${error}`)
    })
    call.on('end', function () {
        callback(null, new Empty())
    })
}

function pingSession(call) {
    call.on('data', function () {
        actuals.serverPingCount++
    })
    call.on('end', () => {
        call.end()
    })
}

// https://github.com/grpc/grpc-node/issues/1542
// https://github.com/grpc/grpc-node/pull/1616/files
// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/client.ts
// stream.isReady() newRunnable(DefaultStreamTask.java)
test('client side streaming with deadline and cancellation', function (t) {
    t.plan(14)
    actuals = {}

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
        actuals.dataCount = 1
        actuals.t = t
        actuals.sendSpanCount = 0
        actuals.sendStatCount = 0
        actuals.serverSpanDataCount = 0
        actuals.serverPingCount = 0

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

            if (callOrder == 1/* 3st spanStream end in callback */) {
                t.equal(callOrder, 1, '3st spanStream end in callback')
                t.equal(actuals.sendSpanCount, actuals.serverSpanDataCount, `span data count on server ${actuals.sendSpanCount}`)
            } else if (callOrder == 3/* 5st spanStream end in callback */) {
                t.equal(callOrder, 3, '5st spanStream end in callback')
                t.equal(actuals.serverSpanDataCount, 3, `span data count on server ${actuals.sendSpanCount} on 5st spanStream end in callback`)
            }
            originCallback.call(this.grpcDataSender.spanStream, err, response)
        }

        const registeEventListeners = () => {
            const originStatus = this.grpcDataSender.spanStream.stream.listeners('status')[0]
            this.grpcDataSender.spanStream.stream.removeListener('status', originStatus)
            this.grpcDataSender.spanStream.stream.on('status', (status) => {
                callOrder++
                if (callOrder == 2/* 3st spanStream end on stream status event */) {
                    t.true(callOrder == 2, '3st spanStream end call Order on stream status event')
                    t.equal(status.code, 0, 'OK on 3st stream status event')
                    t.equal(status.details, 'OK', 'OK on 3st stream status event')
                } else if (callOrder == 4/* 5st spanStream end on stream status event */) {
                    t.true(callOrder == 4, '5st spanStream end call Order on stream status event')
                    t.equal(status.code, 0, 'OK on 5st stream status event')
                    t.equal(status.details, 'OK', 'OK on 5st stream status event')
                    endAction()
                }
                originStatus.call(this.grpcDataSender.spanStream, status)
            })
        }

        registeEventListeners()

        endAction = () => {
            setTimeout(() => {
                server.tryShutdown(() => {
                    t.end()
                })
            }, 0)
        }

        // 1st sendSpan
        actuals.sendSpanCount++
        this.grpcDataSender.sendSpan(span)
        // 2st sendSpan
        actuals.sendSpanCount++
        this.grpcDataSender.sendSpan(span)
        // 3st spanStream end
        this.grpcDataSender.spanStream.end()

        // 4st sendSpan
        actuals.sendSpanCount++
        this.grpcDataSender.sendSpan(span)
        registeEventListeners()
        // 5st spanStream end
        this.grpcDataSender.spanStream.end()

        this.grpcDataSender.pingStream.end()
        this.grpcDataSender.statStream.end()
    })
})