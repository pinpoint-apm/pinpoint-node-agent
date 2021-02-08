/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const grpc = require('@grpc/grpc-js')

const services = require('../../lib/data/grpc/Service_grpc_pb')
const dataConvertor = require('../../lib/data/grpc-data-convertor')
const { Empty } = require('google-protobuf/google/protobuf/empty_pb')
const { log} = require('../test-helper')

// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/7caf9fb3a650fe7cf7a04c0c65201997874a5f38/examples/src/grpcjs/server.ts#L53
const messageCount = 11
let callDataEventCount = 0

function sendAgentStat(call, callback) {
    call.on('data', function (stat) {
        if (stat) {
            callDataEventCount++
        }
    })
    call.on('end', function () {
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
    t.equal(call.call.nextCall.call.filterStack.filters.length, 4, `Filter is (4) [CallCredentialsFilter, DeadlineFilter, MaxMessageSizeFilter, CompressionFilter]`)
    t.equal(call.call.nextCall.call.options.deadline, Infinity, 'deadline default is Infinity')
    t.equal(call.call.nextCall.call.channel.pickQueue.length, 1, 'start call stream 1st queue')
    t.true(typeof call.call.nextCall.call.channel.subchannelPool.pool[`dns:localhost:${actualPort}`] === 'undefined', 'subchannel pool no related to call.write')

    for (let index = 0; index < messageCount; index++) {
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
        call.write(pStatMessage, () => {
            if (index == 0) {
                t.true(call.call.nextCall.call.pendingWrite, "1st message is pendingWrite")
                t.equal(call.call.nextCall.call.channel.subchannelPool.pool[`dns:localhost:${actualPort}`].length, 2, 'subchannel pool no related to call.write')
            } else if (index == 1) {
                t.equal(call.call.nextCall.call.channel.subchannelPool.pool[`dns:localhost:${actualPort}`].length, 2, `subchannel count`)
            } else if (index == 10) {
                t.equal(call.call.nextCall.call.channel.subchannelPool.pool[`dns:localhost:${actualPort}`].length, 2, 'subchannel pool no related to call.write')
            }
        })
    }
    call.end()
}

let endAction
let actualPort
test('client side streaming', function (t) {
    const server = new grpc.Server()
    server.addService(services.StatService, {
        sendAgentStat: sendAgentStat
    })
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (err, port) => {
        actualPort = port

        server.start()
        statClient = new services.StatClient('localhost' + ":" + port, grpc.credentials.createInsecure(), { interceptors: [headerInterceptor] })

        callStat(t)

        endAction = () => {
            t.equal(callDataEventCount, messageCount, `Message count is ${messageCount}`)
            server.tryShutdown((error) => {
                t.false(error, 'error is null')
                t.end()
            })
        }
    })
})