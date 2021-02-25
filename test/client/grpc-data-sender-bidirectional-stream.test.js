/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */


const test = require('tape')
const services = require('../../lib/data/grpc/Service_grpc_pb')
const { log } = require('../test-helper')
const GrpcDataSender = require('../../lib/client/grpc-data-sender')
const GrpcServer = require('./grpc-server')

let actualsPingSession
let endAction
// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/server.ts
// https://github.com/grpc/grpc-node/pull/1616/files
function pingSession(call) {
    actualsPingSession.serverDataCount = 0
    call.on('data', (ping) => {
        actualsPingSession.serverDataCount++
        log.debug(`pingSession in data: ${JSON.stringify(ping.toObject())}`)
        if (actualsPingSession.serverDataCount == 1) {
            call.write(ping)
        } else if (actualsPingSession.serverDataCount == 2) {
            call.cancel()
        } else if (actualsPingSession.serverDataCount == 3) {
            call.write(ping)
        }

        actualsPingSession.t.true(actualsPingSession.serverDataCount <= actualsPingSession.dataCount, 'dataCount is matching')

        if (actualsPingSession.serverDataCount == actualsPingSession.dataCount) {
            endAction()
        }
    })
    actualsPingSession.serverEndCount = 0
    call.on('end', () => {
        actualsPingSession.serverEndCount++
        call.end()
        if (actualsPingSession.serverEndCount == 2) {
            actualsPingSession.t.equal(actualsPingSession.serverEndCount, actualsPingSession.endCount, 'bidirectional stream end count match')
        }
    })
}

test('when ping stream write throw a error, gRPC bidirectional stream Ping end ex) Deadline exceeded error case', function (t) {
    t.plan(32)
    actualsPingSession = {}
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
        actualsPingSession.endCount = 2
        actualsPingSession.dataCount = 2
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

        const registeEventListeners = () => {
            const originEnd = this.grpcDataSender.pingStream.grpcStream.stream.listeners('end')[0]
            this.grpcDataSender.pingStream.grpcStream.stream.removeListener('end', originEnd)
            this.grpcDataSender.pingStream.grpcStream.stream.on('end', () => {
                callOrder++
                if (callOrder == 4/* 2st Ping, Server Error case */) {
                    t.equal(callOrder, 4, 'when server throw error, client call emit "error", "status" and "end" events')
                    t.true(this.grpcDataSender.pingStream.grpcStream.stream, 'when server throw error, 2st event call an end event')
                    originEnd()
                    t.true(this.grpcDataSender.pingStream.grpcStream.stream === null, 'when server throw error, end stream and null assign')
                    nextSendPingTest()
                } else if (callOrder == 8/* 4st Cancelled on client */) {
                    t.equal(callOrder, 8, '4st Cancelled on client')
                    originEnd()
                } else if (callOrder == 11/* 7st end */) {
                    t.equal(callOrder, 11, '7st end')
                    originEnd()
                    endAction()
                } else {
                    originEnd()
                    endAction()
                }
            })

            const originData = this.grpcDataSender.pingStream.grpcStream.stream.listeners('data')[0]
            this.grpcDataSender.pingStream.grpcStream.stream.removeListener('data', originData)
            this.grpcDataSender.pingStream.grpcStream.stream.on('data', (data) => {
                callOrder++
                if (callOrder == 1/* 1st Ping, Data */) {
                    t.true(callOrder == 1, '1st event is data')
                }
                if (callOrder == 5/* 3st Ping, Data */) {
                    t.equal(callOrder, 5, '3st Ping is data and call order is 5 ')

                    setTimeout(() => {
                        // 4st when PingStream client stream cancel
                        this.grpcDataSender.pingStream.grpcStream.stream.cancel()
                        // 5st when sendPing on client canceled
                        t.false(this.grpcDataSender.pingStream.grpcStream.stream.destroyed, 'gRPC HTTPStream doesnt close immediate by cancel')
                        this.grpcDataSender.sendPing()
                        // this.grpcDataSender.pingStream.end()
                    })
                }
                if (callOrder == 10/* 6st sendPing */) {
                    t.equal(callOrder, 10, '6st sendPing')
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
                if (callOrder == 6/* 4st Cancelled on client */) {
                    t.equal(callOrder, 6, '4st Cancelled on client')
                    t.equal(error.code, 1, '"Cancelled on client" error code is 1 in 4st Cancelled on client')
                    t.equal(error.message, '1 CANCELLED: Cancelled on client', '1 CANCELLED: Cancelled on client in 4st Cancelled on client')
                }
                if (callOrder == 9/* 5st when sendPing on client canceled */) {
                    t.equal(callOrder, 9, '5st when sendPing on client canceled')
                    t.equal(error.code, 'ERR_STREAM_WRITE_AFTER_END', ' in 5st when sendPing on client canceled')
                    t.equal(error.message, 'write after end', 'in 5st when sendPing on client canceled')
                    setTimeout(() => {
                        // 6st sendPing
                        this.grpcDataSender.sendPing()
                        registeEventListeners()

                        // 7st end
                        this.grpcDataSender.pingStream.end()
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
                if (callOrder == 7/* 4st Cancelled on client */) {
                    t.equal(callOrder, 7, '4st Cancelled on client')
                    t.equal(status.code, 1, 'Cancelled on client status code is 0 in 4st Cancelled on client')
                    t.equal(status.details, 'Cancelled on client', 'Cancelled on client status message is OK in 4st Cancelled on client')
                }
                // if (callOrder == 6/* 6st PingStream is ended before gRPC server shutdown */) {
                //     t.equal(callOrder, 6, '6st PingStream is ended before gRPC server shutdown')
                //     t.equal(status.code, 0, '"status is OK, code is 0 in 6st PingStream is ended before gRPC server shutdown')
                //     t.equal(status.details, 'OK', 'status is OK in 6st PingStream is ended before gRPC server shutdown')
                // }
                originStatus(status)
            })
        }

        registeEventListeners()
        t.true(this.grpcDataSender.pingStream.grpcStream.stream, 'Ping stream is Good')
        this.grpcDataSender.sendPing()

        // Server Error case
        t.true(this.grpcDataSender.pingStream.grpcStream.stream, 'Ping stream is Good in server error')
        this.grpcDataSender.sendPing()

        const nextSendPingTest = () => {
            // after Server Error case, reconnect case
            t.true(this.grpcDataSender.pingStream.grpcStream.stream === null, 'stream is null after call.cancel not found error')
            this.grpcDataSender.sendPing()
            registeEventListeners()
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
