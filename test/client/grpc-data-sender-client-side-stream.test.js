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

test('client side streaming with deadline', function (t) {
    const server = new GrpcServer()
    server.addService(services.StatService, {
        sendAgentStat: sendAgentStat
    })

    server.startup((port) => {
        this.grpcDataSender = new GrpcDataSender('localhost', port, port, port, {
            'agentid': '12121212',
            'applicationname': 'applicationName',
            'starttime': Date.now()
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