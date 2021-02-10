/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const grpc = require('@grpc/grpc-js')
const services = require('../../lib/data/grpc/Service_grpc_pb')
const { Empty } = require('google-protobuf/google/protobuf/empty_pb')
const { log } = require('../test-helper')
const GrpcDataSender = require('../../lib/client/grpc-data-sender')

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

let grpcDataSender
test('client side streaming with deadline', function (t) {
    const server = new grpc.Server()
    server.addService(services.StatService, {
        sendAgentStat: sendAgentStat
    })

    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (err, port) => {
        server.start()

        grpcDataSender = new GrpcDataSender('localhost', port, port, port, {
            'agentid': '12121212',
            'applicationname': 'applicationName',
            'starttime': Date.now()
        })
        server.tryShutdown(() => {
            t.end()
        })
    })
})