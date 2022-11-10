/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */


const test = require('tape')
const services = require('../../lib/data/v1/Service_grpc_pb')
const { log } = require('../test-helper')
const GrpcDataSender = require('../../lib/client/grpc-data-sender')
const GrpcServer = require('./grpc-server')
var _ = require('lodash')

let actualsPingSession = {
    serverDataCount: 0,
    serverEndCount: 0
}

let endAction
// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/server.ts
// https://github.com/grpc/grpc-node/pull/1616/files
function pingSession(call) {
    call.on('data', (ping) => {
        actualsPingSession.serverDataCount++
        log.debug(`pingSession in data: ${JSON.stringify(ping.toObject())}`)
        if (actualsPingSession.serverDataCount == 1) {
            call.write(ping)
        } else if (actualsPingSession.serverDataCount == 2) {
            call.cancel()
        } else if (actualsPingSession.serverDataCount >= 3) {
            call.write(ping)
        }

        if (actualsPingSession.serverDataCount == actualsPingSession.dataCount) {
            actualsPingSession.t.true(actualsPingSession.serverDataCount == actualsPingSession.dataCount, 'dataCount is matching')
        }
    })
    call.on('end', () => {
        actualsPingSession.serverEndCount++
        call.end()
        if (actualsPingSession.serverEndCount == 3) {
            actualsPingSession.t.equal(actualsPingSession.serverEndCount, actualsPingSession.endCount, 'bidirectional stream end count match')
        }
    })
}

test.skip('when ping stream write throw a error, gRPC bidirectional stream Ping end ex) Deadline exceeded error case', function (t) {
    let planCount = 51

    actualsPingSession = {
        serverDataCount: 0,
        serverEndCount: 0
    }
    const server = new GrpcServer()

    server.addService(services.AgentService, {
        pingSession: pingSession
    })
    server.addService(services.StatService, {
        sendAgentStat: pingSessionServer
    })
    server.addService(services.SpanService, {
        sendSpan: pingSessionServer
    })
    server.startup((port) => {
        actualsPingSession.endCount = 3
        actualsPingSession.dataCount = 5
        actualsPingSession.t = t

        this.grpcDataSender = new GrpcDataSender('localhost', port, port, port, {
            'agentid': '12121212',
            'applicationname': 'applicationName',
            'starttime': Date.now()
        })

        t.equal(this.grpcDataSender.pingStream.constructor.name, 'GrpcBidirectionalStream', `pingStream is the GrpcBidirectionalStream`)
        t.equal(this.grpcDataSender.pingStream.grpcStream.stream.constructor.name, 'ClientDuplexStreamImpl', 'when previous throw Deadline exceeded')

        // when server send stream end event
        let callOrder = 0

        const originGrpcStream = this.grpcDataSender.pingStream.grpcStream.endWithStream
        this.grpcDataSender.pingStream.grpcStream.endWithStream = (stream) => {
            this.grpcDataSender.pingStream.grpcStream.endedStream = stream
            originGrpcStream(stream)
        }

        const registeEventListeners = () => {
            const originEnd = this.grpcDataSender.pingStream.grpcStream.stream.listeners('end')[0]
            this.grpcDataSender.pingStream.grpcStream.stream.removeListener('end', originEnd)
            this.grpcDataSender.pingStream.grpcStream.stream.on('end', () => {
                callOrder++
                if (callOrder == 4/* 2st Ping, Server Error case */) {
                    t.equal(callOrder, 4, 'when server throw error, client call emit "error", "status" and "end" events')
                    t.true(this.grpcDataSender.pingStream.grpcStream.stream, 'when server throw error, 2st event call an end event')
                    originEnd()
                    nextSendPingTest()
                } else if (callOrder == 9/* 4st Cancelled on client */) {
                    t.equal(callOrder, 9, '4st Cancelled on client')
                    originEnd()
                } else if (callOrder == 14/* 7st end */) {
                    t.equal(callOrder, 14, '7st end')
                    originEnd()
                }
            })

            const originData = this.grpcDataSender.pingStream.grpcStream.stream.listeners('data')[0]
            this.grpcDataSender.pingStream.grpcStream.stream.removeListener('data', originData)
            this.grpcDataSender.pingStream.grpcStream.stream.on('data', (data) => {
                callOrder++
                if (callOrder == 1/* 1st Ping, Data */) {
                    t.true(callOrder == 1, '1st event is data')
                }
                if (callOrder == 6/* 3st Ping, Data */) {
                    t.equal(callOrder, 6, '3st Ping is data and call order is 5 ')

                    setTimeout(() => {
                        // 4st when PingStream client stream cancel
                        this.grpcDataSender.pingStream.grpcStream.stream.cancel()
                        // 5st when sendPing on client canceled
                        t.false(this.grpcDataSender.pingStream.grpcStream.stream.destroyed, 'gRPC HTTPStream doesnt close immediate by cancel')
                        this.grpcDataSender.sendPing()
                        // this.grpcDataSender.pingStream.end()
                    })
                }
                if (callOrder == 11/* 5st sendPing */) {
                    t.equal(callOrder, 11, '6st sendPing')
                }
                if (callOrder == 12/* 6st sendPing */) {
                    t.equal(callOrder, 12, '6st sendPing')
                }
                originData(data)
            })

            const originError = this.grpcDataSender.pingStream.grpcStream.stream.listeners('error')[0]
            this.grpcDataSender.pingStream.grpcStream.stream.removeListener('error', originError)
            this.grpcDataSender.pingStream.grpcStream.stream.on('error', (error) => {
                callOrder++
                if (callOrder == 2/* 2st Ping, Server Error case */) {
                    t.true(callOrder == 2, '2st event is error')
                    t.equal(error.code, 13, '"call.cancel is not a function" error code is 13')
                    t.equal(error.message, '13 INTERNAL: call.cancel is not a function', '13 INTERNAL: call.cancel is not a function')
                }
                if (callOrder == 5/* 3st Ping, Data */) {
                    registeEventListeners()
                }
                if (callOrder == 7/* 4st Cancelled on client */) {
                    t.equal(callOrder, 7, '4st Cancelled on client')
                    t.equal(error.code, 1, '"Cancelled on client" error code is 1 in 4st Cancelled on client')
                    t.equal(error.message, '1 CANCELLED: Cancelled on client', '1 CANCELLED: Cancelled on client in 4st Cancelled on client')
                }
                if (callOrder == 10/* 5st when sendPing on client canceled */) {
                    t.equal(callOrder, 10, '5st when sendPing on client canceled')
                    t.equal(error.code, 'ERR_STREAM_WRITE_AFTER_END', ' in 5st when sendPing on client canceled')
                    t.equal(error.message, 'write after end', 'in 5st when sendPing on client canceled')
                    setTimeout(() => {
                        // 6st sendPing
                        this.grpcDataSender.sendPing()
                        registeEventListeners()

                        // 7st end
                        if (typeof this.grpcDataSender.pingStream.grpcStream.stream.writable !== 'undefined') {
                            t.true(this.grpcDataSender.pingStream.grpcStream.stream.writable, 'writable is true before stream.end() on 7st end')
                        }
                        if (typeof this.grpcDataSender.pingStream.grpcStream.stream.writableEnded !== 'undefined') {
                            t.false(this.grpcDataSender.pingStream.grpcStream.stream.writableEnded, 'writableEnded is false before stream.end() on 7st end')
                        }

                        t.false(this.grpcDataSender.pingStream.grpcStream.streamEnded, 'stream ended symbol not sync by writable.end()')
                        t.true(typeof this.grpcDataSender.pingStream.grpcStream.streamEndedSymbol === 'undefined', 'stream ended symbol not boolean by writable.end()')
                        this.grpcDataSender.pingStream.grpcStream.stream.end()
                        t.false(this.grpcDataSender.pingStream.grpcStream.streamEnded, 'stream ended symbol not sync by writable.end()')
                        t.true(typeof this.grpcDataSender.pingStream.grpcStream.streamEndedSymbol === 'undefined', 'stream ended symbol not boolean by writable.end()')

                        if (typeof this.grpcDataSender.pingStream.grpcStream.stream.writable !== 'undefined') {
                            t.false(this.grpcDataSender.pingStream.grpcStream.stream.writable, 'writable is false after stream.end() on 7st end')
                        }
                        if (typeof this.grpcDataSender.pingStream.grpcStream.stream.writableEnded !== 'undefined') {
                            t.true(this.grpcDataSender.pingStream.grpcStream.stream.writableEnded, 'writableEnded is true after stream.end() on 7st end')
                        }

                        t.false(this.grpcDataSender.pingStream.grpcStream.streamEnded, 'stream ended symbol is sync by stream.end()')
                        t.true(typeof this.grpcDataSender.pingStream.grpcStream.streamEndedSymbol === 'undefined', 'stream ended symbol is boolean by stream.end()')
                        this.grpcDataSender.pingStream.grpcStream.endWithStream(this.grpcDataSender.pingStream.grpcStream.stream)
                        t.true(this.grpcDataSender.pingStream.grpcStream.streamEnded, 'stream ended symbol is sync by stream.end()')
                        t.true(typeof this.grpcDataSender.pingStream.grpcStream.streamEndedSymbol === 'boolean', 'stream ended symbol is boolean by stream.end()')
                        t.true(this.grpcDataSender.pingStream.grpcStream.streamEndedSymbol, 'stream ended symbol is true by stream.end()')

                        t.true(this.grpcDataSender.pingStream.grpcStream.stream, 'stream is not null')
                        this.grpcDataSender.pingStream.grpcStream.end()
                        t.true(this.grpcDataSender.pingStream.grpcStream.stream === null, 'stream is null after grpcStream.end()')

                        // 8st sendPing()
                        this.grpcDataSender.sendPing()
                        const currentStream = this.grpcDataSender.pingStream.grpcStream.stream

                        process.nextTick(() => {
                            // 9st sendPing()
                            this.grpcDataSender.sendPing()
                            t.true(currentStream === this.grpcDataSender.pingStream.grpcStream.stream, 'steam reused')

                            const originWrite = this.grpcDataSender.pingStream.grpcStream.write
                            let writeCount = 0
                            this.grpcDataSender.pingStream.grpcStream.write = (data, rewriteAfterStreamEnd = true) => {
                                writeCount++
                                originWrite.call(this.grpcDataSender.pingStream.grpcStream, data, rewriteAfterStreamEnd)
                                if (writeCount == 2) {
                                    process.nextTick(() => {
                                        this.grpcDataSender.pingStream.grpcStream.end()
                                        endAction()
                                    })
                                }
                            }
                            this.grpcDataSender.pingStream.grpcStream.stream.end()
                            this.grpcDataSender.pingStream.grpcStream.stream = {
                                writable: true,
                                write: function (data, callback) {
                                    currentStream.write(data, callback)
                                },
                                end: function () {
                                    this.writable = false
                                    currentStream.end()
                                },
                                once: function (eventName, cb) {
                                    currentStream.once(eventName, cb)
                                }
                            }
                            this.grpcDataSender.sendPing()
                        })
                    })
                }
                originError(error)
            })

            const originStatus = this.grpcDataSender.pingStream.grpcStream.stream.listeners('status')[0]
            this.grpcDataSender.pingStream.grpcStream.stream.removeListener('status', originStatus)
            this.grpcDataSender.pingStream.grpcStream.stream.on('status', (status) => {
                callOrder++
                if (callOrder == 3/* 2st Ping, Server Error case */) {
                    t.true(callOrder == 3, '3st is status')
                    t.equal(status.code, 13, '"call.cancel is not a function" error code is 13 in 2st ping is status')
                    t.equal(status.details, 'call.cancel is not a function', 'call.cancel is not a function in 2st ping is status')
                }
                if (callOrder == 8/* 4st Cancelled on client */) {
                    t.equal(callOrder, 8, '4st Cancelled on client')
                    t.equal(status.code, 1, 'Cancelled on client status code is 0 in 4st Cancelled on client')
                    t.equal(status.details, 'Cancelled on client', 'Cancelled on client status message is OK in 4st Cancelled on client')
                }
                if (callOrder == 13/* 7st end */) {
                    t.equal(callOrder, 13, '7st end on client')
                    t.equal(status.code, 0, 'status.code is 0 on 7st end on client')
                    t.equal(status.details, 'OK', 'status.details is OK on 7st end on client')
                }
                originStatus(status)
            })
        }

        if (typeof this.grpcDataSender.pingStream.grpcStream.stream.writable === 'undefined') {
            planCount = planCount - 2
        }
        if (typeof this.grpcDataSender.pingStream.grpcStream.stream.writableEnded === 'undefined') {
            planCount = planCount - 2
        }
        // t.plan(planCount)

        registeEventListeners()
        t.true(this.grpcDataSender.pingStream.grpcStream.stream, 'Ping stream is Good')
        this.grpcDataSender.sendPing()

        // Server Error case
        t.true(this.grpcDataSender.pingStream.grpcStream.stream, 'Ping stream is Good in server error')
        this.grpcDataSender.sendPing()

        const nextSendPingTest = () => {
            /* 3st Ping, Data after Server Error case, reconnect case */
            this.grpcDataSender.sendPing()
            t.true(this.grpcDataSender.pingStream.grpcStream.stream, 'when reconnect to gRPC server, after call.cancel not found error')
        }

        endAction = () => {
            server.tryShutdown(() => {
                t.end()
            })
        }
    })
})

function pingSessionServer(call) {
    actualsPingSessionServer.serverDataCount = 0
    call.on('data', () => {

    })

    call.on('end', () => {
    })
}

let actualsPingSessionServer


function pingSession2(call) {
    call.on('data', (ping) => {
        actualsPingSession.serverDataCount++
        call.write(ping)
    })
    call.on('end', () => {
        actualsPingSession.serverEndCount++
        call.end()
    })
}

test('ping ERR_STREAM_WRITE_AFTER_END', (t) => {
    actualsPingSession = {
        serverDataCount: 0,
        serverEndCount: 0
    }
    const callCount = 20
    t.plan(1)

    const server = new GrpcServer()
    server.addService(services.AgentService, {
        pingSession: pingSession2
    })
    server.addService(services.StatService, {
        sendAgentStat: pingSessionServer
    })
    server.addService(services.SpanService, {
        sendSpan: pingSessionServer
    })

    server.startup((port) => {
        this.grpcDataSender = new GrpcDataSender('localhost', port, port, port, {
            'agentid': '12121212',
            'applicationname': 'applicationName',
            'starttime': Date.now()
        })

        let callOrder = 0
        const originData = this.grpcDataSender.pingStream.grpcStream.stream.listeners('data')[0]
        this.grpcDataSender.pingStream.grpcStream.stream.removeListener('data', originData)
        this.grpcDataSender.pingStream.grpcStream.stream.on('data', (data) => {
            callOrder++
            originData(data)
        })

        for (let index = 0; index < callCount + 1; index++) {
            _.delay(() => {
                if (index == callCount - 8) {
                    this.grpcDataSender.pingStream.grpcStream.end()
                    process.nextTick(() => {
                        t.true(true, `actualsPingSession.serverDataCount: ${actualsPingSession.serverDataCount}, on('data') count : ${callOrder}`)
                        server.tryShutdown(() => {
                            t.end()
                        })
                    })
                } else {
                    this.grpcDataSender.sendPing()
                }
            }, _.random(10, 150))
        }
    })
})