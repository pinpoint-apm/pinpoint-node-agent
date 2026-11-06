/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const grpc = require('@grpc/grpc-js')
const log = require('../../lib/utils/log/logger')
const services = require('../../lib/data/v1/Service_grpc_pb')
const dataConvertor = require('../../lib/data/grpc-data-convertor')
const { Empty } = require('google-protobuf/google/protobuf/empty_pb')
var _ = require('lodash')

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
    const call = statClient.sendAgentStat((err) => {
        if (err) {
            log.error(`statStream callback err: ${err}`)
            return
        }
    })
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

const retryTestTimeout = { timeout: 10 * 1000 }

let deadlineStatClient
let deadlineEndAction
let serverT
let callWriteOrder = 0
let deadlineCall
let callCount = 5

test('client side streaming with deadline', retryTestTimeout, function (t) {
    const server = new grpc.Server()
    let dataCount = 0
    server.addService(services.StatService, {
        sendAgentStat: function sendAgentStat(call, callback) {
            call.on('data', function (statMessage) {
                dataCount++

                if (statMessage) {
                    const agentStat = statMessage.getAgentstat()
                    serverT.equal(agentStat.getCollectinterval(), 1000, 'agentStat.getCollectinterval(), 1000 in server call.on("data")')

                    const memory = agentStat.getGc()
                    serverT.true(memory.getJvmmemoryheapused() >= 0, `index: ${memory.getJvmmemoryheapused()} equlity jvm memory heap used in server call.on("data")`)
                }
            })
            call.on('error', function (error) {
                serverT.true(false, 'when dealine, gRPC should never error in server call.on("error")')
                log.debug(`error: ${error}`)
            })
            call.on('end', function () {
                serverT.true(dataCount > 0, `dataCount: ${dataCount} matches datacount and callWirteOrder in server call.on('end')`)
                callback(null, new Empty())
            })
        }
    })
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (err, port) => {
        deadlineStatClient = new services.StatClient('localhost' + ":" + port, grpc.credentials.createInsecure(), { interceptors: [headerInterceptor] })

        serverT = t
        callStatWithDeadline(t)

        deadlineEndAction = () => {
            deadlineCall.end()
            server.tryShutdown((error) => {
                t.false(error, 'error is null in server.tryShutdown')
                t.end()
            })
        }
    })
})

function callStatWithDeadline(t) {
    deadlineCall = createStatCall(t)
    deadlineCall.on('error', (error) => {
        log.error(error)
    })

    for (let index = 0; index < callCount; index++) {
        _.delay(function () {
            const pStatMessage = dataConvertor.convertStat({
                agentId: '1212121212',
                agentStartTime: agentStartTime,
                timestamp: Date.now(),
                collectInterval: 1000,
                memory: {
                    heapUsed: index
                },
                cpu: {
                    user: 0,
                    system: 0
                }
            })
            deadlineCall.write(pStatMessage, () => {
                t.true(index >= 0, `index: ${index} call.write in call.write callback `)
                callWriteOrder++
            })
        }, _.random(10, 150))
    }
}

function createStatCall(t) {
    const deadline = new Date()
    deadline.setMilliseconds(deadline.getMilliseconds() + 100)
    return deadlineStatClient.sendAgentStat({ deadline: deadline }, (err, response) => {
        if (err) {
            log.error(`statStream callback err: ${err} in statClient.sendAgentStat callback`)
        }

        if (response) {
            t.equal(callWriteOrder, callCount, 'call count compare in statClient.sendAgentStat callback')
        }

        setTimeout(() => {
            deadlineEndAction()
        }, 0)
    })
}