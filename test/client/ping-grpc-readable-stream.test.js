/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const grpc = require('@grpc/grpc-js')
const services = require('../../lib/data/v1/Service_grpc_pb')
const { beforeSpecificOne, DataSourceCallCountable } = require('./grpc-fixture')
const shimmer = require('@pinpoint-apm/shimmer')

class PingOnlyDataSource extends DataSourceCallCountable {
    constructor(collectorIp, collectorTcpPort, collectorStatPort, collectorSpanPort, agentInfo, config) {
        config = Object.assign({}, config, {
            sendPing: true,
        })
        super(collectorIp, collectorTcpPort, collectorStatPort, collectorSpanPort, agentInfo, config)
    }
}

// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/client.ts
test('If grpc server is ended, and then retry to connect Pinpoint server', (t) => {
    const server = new grpc.Server()
    let grpcServerCount = 0
    server.addService(services.AgentService, {
        pingSession: function (call) {
            call.on('data', (ping) => {
                grpcServerCount++
                if (grpcServerCount === 1) {
                    t.true(ping, '1st ping is not null in grpc server')
                    call.write(ping)
                } else if (grpcServerCount === 2) {
                    t.true(ping, '2nd ping is not null in grpc server')
                    call.write(ping)
                    call.end()
                }
            })
            call.on('end', () => {
                if (grpcServerCount === 2) {
                    t.fail('2nd ping call.end is not server call stream in grpc server')
                }
            })
        }
    })

    let dataSender
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (err, port) => {
        dataSender = beforeSpecificOne(port, PingOnlyDataSource)

        const pingWritableStream = dataSender.pingStream.writableStream
        pingWritableStream.count = 0
        pingWritableStream.on('data', (ping) => {
            pingWritableStream.count++

            if (pingWritableStream.count === 1) {
                t.true(ping, '1st ping is not null in writableStream')
                dataSender.sendPing()
            } else if (pingWritableStream.count === 2) {
                t.true(ping, '2nd ping is not null in writableStream')
            }
        })
        pingWritableStream.on('end', function () {
            t.true(pingWritableStream.count === 2, 'grpc server pingStream network stream ended')
            t.true(pingWritableStream.writableStream.readableEnded, 'pingDuplexStream.readableStreamEnded is true, grpc server pingStream ended')
            t.false(pingWritableStream.writableStream.writableEnded, 'pingDuplexStream.writableStreamEnded is false, grpc server pingStream ended')

            t.end()
        })
        dataSender.sendPing()
    })

    t.teardown(() => {
        dataSender.close()
        server.forceShutdown()
    })
})

test('ping stream retry', (t) => {
    const server = new grpc.Server()
    let grpcServerCount = 0
    server.addService(services.AgentService, {
        pingSession: function (call) {
            call.on('data', (ping) => {
                grpcServerCount++
                if (grpcServerCount === 1) {
                    server.forceShutdown()
                }
            })
        }
    })

    let dataSender
    let actualPort
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (err, port) => {
        dataSender = beforeSpecificOne(port, PingOnlyDataSource)
        actualPort = port

        let createdStreamCount = 0
        function firstPingEvents(pingWritableStream) {
            createdStreamCount++
            pingWritableStream.on('error', function (error) {
                if (createdStreamCount === 1) {
                    t.false(pingWritableStream.closed, 'The First created gRPC Writable stream has closed=false in error event')
                    t.equal(pingWritableStream.errored, null, 'The First created gRPC Writable stream has errored=null in error event')
                } else if (createdStreamCount === 4) {
                    runSecondPing(firstWritableStream)
                }
            })
            pingWritableStream.on('end', function () {
                t.fail('pingWritableStream should not call end event', pingWritableStream.writableStream)
            })
            pingWritableStream.on('close', function () {
                t.fail('pingWritableStream should not call close event', pingWritableStream.writableStream)
            })
            pingWritableStream.on('unpipe', function () {
                if (createdStreamCount === 1) {
                    t.true(pingWritableStream.writable, 'The first created gRPC Writable stream has writable=true in unpipe event')
                } else if (createdStreamCount === 2) {
                    t.true(pingWritableStream.writable, 'The second created gRPC Writable stream has writable=true in unpipe event')
                } else if (createdStreamCount === 3) {
                    t.true(pingWritableStream.writable, 'The third created gRPC Writable stream has writable=true in unpipe event')
                } else if (createdStreamCount === 4) {
                    t.true(pingWritableStream.writable, 'The fourth created gRPC Writable stream has writable=true in unpipe event')
                } else {
                    t.fail('pingWritableStream should not call unpipe event', pingWritableStream.writableStream)
                }
            })
        }

        shimmer.wrap(dataSender.pingStream.writableStream, 'connect', function (original) {
            return function () {
                const result = original.apply(this, arguments)
                firstPingEvents(result)
                return result
            }
        })
        dataSender.sendPing()
        const firstWritableStream = dataSender.pingStream.writableStream
        firstPingEvents(firstWritableStream.writableStream)
    })

    let server2
    let intervalId
    function runSecondPing(firstWritableStream) {
        server2 = new grpc.Server()
        let grpcServerCount2 = 0
        server2.addService(services.AgentService, {
            pingSession: function (call) {
                call.on('data', (ping) => {
                    grpcServerCount2++
                    if (grpcServerCount2 === 1) {
                        call.write(ping)
                        t.end()
                    }
                })
            }
        })
        server2.bindAsync(`localhost:${actualPort}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
            dataSender.sendPing()
            t.equal(actualPort, port, 'Server port is the same as the first one')
            t.notEqual(dataSender.pingStream.writableStream, firstWritableStream, 'The second created Writable stream is not the same as the first one that was ExponentialBackoffRetry failed')

            intervalId = setInterval(() => {
                dataSender.sendPing()
            }, 1000)
        })
    }

    t.teardown(() => {
        clearInterval(intervalId)
        dataSender.close()
        server2.forceShutdown()
    })
})