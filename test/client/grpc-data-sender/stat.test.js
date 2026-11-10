/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const grpc = require('@grpc/grpc-js')
const { TestGrpcDataSenderBuilder, StatAdaptor } = require('../../support/test-grpc-data-sender')
const { ProcessAgentBuilder } = require('../../support/process-agent-builder')
const { setInterval } = require('node:timers/promises')
const shimmer = require('@pinpoint-apm/shimmer')
const express = require('express')
const axios = require('axios')
const http = require('http')
const AgentStatsMonitor = require('../../../lib/metric/agent-stats-monitor')
const { UriStatsSnapshot } = require('../../../lib/metric/uri/uri-stats-snapshot')
const { UriStatsInfo } = require('../../../lib/metric/uri/uri-stats-info-builder')

const reconnectTestTimeout = { timeout: 60 * 1000 }

const TEST_ENV = {
    host: 'localhost',
    port: 5005,
}
const getServerUrl = (path) => `http://${TEST_ENV.host}:${TEST_ENV.port}${path}`

function agentStatAt(timestamp) {
    return { timestamp, collectInterval: 1000, cpu: { user: 0, system: 0 } }
}

test('stat stream reconnects after the collector comes back', reconnectTestTimeout, async function (t) {
    const expected1 = agentStatAt(1)

    const statAdaptor = new StatAdaptor()
    const dataSender = await new TestGrpcDataSenderBuilder()
        .addAdaptor(statAdaptor)
        .build()
    statAdaptor.agentStat(expected1.timestamp).then((pAgentStat) => {
        t.equal(pAgentStat.getTimestamp(), expected1.timestamp, `timestamp should be ${expected1.timestamp}`)
        dataSender.disconnect()
    })

    let expectedStats = []

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
                    restartServer()

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

    function restartServer() {
        const restartedStatAdaptor = new StatAdaptor()
        dataSender.restart(restartedStatAdaptor).catch((error) => {
            t.error(error)
        })
        restartedStatAdaptor.agentStat(110).then(() => {
            const statMessages = restartedStatAdaptor.requests
            statMessages.forEach((statMessage) => {
                const actualTimestamp = statMessage.getAgentstat().getTimestamp()
                const expectedStat = expectedStats.find((expectedStat) => expectedStat.timestamp === actualTimestamp)
                t.equal(actualTimestamp, expectedStat.timestamp, `timestamp should be ${expectedStat.timestamp}`)
            })
            t.comment(`expectedStats.length: ${expectedStats.length}, statCallCount: ${statMessages.length - 1}`)
            t.end()
        })
    }

    t.teardown(() => {
        dataSender.close()
    })
})

test('client side stream deadline exceeded Tests', reconnectTestTimeout, async function (t) {
    const statAdaptor = new StatAdaptor()
    const deadlines = []
    const dataSender = await new TestGrpcDataSenderBuilder()
        .addAdaptor(statAdaptor)
        .build()
    t.teardown(() => {
        dataSender.close()
    })
    statAdaptor.agentStat(2).then(() => {
        const deadline1 = deadlines[0]
        const deadline2 = deadlines[1]
        const elapsed = deadline2.getTime() - deadline1.getTime()
        t.true(elapsed => 2000, `The elapsed time about 2 seconds, elapsed: ${elapsed}`)
        t.true(elapsed < 3000, `The elapsed time about 2 seconds, elapsed: ${elapsed}`)
        t.end()
    })
    t.equal(dataSender.clientSideStreamDeadlineOptionsBuilder.deadlineSeconds, dataSender.config.collector.deadlineMinutes * 60, `clientSideStreamDeadlineOptionsBuilder.deadlineSeconds should be ${dataSender.config.collector.deadlineMinutes * 60}`)

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

test('sendStat', async (t) => {
    const statAdaptor = new StatAdaptor()
    const grpcDataSender = await new TestGrpcDataSenderBuilder()
        .addAdaptor(statAdaptor)
        .build()
    t.teardown(() => {
        grpcDataSender.close()
    })
    const agent = new ProcessAgentBuilder().setDataSender(grpcDataSender.toDataSender()).build()

    const app = new express()
    app.get('/', (req, res) => {
        const agentStatsMonitor = new AgentStatsMonitor(agent.dataSender, agent.getConfig().getAgentId(), agent.agentStartTime)
        const origin = agentStatsMonitor.createStatsInfo
        agentStatsMonitor.createStatsInfo = (...args) => {
            const result = origin.apply(agentStatsMonitor, args)
            const originalHistogram = result.activeTrace.histogramValues()
            res.send('Hello World')

            statAdaptor.agentStat(result.timestamp).then((pAgentStat) => {
                t.equal(statAdaptor.metadata[0].get('servicetype')[0], '1400', 'stat stream metadata servicetype is 1400')
                const actualHistogram = pAgentStat.getActivetrace().getHistogram().getActivetracecountList()
                t.deepEqual(originalHistogram, actualHistogram, 'active trace histogram')

                agentStatsMonitor.shutdown()
                agent.dataSender.close()
                server.close(() => {
                    t.end()
                })
            })
            return result
        }
        agentStatsMonitor.send()
    })

    const server = app.listen(TEST_ENV.port, async () => {
        const result = await axios.get(getServerUrl('/'), { httpAgent: new http.Agent({ keepAlive: false }) })
        t.equal(result.status, 200, 'status code is 200')
    })
})

test('sendStat with UriStatsSnapshot', async (t) => {
    const statAdaptor = new StatAdaptor()
    const grpcDataSender = await new TestGrpcDataSenderBuilder()
        .addAdaptor(statAdaptor)
        .build()
    t.teardown(() => {
        grpcDataSender.close()
    })
    const baseTimestamp = Date.now()
    const snapshot = new UriStatsSnapshot(baseTimestamp, 10)
    snapshot.add(new UriStatsInfo('/foo', true, 0, 50))
    snapshot.add(new UriStatsInfo('/foo', true, 0, 400))
    snapshot.add(new UriStatsInfo('/foo', false, 0, 900))
    snapshot.add(new UriStatsInfo('/bar', true, 0, 50))

    grpcDataSender.sendStat(snapshot)

    const data = await statAdaptor.uriStat(baseTimestamp)
    t.ok(data, 'Should receive data')
    const agentUriStat = data.getAgenturistat()
    t.ok(agentUriStat, 'Should have agentUriStat')
    t.equal(agentUriStat.getBucketversion(), 0, 'Bucket version should be 0')

    const eachList = agentUriStat.getEachuristatList()
    const byUri = Object.fromEntries(eachList.map(each => [each.getUri(), each]))

    const foo = byUri['/foo']
    t.ok(foo, 'foo entry exists')
    t.equal(foo.getTimestamp(), baseTimestamp, 'foo timestamp')
    const fooTotal = foo.getTotalhistogram()
    t.equal(fooTotal.getTotal(), 1350, 'foo total sum')
    t.equal(fooTotal.getMax(), 900, 'foo total max')
    t.deepEqual(fooTotal.getHistogramList(), [1, 0, 1, 1, 0, 0, 0, 0], 'foo total buckets')
    const fooFailed = foo.getFailedhistogram()
    t.equal(fooFailed.getTotal(), 900, 'foo failed sum')
    t.equal(fooFailed.getMax(), 900, 'foo failed max')
    t.deepEqual(fooFailed.getHistogramList(), [0, 0, 0, 1, 0, 0, 0, 0], 'foo failed buckets')

    const bar = byUri['/bar']
    t.ok(bar, 'bar entry exists')
    t.equal(bar.getTimestamp(), baseTimestamp, 'bar timestamp')
    const barTotal = bar.getTotalhistogram()
    t.equal(barTotal.getTotal(), 50, 'bar total sum')
    t.equal(barTotal.getMax(), 50, 'bar total max')
    t.deepEqual(barTotal.getHistogramList(), [1, 0, 0, 0, 0, 0, 0, 0], 'bar total buckets')
    const barFailed = bar.getFailedhistogram()
    t.equal(barFailed.getTotal(), 0, 'bar failed sum')
    t.equal(barFailed.getMax(), 0, 'bar failed max')
    t.deepEqual(barFailed.getHistogramList(), [0, 0, 0, 0, 0, 0, 0, 0], 'bar failed buckets')
    t.end()
})
