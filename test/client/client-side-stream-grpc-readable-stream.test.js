/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const grpc = require('@grpc/grpc-js')
const { beforeSpecificOne, StatOnlyFunctionalTestableDataSource } = require('../support/grpc-fixture')
const agent = require('../support/agent-singleton-mock')
const services = require('../../lib/data/v1/Service_grpc_pb')
const { Empty } = require('google-protobuf/google/protobuf/empty_pb')
const { setInterval } = require('node:timers/promises')
const shimmer = require('@pinpoint-apm/shimmer')

const reconnectTestTimeout = { timeout: 60 * 1000 }

function agentStatAt(timestamp) {
    return { timestamp, collectInterval: 1000, cpu: { user: 0, system: 0 } }
}

test('stat stream retry connection Tests', reconnectTestTimeout, async function (t) {
    agent.bindHttp()

    const expected1 = agentStatAt(1)

    const server = new grpc.Server()
    server.addService(services.StatService, {
        sendAgentStat: function (call) {
            let statCallCount = 0
            call.on('data', (data) => {
                statCallCount++

                if (statCallCount === 1) {
                    t.equal(data.getAgentstat().getTimestamp(), expected1.timestamp, `timestamp should be ${expected1.timestamp}`)

                    server.forceShutdown()
                }
            })
        }
    })

    let dataSender
    let expectedStats = []
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (err, port) => {
        dataSender = beforeSpecificOne(port, StatOnlyFunctionalTestableDataSource)

        let callCount = 0
        dataSender.statStreamBuilder.setCallback(async (err) => {
            callCount++
            if (callCount === 1) {
                t.equal(err.code, grpc.status.CANCELLED, `gRPC server is shut down, so the error code should be ${grpc.status.CANCELLED}`)

                dataSender.statStream.writableStream.on('close', () => {
                    t.false(dataSender.statStream.writableStream.writable, `If the stream is errored, the stream should be closed and not writable`)
                })
                dataSender.statStream.writableStream.on('unpipe', () => {
                    t.false(dataSender.statStream.writableStream.writable, `If the stream is errored, the stream should be unpipe and not writable`)
                })
                t.equal(writableStream, dataSender.statStream.writableStream, `No change writableStream when gRPC server is shut down`)
                t.equal(writableStream.backoffRetry.attempts, 0, `retry connection is not started in callback`)
            } else if (callCount === 2) {
                t.equal(err.code, grpc.status.UNAVAILABLE, `gRPC server was shut down, so the error code should be ${grpc.status.UNAVAILABLE}`)
                t.equal(callCount - 1, 1, `1st time retry connection `)

                dataSender.statStream.writableStream.on('close', () => {
                    t.true(dataSender.statStream.writableStream.writableStream.writableEnded, `If the 1st retry created stream is errored, the stream should be closed and writableEnded`)
                })
                dataSender.statStream.writableStream.on('unpipe', () => {
                    t.true(dataSender.statStream.writableStream.writableStream.writableEnded, `If the 1st retry created stream is errored, the stream should be unpipe and writableEnded`)
                })
                t.equal(writableStream, dataSender.statStream.writableStream, `No change writableStream when 1st retry error`)
                t.equal(writableStream.backoffRetry.attempts, 1, `1st retry connection is failed`)
            } else if (callCount === 3) {
                t.equal(err.code, grpc.status.UNAVAILABLE, `gRPC server was shut down, so the error code should be ${grpc.status.UNAVAILABLE}`)
                t.equal(callCount - 1, 2, `2nd time retry connection `)

                dataSender.statStream.writableStream.on('close', () => {
                    t.true(dataSender.statStream.writableStream.writableStream.writableEnded, `2nd retry created stream is errored, writableEnded on close event`)
                })
                dataSender.statStream.writableStream.on('unpipe', () => {
                    t.true(dataSender.statStream.writableStream.writableStream.writableEnded, `2nd retry created stream is errored, writableEnded = true on unpipe event`)
                })
                t.equal(writableStream, dataSender.statStream.writableStream, `No change writableStream when 2nd retry error`)
                t.equal(writableStream.backoffRetry.attempts, 2, `2nd retry connection is failed`)
            } else if (callCount === 4) {
                t.equal(err.code, grpc.status.UNAVAILABLE, `gRPC server was shut down, so the error code should be ${grpc.status.UNAVAILABLE}`)
                t.equal(callCount - 1, 3, `3rd time retry connection`)

                dataSender.statStream.writableStream.on('close', () => {
                    t.true(dataSender.statStream.writableStream.writableStream.writableEnded, `3rd retry created stream is errored, writableEnded = true on close event`)
                })
                dataSender.statStream.writableStream.on('unpipe', () => {
                    t.true(dataSender.statStream.writableStream.writableStream.writableEnded, `3rd retry created stream is errored, writableEnded = true on unpipe event`)
                })
                t.equal(writableStream, dataSender.statStream.writableStream, `No change writableStream when 3rd retry error`)
                t.equal(writableStream.backoffRetry.attempts, 3, `3rd retry connection is failed`)

                let index = 0
                for await (const statStreamWritableEnded of setInterval(1000, dataSender.statStream.writableStream.ended)) {
                    if (index === 0) {
                        t.true(statStreamWritableEnded, `writableEnded = true, When 1st sendStat call in for loop`)
                        bindAsyncServer2()

                        shimmer.wrap(dataSender.statStream, 'pipeWritableStream', function (original) {
                            return function () {
                                if (index === 0) {
                                    t.true(dataSender.statStream.writableStream.shouldCreateNewStream(), `availableRetry = true, index=${index}`)
                                    t.equal(dataSender.statStream.writableStream.backoffRetry.attempts, 4, `backoffRetry.attempts: ${dataSender.statStream.writableStream.backoffRetry.attempts}, index=${index}`)
                                }
                                original.apply(this, arguments)
                                if (index === 0) {
                                    t.false(dataSender.statStream.writableStream.shouldCreateNewStream(), `availableRetry = false, index=${index} after pipeWritableStream() call`)
                                    t.notEqual(writableStream, dataSender.statStream.writableStream, `new GrpcReadableStream.writableStream, index=${index} after pipeWritableStream() call`)
                                    writableStream = dataSender.statStream.writableStream
                                }
                            }
                        })
                    }

                    const expected = agentStatAt(100 + index)
                    expectedStats.push(expected)
                    dataSender.sendStat(expected)

                    if (index === 10) {
                        break
                    }
                    index++
                }
            }
        })
        dataSender.sendStat(expected1)
        let writableStream = dataSender.statStream.writableStream
    })

    let server2
    function bindAsyncServer2() {
        server2 = new grpc.Server()
        server2.addService(services.StatService, {
            sendAgentStat: function (call, callback) {
                let statCallCount = 0
                call.on('data', (data) => {
                    const actualTimestamp = data.getAgentstat().getTimestamp()
                    const expectedStat = expectedStats.find((expectedStat) => expectedStat.timestamp === actualTimestamp)
                    t.equal(actualTimestamp, expectedStat.timestamp, `timestamp should be ${expectedStat.timestamp}`)

                    if (expectedStat.timestamp === 110) {
                        t.comment(`expectedStats.length: ${expectedStats.length}, statCallCount: ${statCallCount}`)
                        t.end()
                    }
                    statCallCount++
                })

                // https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/7caf9fb3a650fe7cf7a04c0c65201997874a5f38/examples/src/grpcjs/server.ts#L59
                call.on('end', () => {
                    callback(null, new Empty())
                })
            }
        })
        server2.bindAsync(`localhost:${dataSender.collectorTcpPort}`, grpc.ServerCredentials.createInsecure(), (err) => {
            if (err) {
                t.error(err)
            }
        })
    }

    t.teardown(() => {
        dataSender.close()
        server2.forceShutdown()
    })
})

test('client side stream deadline exceeded Tests', reconnectTestTimeout, function (t) {
    const server = new grpc.Server()
    let serverCount = 0
    server.addService(services.StatService, {
        sendAgentStat: function (call, callback) {
            call.on('data', (data) => {
                serverCount++

                if (serverCount === 2) {
                    const deadline1 = deadlines[0]
                    const deadline2 = deadlines[1]
                    const elapsed = deadline2.getTime() - deadline1.getTime()
                    t.true(elapsed => 2000, `The elapsed time about 2 seconds, elapsed: ${elapsed}`)
                    t.true(elapsed < 3000, `The elapsed time about 2 seconds, elapsed: ${elapsed}`)
                    t.end()
                }
            })
            call.on('end', () => {
                callback(null, new Empty())
            })
        }
    })
    let dataSender
    const deadlines = []
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (err, port) => {
        dataSender = beforeSpecificOne(port, StatOnlyFunctionalTestableDataSource)
        t.equal(dataSender.clientSideStreamDeadlineOptionsBuilder.deadlineSeconds, agent.getConfig().collector.deadlineMinutes * 60, `clientSideStreamDeadlineOptionsBuilder.deadlineSeconds should be ${agent.getConfig().streamDeadlineMinutesClientSide * 60}`)

        dataSender.clientSideStreamDeadlineOptionsBuilder.setSeconds(1)
        dataSender.initializeStatStream()
        let index = 0
        dataSender.statStreamBuilder.setCallback((err) => {
            if (index === 0) {
                t.equal(err.code, grpc.status.DEADLINE_EXCEEDED, `grpc.status.DEADLINE_EXCEEDED ${grpc.status.DEADLINE_EXCEEDED}`)
            }
            if (index > 1) {
                t.equal(err.code, grpc.status.CANCELLED, `grpc.status.CANCELLED ${grpc.status.CANCELLED} index=${index}`)
            }
            index++
        })

        let deadlineCount = 0
        shimmer.wrap(dataSender.clientSideStreamDeadlineOptionsBuilder, 'build', function (original) {
            return function () {
                deadlineCount++
                const result = original.apply(this, arguments)
                const { deadline } = result
                deadlines.push(deadline)
                t.equal(deadlineCount, deadlines.length, `DeadlineCount ${deadlineCount} deadlines ${deadlines.join(',')}`)
                return result
            }
        })

        dataSender.sendStat(agentStatAt(1))

        setTimeout(() => {
            dataSender.sendStat(agentStatAt(2))
        }, 2100)

    })
    t.teardown(() => {
        dataSender.close()
        server.forceShutdown()
    })
})