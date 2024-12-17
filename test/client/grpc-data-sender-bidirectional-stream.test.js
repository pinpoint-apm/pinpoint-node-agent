/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */


const test = require('tape')
const grpc = require('@grpc/grpc-js')
const services = require('../../lib/data/v1/Service_grpc_pb')
const { log } = require('../test-helper')
const GrpcDataSender = require('../../lib/client/grpc-data-sender')
let actualPingSession = {
    serverDataCount: 0,
    serverEndCount: 0
}

// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/server.ts
// https://github.com/grpc/grpc-node/pull/1616/files
function pingSession(call) {
    call.on('data', (ping) => {
        actualPingSession.serverDataCount++
        log.debug(`pingSession in data: ${JSON.stringify(ping.toObject())}`)
        if (actualPingSession.serverDataCount == 1) {
            call.write(ping)
        } else if (actualPingSession.serverDataCount == 2) {
            call.emit('error', new Error('2st ping request is error'))
        } else if (actualPingSession.serverDataCount >= 3) {
            call.write(ping)
        }

        if (actualPingSession.serverDataCount == actualPingSession.dataCount) {
            actualPingSession.t.true(actualPingSession.serverDataCount == actualPingSession.dataCount, 'dataCount is matching')
        }
    })
    call.on('end', () => {
        actualPingSession.serverEndCount++
        if (actualPingSession.serverEndCount == 3) {
            actualPingSession.t.equal(actualPingSession.serverEndCount, actualPingSession.endCount, 'bidirectional stream end count match')
        }
    })
}

test.skip('when ping stream write throw a error, gRPC bidirectional stream Ping end ex) Deadline exceeded error case', function (t) {
    let planCount = 51

    actualPingSession = {
        serverDataCount: 0,
        serverEndCount: 0
    }
    const server = new grpc.Server()

    server.addService(services.AgentService, {
        pingSession: pingSession
    })
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (err, port) => {
        actualPingSession.endCount = 3
        actualPingSession.dataCount = 5
        actualPingSession.t = t

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

        const registerEventListeners = () => {
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
                    t.equal(error.code, 2, '2st error code is 2')
                    t.equal(error.details, '2st ping request is error', '2st error details is "2st ping request is error"')
                }
                if (callOrder == 5/* 3st Ping, Data */) {
                    registerEventListeners()
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
                        registerEventListeners()

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
                                        t.end()
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
                    t.equal(status.code, 2, '2st status code is 2')
                    t.equal(status.details, '2st ping request is error', '2st status details is "2st ping request is error"')
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

        registerEventListeners()
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

        t.teardown(() => {
            this.grpcDataSender.close()
            server.forceShutdown()
        })
    })
})