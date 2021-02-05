/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const grpc = require('@grpc/grpc-js')

const services = require('../../lib/data/grpc/Service_grpc_pb')
const { Empty } = require('google-protobuf/google/protobuf/empty_pb')

let actualPort
let statClient
let endAction

function sendAgentStat(call, callback) {
    call.on('data', function (stat) {
        if (stat) {
        }
    })
    call.on('end', function () {
        callback(null, new Empty())
        setTimeout(() => {
            endAction()
        }, 0)
    })
}

function callStat(t) {
    const call = statClient.sendAgentStat((err, response) => {
        if (err) {
            log.error(`statStream callback err: ${err}`)
            return
        }

        if (response) {
            t.true(response, 'response is true')
        }
    })
    call.end()
}

test('client side streaming with deadline', function (t) {
    const server = new grpc.Server()
    server.addService(services.StatService, {
        sendAgentStat: sendAgentStat
    })
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (err, port) => {
        actualPort = port

        server.start()

        const agentStartTime = Date.now()
        const headerInterceptor = function (options, nextCall) {
            return new grpc.InterceptingCall(nextCall(options), {
                start: function (metadata, listener, next) {
                    metadata.add('agentid', '1212121212')
                    metadata.add('applicationname', 'test')
                    metadata.add('starttime', String(agentStartTime))
                    next(metadata, listener, next)
                },
            })
        }
        statClient = new services.StatClient('localhost' + ":" + port, grpc.credentials.createInsecure(), { interceptors: [headerInterceptor] })

        callStat(t)

        endAction = () => {
            server.tryShutdown((error) => {
                t.false(error, 'error is null')
                t.end()
            })
        }
    })
})