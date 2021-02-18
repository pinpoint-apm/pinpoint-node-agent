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

let endAction

// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/server.ts
function sendAgentStat(call, callback) {
    call.on('data', function (statMessage) {
    })
    call.on('error', function(error) {
        log.debug(`error: ${error}`)
    })
    call.on('end', function () {
        callback(null, new Empty())
    })
}

function sendSpan(call, callback) {
    call.on('data', function (spanMessage) {
    })
    call.on('error', function(error) {
        log.debug(`error: ${error}`)
    })
    call.on('end', function () {
        callback(null, new Empty())
    })
}

let actualsCancellation
// https://github.com/grpc/grpc-node/issues/1542
// https://github.com/grpc/grpc-node/pull/1616/files
// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/client.ts
test('client side streaming with deadline and cancellation', function (t) {
    t.plan(0)
    actualsCancellation = {}

    const server = new GrpcServer()
    server.addService(services.StatService, {
        sendAgentStat: sendAgentStat
    })
    server.addService(services.SpanService, {
        sendSpan: sendSpan
    })

    server.startup((port) => {
        actualsCancellation.t = t
        actualsCancellation.sendSpanCount = 0
        actualsCancellation.sendStatCount = 0

        this.grpcDataSender = new GrpcDataSender('localhost', port, port, port, {
            'agentid': '12121212',
            'applicationname': 'applicationName',
            'starttime': Date.now()
        })

        let clientReceiveDataCount = 0
        const originData = this.grpcDataSender.pingStream.stream.listeners('data')[0]
        this.grpcDataSender.pingStream.stream.on('data', (data) => {
            clientReceiveDataCount++
            t.true(clientReceiveDataCount <= actualsCancellation.sendSpanCount, 'client receive data count')
            originData(data)
        })

        endAction = () => {
            setTimeout(() => {
                t.end()
                server.shutdown()
            }, 0)
        }
        endAction()
    })
})