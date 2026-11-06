/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const { TestGrpcDataSenderBuilder, PingAdaptor } = require('../../support/test-grpc-data-sender')
const shimmer = require('@pinpoint-apm/shimmer')

const reconnectTestTimeout = { timeout: 60 * 1000 }

// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/client.ts
test('If grpc server is ended, and then retry to connect Pinpoint server', reconnectTestTimeout, async (t) => {
    const pingAdaptor = new PingAdaptor().endStreamAfter(2)
    const dataSender = await new TestGrpcDataSenderBuilder()
        .addAdaptor(pingAdaptor)
        .build()
    t.teardown(() => {
        dataSender.close()
    })

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
    pingWritableStream.on('end', async function () {
        t.true(pingWritableStream.count === 2, 'grpc server pingStream network stream ended')
        t.true(pingWritableStream.writableStream.readableEnded, 'pingDuplexStream.readableStreamEnded is true, grpc server pingStream ended')
        t.false(pingWritableStream.writableStream.writableEnded, 'pingDuplexStream.writableStreamEnded is false, grpc server pingStream ended')

        const socketId = await pingAdaptor.connection(1)
        const [firstPing, secondPing] = pingAdaptor.pings(socketId)
        t.true(firstPing, '1st ping is not null in grpc server')
        t.true(secondPing, '2nd ping is not null in grpc server')
        t.false(pingAdaptor.clientEnded, 'the client does not end the ping stream that the grpc server ended')
        t.end()
    })
    dataSender.sendPing()
})

test('ping stream reconnects after the collector comes back', reconnectTestTimeout, async (t) => {
    const pingAdaptor = new PingAdaptor()
    const dataSender = await new TestGrpcDataSenderBuilder()
        .addAdaptor(pingAdaptor)
        .build()
    pingAdaptor.connection(1).then(() => {
        dataSender.disconnect()
    })
    const actualPort = dataSender.port

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

    let intervalId
    async function runSecondPing(firstWritableStream) {
        const restartedPingAdaptor = new PingAdaptor()
        const port = await dataSender.restart(restartedPingAdaptor)
        restartedPingAdaptor.connection(1).then(() => {
            t.end()
        })
        dataSender.sendPing()
        t.equal(actualPort, port, 'Server port is the same as the first one')
        t.notEqual(dataSender.pingStream.writableStream, firstWritableStream, 'The second created Writable stream is not the same as the first one that was ExponentialBackoffRetry failed')

        intervalId = setInterval(() => {
            dataSender.sendPing()
        }, 1000)
    }

    t.teardown(() => {
        clearInterval(intervalId)
        dataSender.close()
    })
})