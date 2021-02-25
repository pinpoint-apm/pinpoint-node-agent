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
const { log } = require('../test-helper')

var _ = require('lodash')

let statClient
let endAction
let serverT
const agentStartTime = Date.now()
let callWriteOrder = 0
let call
let callCount = 10
let dataCount = 0

function sendAgentStat(call, callback) {
    call.on('data', function (statMessage) {
        dataCount++

        if (statMessage) {
            const agentStat = statMessage.getAgentstat()
            serverT.equal(agentStat.getCollectinterval(), 1000, 'agentStat.getCollectinterval(), 1000 in server call.on("data")')

            const memory = agentStat.getGc()
            serverT.true(memory.getJvmmemoryheapused() >= 0, `index: ${memory.getJvmmemoryheapused()} equlity jvm memory heap used in server call.on("data")`)
            if (dataCount == callCount) {
                setTimeout(() => {
                    endAction()
                }, 0)
            }
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

function createStatCall(t) {
    const deadline = new Date()
    deadline.setMilliseconds(deadline.getMilliseconds() + 100)
    return statClient.sendAgentStat({ deadline: deadline }, (err, response) => {
        if (err) {
            log.error(`statStream callback err: ${err} in statClient.sendAgentStat callback`)
            t.equal(err.code, grpc.status.DEADLINE_EXCEEDED, `error code grpc.status.DEADLINE_EXCEEDED in statClient.sendAgentStat callback`)
            call.end()
            call = createStatCall(t)
            return
        }

        if (response) {
            t.equal(callWriteOrder, callCount, 'call count compare in statClient.sendAgentStat callback')
            t.true(response, 'response is true in statClient.sendAgentStat callback')
        }
    })
}

function callStat(t) {
    call = createStatCall(t)

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
            call.write(pStatMessage, () => {
                t.true(index >= 0, `index: ${index} call.write in call.write callback `)
                callWriteOrder++
            })
        }, _.random(10, 150))
    }
}

test('client side streaming with deadline', function (t) {
    const server = new grpc.Server()
    server.addService(services.StatService, {
        sendAgentStat: sendAgentStat
    })
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (err, port) => {
        server.start()

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

        serverT = t
        callStat(t)

        endAction = () => {
            call.end()
            server.tryShutdown((error) => {
                t.false(error, 'error is null in server.tryShutdown')
                t.equal(dataCount, callCount, 'call count matches in server.tryShutdown')
                t.end()
            })
        }
    })
})

test('sendAgentInfo deadline', (t) => {
    t.end()
})