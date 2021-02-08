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

let statClient
let endAction
let globalT
const agentStartTime = Date.now()

function sendAgentStat(call, callback) {
    call.on('data', function (stat) {
        if (stat) {
            const agentStat = stat.getAgentstat()
            globalT.equal(agentStat.getCollectinterval(), 1000, 'agentStat.getCollectinterval(), 1000')
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

    call.end()
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

        globalT = t
        callStat(t)

        endAction = () => {
            server.tryShutdown((error) => {
                t.false(error, 'error is null')
                t.end()
            })
        }
    })
})