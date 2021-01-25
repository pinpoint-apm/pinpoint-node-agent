/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const grpc = require('@grpc/grpc-js')

const services = require('../../lib/data/grpc/Service_grpc_pb')
const messages = require('../../lib/data/grpc/Service_pb')
const dataConvertor = require('../../lib/data/grpc-data-convertor')

function sendAgentStat(call, callback) {
    console.log('call request: ' + call.request)
}

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

let statClient
function callStat() {
    const call = statClient.sendAgentStat((err, response) => {
        if (err) {
            console.log(`statStream callback err: ${err}`)
        }
    })
    // agent-stats-monitor.js
    const pStatMessage = dataConvertor.convertStat({
        agentId: '1212121212',
        agentStartTime: agentStartTime,
        timestamp: Date.now(),
        collectInterval: 1000,
        memory: 0,
        cpu: {
            user: 0,
            system: 0
        }
    })
    call.write(pStatMessage)
}

test('client side streaming', function (t) {
    const server = new grpc.Server()
    server.addService(services.StatService, {
        SendAgentStat: sendAgentStat
    })
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (err, port) => {
        statClient = new services.StatClient(
            'localhost' + ":" + port,
            grpc.credentials.createInsecure(), {
                interceptors: [headerInterceptor]
            }
        )
        server.start()
    
        callStat()

        server.tryShutdown((error) => {
            t.end()
        })
    })
})