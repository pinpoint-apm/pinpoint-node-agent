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

test('span stream retry connection Tests', async function (t) {
    t.plan(20)
    agent.bindHttp()

    const expected1 = spanWithId('1')

    const server = new grpc.Server()
    server.addService(services.SpanService, {
        sendSpan: function (call, callback) {
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
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (err, port) => {
        dataSender = beforeSpecificOne(port, SpanOnlyFunctionalTestableDataSource)

        let callCount = 0
        dataSender.spanStreamBuilder.setCallback((err, response) => {
            callCount++
            if (callCount === 1) {
                t.equal(err.code, grpc.status.CANCELLED, `gRPC server is shut down, so the error code should be ${grpc.status.CANCELLED}`)
            } else if (callCount === 2) {
                t.equal(err.code, grpc.status.UNAVAILABLE, `gRPC server was shut down, so the error code should be ${grpc.status.UNAVAILABLE}`)
                t.equal(callCount - 1, 1, `Grpc Readable stream try to retry connection 1st time`)
            } else if (callCount === 3) {
                t.equal(err.code, grpc.status.UNAVAILABLE, `gRPC server was shut down, so the error code should be ${grpc.status.UNAVAILABLE}`)
                t.equal(callCount - 1, 2, `Grpc Readable stream try to retry connection 2nd time`)
                process.nextTick(() => {
                    bindAsyncServer2()
                })
            } else if (callCount === 4) {
                t.true(response, '4th service method response should be new Empty()')
            }
        })
        dataSender.sendSpan(expected1)

        dataSender.spanStream.writableStream.on('close', () => {
            t.false(dataSender.spanStream.writableStream.writable, `If the stream is errored, the stream should be closed and not writable`)
        })
        dataSender.spanStream.writableStream.on('unpipe', () => {
            t.false(dataSender.spanStream.writableStream.writable, `If the stream is errored, the stream should be unpipe and not writable`)
        })
    })


    const expected2 = spanWithId('2')
    const expected3 = spanWithId('3')
    let server2
    function bindAsyncServer2() {
        server2 = new grpc.Server()
        server2.addService(services.SpanService, {
            sendSpan: function (call, callback) {
                let spanCallCount = 0
                call.on('data', (data) => {
                    spanCallCount++
                    if (spanCallCount === 1) {
                        const actualSpan = data.getSpan()
                        t.equal(actualSpan.getSpanid(), expected2.traceRoot.getTraceId().getSpanId(), `spanId should be '${expected3.traceRoot.getTraceId().getSpanId()}'`)
                        t.equal(actualSpan.getTransactionid().getAgentid(), agent.getAgentInfo().getAgentId(), `agentId should be ${agent.getAgentInfo().getAgentId()}`)
                        t.equal(actualSpan.getTransactionid().getAgentstarttime(), expected2.traceRoot.getTraceId().getAgentStartTime(), `agentStartTime should be '${expected3.traceRoot.getTraceId().getAgentStartTime()}'`)
                        t.equal(actualSpan.getTransactionid().getSequence(), expected2.traceRoot.getTraceId().getTransactionId(), `transactionId should be '${expected2.traceRoot.getTraceId().getTransactionId()}'`)

                    } else if (spanCallCount === 2) {
                        const actualSpan = data.getSpan()
                        t.equal(actualSpan.getSpanid(), expected3.traceRoot.getTraceId().getSpanId(), `spanId should be '${expected3.traceRoot.getTraceId().getSpanId()}'`)
                        t.equal(actualSpan.getTransactionid().getAgentid(), agent.getAgentInfo().getAgentId(), `agentId should be ${agent.getAgentInfo().getAgentId()}`)
                        t.equal(actualSpan.getTransactionid().getAgentstarttime(), expected3.traceRoot.getTraceId().getAgentStartTime(), `agentStartTime should be '${expected3.traceRoot.getTraceId().getAgentStartTime()}'`)
                        t.equal(actualSpan.getTransactionid().getSequence(), expected3.traceRoot.getTraceId().getTransactionId(), `transactionId should be '${expected3.traceRoot.getTraceId().getTransactionId()}'`)
                        dataSender.spanStream.end()
                    }
                })

                // https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/7caf9fb3a650fe7cf7a04c0c65201997874a5f38/examples/src/grpcjs/server.ts#L59
                call.on('end', () => {
                    callback(null, new Empty())
                })
            }
        })
        server2.bindAsync(`localhost:${dataSender.collectorTcpPort}`, grpc.ServerCredentials.createInsecure(), (err) => {
            setTimeout(() => {
                dataSender.sendSpan(expected2)
                dataSender.sendSpan(expected3)
            }, 1000)
        })
    }

    t.teardown(() => {
        dataSender.close()
        server2.forceShutdown()
    })
})
