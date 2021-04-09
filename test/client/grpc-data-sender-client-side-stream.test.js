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
const Span = require('../../lib/context/span')
const GrpcClientSideStream = require('../../lib/client/grpc-client-side-stream')
var _ = require('lodash')

let endAction
let actuals

const expectedSpan = {
    "traceId": {
        "transactionId": {
            "agentId": "express-node-sample-id",
            "agentStartTime": 1592572771026,
            "sequence": 5
        },
        "spanId": 2894367178713953,
        "parentSpanId": -1,
        "flag": 0
    },
    "agentId": "express-node-sample-id",
    "applicationName": "express-node-sample-name",
    "agentStartTime": 1592572771026,
    "serviceType": 1400,
    "spanId": '2894367178713953',
    "parentSpanId": -1,
    "transactionId": {
        "type": "Buffer",
        "data": [0, 44, 101, 120, 112, 114, 101, 115, 115, 45, 110, 111, 100, 101, 45, 115, 97, 109, 112, 108, 101, 45, 105, 100, 210, 245, 239, 229, 172, 46, 5]
    },
    "startTime": 1592574173350,
    "elapsedTime": 28644,
    "rpc": "/",
    "endPoint": "localhost:3000",
    "remoteAddr": "::1",
    "annotations": [],
    "flag": 0,
    "err": 1,
    "spanEventList": null,
    "apiId": 1,
    "exceptionInfo": null,
    "applicationServiceType": 1400,
    "loggingTransactionInfo": null,
    "version": 1
}

const span = Object.assign(new Span({
    spanId: 2894367178713953,
    parentSpanId: -1,
    transactionId: {
        "agentId": "express-node-sample-id",
        "agentStartTime": 1592574173350,
        "sequence": 0
    }
}, {
    agentId: "express-node-sample-id",
    applicationName: "express-node-sample-name",
    agentStartTime: 1592574173350
}), expectedSpan)

// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/server.ts
function sendAgentStat(call, callback) {
    call.on('data', function (statMessage) {

    })
    call.on('error', function (error) {
        log.debug(`error: ${error}`)
    })
    call.on('end', function () {
        callback(null, new Empty())
    })
}

function sendSpan(call, callback) {
    call.on('data', function (spanMessage) {
        actuals.serverSpanDataCount++

        const span = spanMessage.getSpan()
        if (actuals.serverSpanDataCount == 1) {
            actuals.t.equal(actuals.serverSpanDataCount, 1, '1st sendSpan serverSpanDataCount is 1')
            actuals.t.equal(span.getSpanid(), '2894367178713953', 'span ID match in 1st sendSpan')
        } else if (actuals.serverSpanDataCount == 2) {
            actuals.t.equal(actuals.serverSpanDataCount, 2, '2st sendSpan serverSpanDataCount is 2')
            actuals.t.equal(span.getServicetype(), 1400, 'service type match in 2st sendSpan')
        } else if (actuals.serverSpanDataCount == 4) {
            actuals.t.equal(actuals.serverSpanDataCount, 4, '6st sendSpan serverSpanDataCount is 4')
            throw new Error('6st sendSpan serverSpanDataCount is 4')
        }
    })
    call.on('error', function (error) {
        log.debug(`error: ${error}`)
        actuals.t.equal(error.code, 13, '6st sendSpan serverSpanDataCount throws an error')
    })
    call.on('end', function () {
        callback(null, new Empty())
    })
}

function pingSession(call) {
    call.on('data', function () {
        actuals.serverPingCount++
    })
    call.on('end', () => {
        call.end()
    })
}

// https://github.com/grpc/grpc-node/issues/1542
// https://github.com/grpc/grpc-node/pull/1616/files
// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/client.ts
// stream.isReady() newRunnable(DefaultStreamTask.java)
test('client side streaming with deadline and cancellation', function (t) {
    t.plan(26)
    actuals = {}
    // when server send stream
    let callOrder = 0

    const server = new GrpcServer(5051)
    server.addService(services.AgentService, {
        pingSession: pingSession
    })
    server.addService(services.StatService, {
        sendAgentStat: sendAgentStat
    })
    server.addService(services.SpanService, {
        sendSpan: sendSpan
    })

    const retry = () => {
        t.end()
        // // 8st sendSpan when server shutdown
        // this.grpcDataSender.sendSpan(span)
        // // 9st sendSpan when server shutdown
        // this.grpcDataSender.sendSpan(span)
        // // 10st sendSpan when server shutdown
        // this.grpcDataSender.sendSpan(span)
    }

    server.startup((port) => {
        actuals.dataCount = 1
        actuals.t = t
        actuals.sendSpanCount = 0
        actuals.sendStatCount = 0
        actuals.serverSpanDataCount = 0
        actuals.serverPingCount = 0

        this.grpcDataSender = new GrpcDataSender('localhost', port, port, port, {
            'agentid': '12121212',
            'applicationname': 'applicationName',
            'starttime': Date.now()
        })

        this.grpcDataSender.spanStream.callback = (err) => {
            callOrder++

            if (callOrder == 1/* 3st spanStream end in callback */) {
                t.equal(callOrder, 1, '3st spanStream end in callback')
                t.equal(actuals.sendSpanCount, actuals.serverSpanDataCount, `span data count on server ${actuals.sendSpanCount}`)
            } else if (callOrder == 3/* 5st spanStream end in callback */) {
                t.equal(callOrder, 3, '5st spanStream end in callback')
            } else if (callOrder == 5/* 6st sendSpan */) {
                t.equal(callOrder, 5, '6st spanStream end in callback')
                t.equal(err.code, 13, 'code is 13 in 6st spanStream callback')
                t.equal(err.details, '6st sendSpan serverSpanDataCount is 4', 'details in 6st spanStream callback')
            } else if (callOrder == 7/* 8st when spanStream end, recovery spanstream */) {
                t.equal(callOrder, 7, '8st when spanStream end, recovery spanstream in callback')
                t.false(err, 'OK in 8st recovery spanstream callback')
            } else if (callOrder == 9/* 12st sendSpan and end when server shutdown */) {
                t.equal(callOrder, 9, '12st sendSpan and end when server shutdown in callback')
            }
        }

        const registeEventListeners = () => {
            const originStatus = this.grpcDataSender.spanStream.grpcStream.stream.listeners('status')[0]
            this.grpcDataSender.spanStream.grpcStream.stream.removeListener('status', originStatus)
            this.grpcDataSender.spanStream.grpcStream.stream.on('status', (status) => {
                callOrder++
                if (callOrder == 2/* 3st spanStream end on stream status event */) {
                    t.true(callOrder == 2, '3st spanStream end call Order on stream status event')
                    t.equal(status.code, 0, 'OK on 3st stream status event')
                    t.equal(status.details, 'OK', 'OK on 3st stream status event')
                } else if (callOrder == 4/* 5st spanStream end on stream status event */) {
                    t.true(callOrder == 4, '5st spanStream end call Order on stream status event')
                    t.equal(status.code, 0, 'OK on 5st stream status event')
                    t.equal(status.details, 'OK', 'OK on 5st stream status event')
                    setTimeout(() => {
                        // 6st sendSpan
                        actuals.sendSpanCount++
                        this.grpcDataSender.sendSpan(span)
                        registeEventListeners()
                    })
                } else if (callOrder == 6/* 6st sendSpan */) {
                    t.true(callOrder == 6, '6st spanStream end call Order on stream status event')
                    t.equal(status.code, 13, 'code is 13 in 6st spanStream callback')
                    t.equal(status.details, '6st sendSpan serverSpanDataCount is 4', 'details on stream status event')
                    setTimeout(() => {
                        // 8st when spanStream end, recovery spanstream
                        actuals.sendSpanCount++
                        this.grpcDataSender.sendSpan(span)
                        registeEventListeners()
                        this.grpcDataSender.spanStream.grpcStream.end()
                    })
                } else if (callOrder == 8/* 8st when spanStream end, recovery spanstream */) {
                    t.equal(callOrder, 8, '8st when spanStream end, recovery on stream status event')
                    t.equal(status.code, 0, 'OK on 8st stream status event')
                    t.equal(status.details, 'OK', 'OK on 8st stream status event')
                    endAction()
                }
                originStatus.call(this.grpcDataSender.spanStream, status)
            })
        }

        registeEventListeners()

        endAction = () => {
            setTimeout(() => {
                server.tryShutdown(() => {
                    retry(t)
                })
            }, 0)
        }

        // 1st sendSpan
        actuals.sendSpanCount++
        this.grpcDataSender.sendSpan(span)
        // 2st sendSpan
        actuals.sendSpanCount++
        this.grpcDataSender.sendSpan(span)
        // 3st spanStream end
        this.grpcDataSender.spanStream.grpcStream.end()

        // 4st sendSpan
        actuals.sendSpanCount++
        this.grpcDataSender.sendSpan(span)
        registeEventListeners()
        // 5st spanStream end
        this.grpcDataSender.spanStream.grpcStream.end()

        this.grpcDataSender.pingStream.grpcStream.end()
        this.grpcDataSender.statStream.grpcStream.end()
    })
})


test('gRPC client side stream reconnect test', (t) => {
    let actuals = {}
    const given = new GrpcClientSideStream('spanStream', {}, () => {
        return {
            on: function () {

            },
            write: function (data) {
                actuals.data = data
                return true
            },
            end: function () {
                actuals.ended = true
            },
            writable: true
        }
    })
    t.true(given.deadline > 0, 'deadline is initialized')
    given.write({})
    t.deepEqual(actuals.data, {}, 'actuals data')
    t.false(actuals.ended, 'client side stream lives')

    given.deadline = given.deadline - (5 * 60 * 1000 + 100)
    const fistDeadline = given.deadline
    given.write({ order: 2 })
    t.deepEqual(actuals.data, { order: 2 }, 'actuals data is order: 2')
    t.true(actuals.ended, 'client side stream is ended')
    t.true(given.grpcStream.stream === null, 'client side stream is null')

    t.equal(fistDeadline, given.deadline, 'deadline no changes')
    given.write({ order: 3 })
    t.deepEqual(actuals.data, { order: 3 }, 'actuals data is order: 3')
    t.true(given.deadline > fistDeadline, 'deadline new value')

    t.end()
})

function sendSpan1(call, callback) {
    call.on('data', function () {
        actualsSpanSession.serverDataCount++
    })
    call.on('error', function (error) {
        log.debug(`error: ${error}`)
    })
    call.on('end', function () {
        actualsSpanSession.serverEndCount++
        callback(null, new Empty())
    })
}
let actualsSpanSession
test('spanStream ERR_STREAM_WRITE_AFTER_END', (t) => {
    actualsSpanSession = {
        serverDataCount: 0,
        serverEndCount: 0
    }
    const callCount = 10

    const server = new GrpcServer()
    server.addService(services.AgentService, {
        pingSession: pingSession
    })
    server.addService(services.StatService, {
        sendAgentStat: sendAgentStat
    })
    server.addService(services.SpanService, {
        sendSpan: sendSpan1
    })

    server.startup((port) => {
        this.grpcDataSender = new GrpcDataSender('localhost', port, port, port, {
            'agentid': '12121212',
            'applicationname': 'applicationName',
            'starttime': Date.now()
        })

        let callOrder = 0
        this.grpcDataSender.spanStream.callback = () => {
            callOrder++
            process.nextTick(() => {
                if (callOrder == 1) {
                    t.true(true, `actualsSpanSession.serverDataCount: ${actualsSpanSession.serverDataCount}, on('data') count : ${callOrder}, actualsSpanSession.serverEndCount: ${actualsSpanSession.serverEndCount}`)
                    server.shutdown()
                    t.end()
                }
            })
        }

        for (let index = 0; index < callCount + 1; index++) {
            _.delay(() => {
                if (index == callCount - 8) {
                    this.grpcDataSender.spanStream.grpcStream.end()
                } else {
                    this.grpcDataSender.sendSpan(span)
                }
            }, _.random(10, 150))
        }

        this.grpcDataSender.pingStream.grpcStream.end()
        this.grpcDataSender.statStream.grpcStream.end()
    })
})

// https://github.com/pinpoint-apm/pinpoint-node-agent/issues/33#issuecomment-783891805
test('gRPC stream write retry test', (t) => {
    let retryCount = 0
    const given = new GrpcClientSideStream('spanStream', {}, () => {
        return {
            on: function () {

            },
            write: function (data, callback) {
                retryCount++

                if (retryCount == 1) {
                    callback(new Error('[ERR_STREAM_WRITE_AFTER_END]: write after end'))
                } else {
                    callback(new Error('Unknow exception'))
                }
            }
        }
    })

    t.true(given.grpcStream.stream, 'gRPC stream has streams')
    given.write({})
    t.equal(retryCount, 2, 'retry only once')
    t.false(given.stream, 'gRPC stream has ended')


    t.end()
})

//https://github.com/pinpoint-apm/pinpoint-node-agent/issues/67
test('stream HighWaterMark method in write', (t) => {
    t.plan(4)
    let eventCount = 0
    const given = new GrpcClientSideStream('spanStream', {}, () => {
        return {
            on: function (eventName) {
                eventCount++
                if (eventCount == 1) {
                    t.equal(eventName, 'error', 'clientSideStream listen error event')
                } else if (eventCount == 2) {
                    t.equal(eventName, 'status', 'clientSideStream listen status event')
                }
            },
            write: function () {
                return false
            },
            once: function (eventName) {
                t.equal(eventName, 'drain', 'once event called')
            }
        }
    })
    given.write({})
    t.true(given.grpcStream.writableHighWaterMarked, 'HightWaterMarked')
    t.end()
})

//https://github.com/pinpoint-apm/pinpoint-node-agent/issues/67
test('steam is null on HighWaterMark case', (t) => {
    const given = new GrpcClientSideStream('spanStream', {}, () => {
        return {
            on: function () {
            },
            write: function () {
                return false
            },
            once: function (eventName) {
                t.equal(eventName, 'drain', 'once event called')
            }
        }
    })
    given.grpcStream.stream = undefined
    t.equal(given.grpcStream.writableHighWaterMarked, undefined, 'if stream is null, writableHighWaterMarked is undefined')
    t.end()
})

test('sendSpan throw error and then stream is HighWaterMark', (t) => {
    t.plan(9)
    let streamCount = 0
    let callEndCount = 0
    let callback
    let writeCount = 0
    const given = new GrpcClientSideStream('spanStream', {}, () => {
        streamCount++
        if (streamCount == 1) {
            return {
                on: function () {
                },
                write: function (data, cb) {
                    writeCount++
                    process.nextTick(() => {
                        t.equal(streamCount, 1, 'sendSpan pass an error')
                        cb(new Error('error write'))
                    })
                    return true
                },
                once: function (eventName) {
                },
                end: function () {
                    callEndCount++
                    if (callEndCount == 1) {
                        t.equal(streamCount, 1, 'sendSpan pass an error and then end a stream')
                    }
                    if (callEndCount == 2) {
                        t.false(given.stream, 'stream is not null')
                        t.equal(streamCount, 1, 'sendSpan pass an error and then end a stream')
                    }
                }
            }
        }
        return {
            on: function (eventName) {
                if (eventName == 'error') {
                    t.equal(streamCount, 2, 'after pass an error and then create stream')
                }
            },
            write: function () {
                writeCount++
                return false
            },
            once: function (eventName, cb) {
                callback = cb
                t.equal(eventName, 'drain', 'once event called')
            }
        }
    })
    given.write({})
    process.nextTick(() => {
        t.equal(writeCount, 2, 'sendSpan throw an error and then retry sendSpan and then HightWaterMark')

        given.write({})
        t.equal(writeCount, 2, 'sendSpan canceled, when HightWaterMark')

        given.write({})
        t.equal(writeCount, 2, 'sendSpan canceled, when HightWaterMark')
    })
})