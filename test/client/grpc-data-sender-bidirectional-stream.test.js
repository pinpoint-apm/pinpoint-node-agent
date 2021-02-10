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

function pingSession(call) {
    call.on('data', (ping) => {
        log.debug(`[pingSession] Write: ${JSON.stringify(ping.toObject())}`)
        call.write(ping)
    })
}

let grpcDataSender
test('gRPC bidirectional stream Ping', function (t) {
    const server = new grpc.Server()
    server.addService(services.AgentService, {
        pingSession: pingSession
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