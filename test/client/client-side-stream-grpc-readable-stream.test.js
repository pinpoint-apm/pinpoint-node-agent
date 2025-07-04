/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const grpc = require('@grpc/grpc-js')
const { beforeSpecificOne, SpanOnlyFunctionalTestableDataSource, spanWithId } = require('./grpc-fixture')
const agent = require('../support/agent-singleton-mock')
const services = require('../../lib/data/v1/Service_grpc_pb')
const { Empty } = require('google-protobuf/google/protobuf/empty_pb')
const {
    setInterval,
} = require('node:timers/promises')
const shimmer = require('@pinpoint-apm/shimmer')

test('span stream retry connection Tests', async function (t) {
    agent.bindHttp()

    const expected1 = spanWithId('1')

    const server = new grpc.Server()
    server.addService(services.SpanService, {
        sendSpan: function (call) {
            let spanCallCount = 0
            call.on('data', (data) => {
                spanCallCount++

                if (spanCallCount === 1) {
                    const actualSpan = data.getSpan()
                    t.equal(actualSpan.getSpanid(), expected1.traceRoot.getTraceId().getSpanId(), `spanId should be '${expected1.traceRoot.getTraceId().getSpanId()}'`)
                    t.equal(actualSpan.getTransactionid().getAgentid(), agent.getAgentInfo().getAgentId(), `agentId should be ${agent.getAgentInfo().getAgentId()}`)
                    t.equal(actualSpan.getTransactionid().getAgentstarttime(), expected1.traceRoot.getTraceId().getAgentStartTime(), `agentStartTime should be '${expected1.traceRoot.getTraceId().getAgentStartTime()}'`)
                    t.equal(actualSpan.getTransactionid().getSequence(), expected1.traceRoot.getTraceId().getTransactionId(), `transactionId should be '${expected1.traceRoot.getTraceId().getTransactionId()}'`)

                    server.forceShutdown()
                }
            })
        }
    })

    let dataSender
    let expectedSpans = []
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (err, port) => {
        dataSender = beforeSpecificOne(port, SpanOnlyFunctionalTestableDataSource)

        let callCount = 0
        dataSender.spanStreamBuilder.setCallback(async (err) => {
            callCount++
            if (callCount === 1) {
                t.equal(err.code, grpc.status.CANCELLED, `gRPC server is shut down, so the error code should be ${grpc.status.CANCELLED}`)

                dataSender.spanStream.writableStream.on('close', () => {
                    t.false(dataSender.spanStream.writableStream.writable, `If the stream is errored, the stream should be closed and not writable`)
                })
                dataSender.spanStream.writableStream.on('unpipe', () => {
                    t.false(dataSender.spanStream.writableStream.writable, `If the stream is errored, the stream should be unpipe and not writable`)
                })
                t.equal(writableStream, dataSender.spanStream.writableStream, `No change writableStream when gRPC server is shut down`)
                t.equal(writableStream.backoffRetry.attempts, 0, `retry connection is not started in callback`)
            } else if (callCount === 2) {
                t.equal(err.code, grpc.status.UNAVAILABLE, `gRPC server was shut down, so the error code should be ${grpc.status.UNAVAILABLE}`)
                t.equal(callCount - 1, 1, `1st time retry connection `)

                dataSender.spanStream.writableStream.on('close', () => {
                    t.true(dataSender.spanStream.writableStream.writableStream.writableEnded, `If the 1st retry created stream is errored, the stream should be closed and writableEnded`)
                })
                dataSender.spanStream.writableStream.on('unpipe', () => {
                    t.true(dataSender.spanStream.writableStream.writableStream.writableEnded, `If the 1st retry created stream is errored, the stream should be unpipe and writableEnded`)
                })
                t.equal(writableStream, dataSender.spanStream.writableStream, `No change writableStream when 1st retry error`)
                t.equal(writableStream.backoffRetry.attempts, 1, `1st retry connection is failed`)
            } else if (callCount === 3) {
                t.equal(err.code, grpc.status.UNAVAILABLE, `gRPC server was shut down, so the error code should be ${grpc.status.UNAVAILABLE}`)
                t.equal(callCount - 1, 2, `2nd time retry connection `)

                dataSender.spanStream.writableStream.on('close', () => {
                    t.true(dataSender.spanStream.writableStream.writableStream.writableEnded, `2nd retry created stream is errored, writableEnded on close event`)
                })
                dataSender.spanStream.writableStream.on('unpipe', () => {
                    t.true(dataSender.spanStream.writableStream.writableStream.writableEnded, `2nd retry created stream is errored, writableEnded = true on unpipe event`)
                })
                t.equal(writableStream, dataSender.spanStream.writableStream, `No change writableStream when 2nd retry error`)
                t.equal(writableStream.backoffRetry.attempts, 2, `2nd retry connection is failed`)
            } else if (callCount === 4) {
                t.equal(err.code, grpc.status.UNAVAILABLE, `gRPC server was shut down, so the error code should be ${grpc.status.UNAVAILABLE}`)
                t.equal(callCount - 1, 3, `3rd time retry connection`)

                dataSender.spanStream.writableStream.on('close', () => {
                    t.true(dataSender.spanStream.writableStream.writableStream.writableEnded, `3rd retry created stream is errored, writableEnded = true on close event`)
                })
                dataSender.spanStream.writableStream.on('unpipe', () => {
                    t.true(dataSender.spanStream.writableStream.writableStream.writableEnded, `3rd retry created stream is errored, writableEnded = true on unpipe event`)
                })
                t.equal(writableStream, dataSender.spanStream.writableStream, `No change writableStream when 3rd retry error`)
                t.equal(writableStream.backoffRetry.attempts, 3, `3rd retry connection is failed`)

                let index = 0
                for await (const spanStreamWritableEnded of setInterval(1000, dataSender.spanStream.writableStream.ended)) {
                    if (index === 0) {
                        t.true(spanStreamWritableEnded, `writableEnded = true, When 1st sendSpan call in for loop`)
                        bindAsyncServer2()

                        shimmer.wrap(dataSender.spanStream, 'pipeWritableStream', function (original) {
                            return function () {
                                if (index === 0) {
                                    t.true(dataSender.spanStream.writableStream.shouldCreateNewStream(), `availableRetry = true, index=${index}`)
                                    t.equal(dataSender.spanStream.writableStream.backoffRetry.attempts, 4, `backoffRetry.attempts: ${dataSender.spanStream.writableStream.backoffRetry.attempts}, index=${index}`)
                                }
                                original.apply(this, arguments)
                                if (index === 0) {
                                    t.false(dataSender.spanStream.writableStream.shouldCreateNewStream(), `availableRetry = false, index=${index} after pipeWritableStream() call`)
                                    t.notEqual(writableStream, dataSender.spanStream.writableStream, `new GrpcReadableStream.writableStream, index=${index} after pipeWritableStream() call`)
                                    writableStream = dataSender.spanStream.writableStream
                                }
                            }
                        })
                    }

                    const expected = spanWithId(`1${index}`)
                    expectedSpans.push(expected)
                    dataSender.sendSpan(expected)

                    if (index === 10) {
                        break
                    }
                    index++
                }
            }
        })
        dataSender.sendSpan(expected1)
        let writableStream = dataSender.spanStream.writableStream
    })

    let server2
    function bindAsyncServer2() {
        server2 = new grpc.Server()
        server2.addService(services.SpanService, {
            sendSpan: function (call, callback) {
                let spanCallCount = 0
                call.on('data', (data) => {
                    const actualSpan = data.getSpan()
                    const expectedSpan = expectedSpans.find((expectedSpan) => expectedSpan.traceRoot.getTraceId().getSpanId() === actualSpan.getSpanid())
                    t.equal(actualSpan.getSpanid(), expectedSpan.traceRoot.getTraceId().getSpanId(), `spanId should be '${expectedSpan.traceRoot.getTraceId().getSpanId()}'`)
                    t.equal(actualSpan.getTransactionid().getAgentid(), agent.getAgentInfo().getAgentId(), `agentId should be ${agent.getAgentInfo().getAgentId()}`)
                    t.equal(actualSpan.getTransactionid().getAgentstarttime(), expectedSpan.traceRoot.getTraceId().getAgentStartTime(), `agentStartTime should be '${expectedSpan.traceRoot.getTraceId().getAgentStartTime()}'`)
                    t.equal(actualSpan.getTransactionid().getSequence(), expectedSpan.traceRoot.getTraceId().getTransactionId(), `transactionId should be '${expectedSpan.traceRoot.getTraceId().getTransactionId()}'`)

                    if (expectedSpan.traceRoot.getTraceId().getTransactionId() === '110') {
                        // t.equal(dataSender.spanStream.writableStream.backoffRetry.attempts, 3, `backoffRetry.attempts: ${dataSender.spanStream.writableStream.backoffRetry.attempts}`)
                        t.comment(`expectedSpans.length: ${expectedSpans.length}, spanCallCount: ${spanCallCount}`)
                        t.end()
                    }
                    spanCallCount++
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

test('client side stream deadline exceeded Tests', function (t) {
    const server = new grpc.Server()
    let serverCount = 0
    server.addService(services.SpanService, {
        sendSpan: function (call, callback) {
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
        dataSender = beforeSpecificOne(port, SpanOnlyFunctionalTestableDataSource)
        t.equal(dataSender.clientSideStreamDeadlineOptionsBuilder.deadlineSeconds, agent.config.streamDeadlineMinutesClientSide * 60, `clientSideStreamDeadlineOptionsBuilder.deadlineSeconds should be ${agent.config.streamDeadlineMinutesClientSide * 60}`)

        dataSender.clientSideStreamDeadlineOptionsBuilder.setSeconds(1)
        dataSender.initializeSpanStream()
        let index = 0
        dataSender.spanStreamBuilder.setCallback((err) => {
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

        let expected = spanWithId(`1`)
        dataSender.sendSpan(expected)

        setTimeout(() => {
            expected = spanWithId(`2`)
            dataSender.sendSpan(expected)
        }, 2100)

    })
    t.teardown(() => {
        dataSender.close()
        server.forceShutdown()
    })
})