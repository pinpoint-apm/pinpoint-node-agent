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
const { Empty } = require('google-protobuf/google/protobuf/empty_pb')

// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/7caf9fb3a650fe7cf7a04c0c65201997874a5f38/examples/src/grpcjs/server.ts#L53
function sendAgentStat(call, callback) {
    console.log('call request: ' + call.request)
    call.on('data', function(stat) {
        console.log('call request stat: ' + stat)
    })
    call.on('end', function() {
        callback(null, new Empty())
        setTimeout(() => {
            endAction()
        }, 0)
    })
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
    call.end()
}

let endAction
test('client side streaming', function (t) {
    const server = new grpc.Server()
    server.addService(services.StatService, {
        sendAgentStat: sendAgentStat
    })
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (err, port) => {
        server.start()

        statClient = new services.StatClient(
            'localhost' + ":" + port,
            grpc.credentials.createInsecure(), {
                interceptors: [headerInterceptor]
            }
        )
    
        callStat()

        endAction = () => {
            server.tryShutdown((error) => {
                t.end()
            })    
        }
    })
})