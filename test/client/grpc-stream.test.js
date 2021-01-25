/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const grpc = require('@grpc/grpc-js')

const services = require('../../lib/data/grpc/Service_grpc_pb')
const messages = require('../../lib/data/grpc/Service_pb')

function sendAgentStat(call, callback) {
    console.log('call request: ' + call.request)
}

const headerInterceptor = function (options, nextCall) {
    return new grpc.InterceptingCall(nextCall(options), {
        start: function (metadata, listener, next) {
            metadata.add('agentid', '1212121212')
            metadata.add('applicationname', 'test')
            metadata.add('starttime', String(Date.now()))
            next(metadata, listener, next)
        },
    })
}

function callStat() {
    const statClient = new services.StatClient(
        'localhost' + ":" + 50051,
        grpc.credentials.createInsecure(), {
            interceptors: [headerInterceptor]
        }
    )
}

test('client side streaming', function (t) {
    const server = new grpc.Server()
    server.addService(services.StatService, {
        SendAgentStat: sendAgentStat
    })
    server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
        server.start()

        callStat()

        server.tryShutdown((error) => {

        })
        t.end()
    })
})