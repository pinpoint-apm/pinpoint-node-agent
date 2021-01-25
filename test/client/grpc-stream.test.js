/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const grpc = require('@grpc/grpc-js')

const services = require('../../lib/data/grpc/Service_grpc_pb')
const messages = require('../../lib/data/grpc/Service_pb')

function sendSpan(call, callback) {
    console.log('call request: ' + call.request)
}

test('client side streaming', function (t) {
    const server = new grpc.Server()
    server.addService(services.SpanService, {sendSpan: sendSpan})
    server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
        server.start()

        server.tryShutdown((error) => {
            
        })
        t.end()
    })
})