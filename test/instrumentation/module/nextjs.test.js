/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const path = require('path')
const { startMySql } = require('../../support/shared-containers')
const testAppDir = path.join(__dirname, '../../fixtures/nextjs-app-router')
const fs = require('fs')
const ServiceType = require('../../../lib/context/service-type')
const mysqlExecuteQueryServiceType = require('../../../lib/instrumentation/module/mysql/mysql-execute-query-service-type')
const net = require('node:net')
const { once } = require('node:events')
const grpc = require('@grpc/grpc-js')
const services = require('../../../lib/data/v1/Service_grpc_pb')
const { Empty } = require('google-protobuf/google/protobuf/empty_pb')
const SpanProto = require('../../../lib/data/v1/Span_pb')
const StatProto = require('../../../lib/data/v1/Stat_pb')
const CmdProto = require('../../../lib/data/v1/Cmd_pb')
const AnnotationKey = require('../../../lib/constant/annotation-key')
const { sendRequestOverRawSocket } = require('../../support/raw-http-client')
const { ParentTraceHeader } = require('../../fixtures/parent-trace-header')
const { User } = require('../../support/user')

let container
let spanCollector
let spanCollectorPort
let receivedSpans = []
let receivedSpanChunks = []
let receivedStats = []
let receivedExceptionMetaData = []
let nextServerStdout = ''
test('setup', async (t) => {
    container = await startMySql()
    t.pass('setup complete')
    t.end()
})

test('setup: start span collector', (t) => {
    spanCollector = new grpc.Server()
    spanCollector.addService(services.SpanService, {
        sendSpanBatch: function (call, callback) {
            call.request.getSpanList().forEach((spanMessage) => {
                const span = spanMessage.getSpan()
                if (span) {
                    receivedSpans.push(span)
                }
                const spanChunk = spanMessage.getSpanchunk()
                if (spanChunk) {
                    receivedSpanChunks.push(spanChunk)
                }
            })
            callback(null, new SpanProto.PSpanResultBatch())
        }
    })

    const okResult = new SpanProto.PResult()
    okResult.setResult?.(0)

    spanCollector.addService(services.AgentService, {
        requestAgentInfo: (call, callback) => {
            callback?.(null, okResult)
        },
        pingSession: (call) => {
            call.on('data', (ping) => {
                if (ping instanceof StatProto.PPing) {
                    call.write(ping)
                }
            })
            call.on('end', () => call.end())
        }
    })

    spanCollector.addService(services.MetadataService, {
        requestSqlMetaData: (call, callback) => callback?.(null, okResult),
        requestSqlUidMetaData: (call, callback) => callback?.(null, okResult),
        requestApiMetaData: (call, callback) => callback?.(null, okResult),
        requestStringMetaData: (call, callback) => callback?.(null, okResult),
        requestExceptionMetaData: (call, callback) => {
            receivedExceptionMetaData.push(call.request)
            callback?.(null, okResult)
        },
    })

    spanCollector.addService(services.StatService, {
        sendAgentStat: function (call, callback) {
            call.on('data', (statMessage) => {
                receivedStats.push(statMessage)
            })
            call.on('end', () => callback(null, new Empty()))
        }
    })

    spanCollector.addService(services.ProfilerCommandServiceService, {
        handleCommand: (call) => {
            call.on('data', (msg) => {
                if (msg instanceof CmdProto.PCmdMessage) {
                    const res = new CmdProto.PCmdRequest()
                    res.setRequestid?.(msg.getRequestid?.())
                    call.write(res)
                }
            })
            call.on('end', () => call.end())
        },
        handleCommandV2: (call) => {
            call.on('data', (msg) => {
                if (msg instanceof CmdProto.PCmdMessage) {
                    const res = new CmdProto.PCmdRequest()
                    res.setRequestid?.(msg.getRequestid?.())
                    call.write(res)
                }
            })
            call.on('end', () => call.end())
        },
        commandEcho: (call, callback) => callback?.(null, new Empty()),
        commandStreamActiveThreadCount: (call, callback) => callback?.(null, new Empty()),
        commandActiveThreadDump: (call, callback) => callback?.(null, new Empty()),
        commandActiveThreadLightDump: (call, callback) => callback?.(null, new Empty()),
    })

    spanCollector.bindAsync('127.0.0.1:0', grpc.ServerCredentials.createInsecure(), (err, port) => {
        if (err) {
            t.fail(err.message)
            return
        }
        spanCollectorPort = port
        t.pass(`span collector listening on ${port}`)
        t.end()
    })
})

// ref: https://github.com/elastic/apm-agent-nodejs/blob/main/test/instrumentation/modules/next/next.test.js
const haveNodeModules = fs.existsSync(
    path.join(testAppDir, 'node_modules', '.bin', 'next'),
)
test(`setup: npm ci (in ${testAppDir})`, { skip: haveNodeModules }, (t) => {
    const { execSync } = require('child_process')
    try {
        execSync('npm ci', {
            cwd: testAppDir,
            stdio: 'inherit',
        })
        t.pass('npm ci complete')
    } catch (err) {
        t.fail(err.message)
    }
    t.end()
})

let nextServerProcess
test('Next.JS Production Server start', (suite) => {
    suite.test('setup: npm run build', (t) => {
        const { execSync } = require('child_process')
        try {
            execSync('npm run build', {
                cwd: testAppDir,
                stdio: 'inherit',
                env: {
                    PATH: process.env.PATH,
                    DB_HOST: container.getHost(),
                    DB_PORT: container.getPort(3306),
                    DB_USER: container.getUsername(),
                    DB_PASSWORD: container.getUserPassword(),
                },
            })
            t.pass('npm run build complete')
        } catch (err) {
            t.fail(err.message)
        }
        t.end()
    })

    suite.test('setup: start Next.js prod server (next start)', (t) => {
        const { spawn } = require('child_process')
        nextServerProcess = spawn(
            path.normalize('./node_modules/.bin/next'),
            ['start', '-H', '127.0.0.1'],
            {
                cwd: testAppDir,
                env: Object.assign({}, process.env, {
                    PINPOINT_FEATURES_URI_STATS_USE_USER_INPUT: 'true',
                    NODE_OPTIONS: '-r ../../../index.js -r ../../support/request-store-probe-preload.js',
                    NODE_ENV: 'production',
                    DB_HOST: container.getHost(),
                    DB_PORT: container.getPort(3306),
                    DB_USER: container.getUsername(),
                    DB_PASSWORD: container.getUserPassword(),
                    NEXT_TELEMETRY_DISABLED: '1',
                    PINPOINT_APPLICATION_NAME: 'nextjs.test.js',
                    PINPOINT_SERVICE_NAME: 'next.js.service',
                    PINPOINT_SERVICE_TYPE: '1600',
                    PINPOINT_COLLECTOR_IP: '127.0.0.1',
                    PINPOINT_COLLECTOR_SPAN_PORT: String(spanCollectorPort),
                    PINPOINT_COLLECTOR_STAT_PORT: String(spanCollectorPort),
                    PINPOINT_COLLECTOR_TCP_PORT: String(spanCollectorPort),
                    PINPOINT_SAMPLING_RATE: '1',
                    PINPOINT_FEATURES_URI_STATS_TIME_WINDOW: '1000'
                }),
            }
        )
        nextServerProcess.on('error', (err) => {
            t.error(err, 'no error from next server')
        })
        nextServerProcess.stdout.on('data', (data) => {
            nextServerStdout += data
            t.comment('next server stdout: ' + formatForTComment(data))
        })
        nextServerProcess.stderr.on('data', (data) => {
            t.comment('next server stderr: ' + formatForTComment(data))
        })

        waitForNextServerReady(nextServerProcess, (error) => {
            if (error) {
                t.fail(error.message)
                if (nextServerProcess) {
                    nextServerProcess.kill()
                }
            } else {
                t.pass('next server started')
            }
            t.end()
        })
    })
})

test('fetch http://127.0.0.1:3000/', async (t) => {
    receivedSpans = []
    receivedStats = []
    try {
        const res = await fetch('http://127.0.0.1:3000/')
        t.equal(res.status, 200, '/ responds with 200')

        const span = await waitForSpan((span) => span.getAcceptevent()?.getRpc() === '/')
        t.ok(span, 'received span from Next.js request')
        t.equal(span.getAcceptevent().getRpc(), '/', 'rpc should be root path')

        await new Promise(resolve => setTimeout(resolve, 3000))

        const uriStats = receivedStats.flatMap(stat => {
            const agentUriStat = stat.getAgenturistat ? stat.getAgenturistat() : null
            if (agentUriStat) {
                return agentUriStat.getEachuristatList().map(each => each.getUri())
            }
            return []
        })

        t.comment(`Received URI Stats count: ${uriStats.length}`)
        if (uriStats.length > 0) {
            t.fail(`Uri stats should not be recorded for Next.js (found: ${uriStats})`)
        } else {
            t.pass('Uri stats was not recorded as expected')
        }
    } catch (err) {
        t.fail(err.message)
    }
    t.end()
})

test('Next.js: the gRPC resources that send the request data do not take the request store', async (t) => {
    receivedSpans = []
    const response = await fetch('http://127.0.0.1:3000/')
    t.equal(response.status, 200, '/ responds with 200')

    const span = await waitForSpan((s) => s.getAcceptevent()?.getRpc() === '/')
    t.ok(span, 'received span from Next.js request')
    const probeLines = nextServerStdout.split('\n').filter(line => line.includes('request-store-probe:'))
    t.deepEqual(probeLines, [], 'no HTTP/2 resource is created with the request store')
    t.end()
})

test('fetch /api/custom-uri', async (t) => {
    receivedSpans = []
    receivedStats = []
    try {
        const response = await fetch('http://127.0.0.1:3000/api/custom-uri')
        t.equal(response.status, 200, '/api/custom-uri responds with 200')

        const span = await waitForSpan((s) => {
            const rpc = s.getAcceptevent()?.getRpc()
            return rpc && rpc.includes('/api/custom-uri')
        }, 10000)

        t.ok(span, 'received span for custom uri request')

        await new Promise(resolve => setTimeout(resolve, 3000))

        const uriStats = receivedStats.flatMap(stat => {
            const agentUriStat = stat.getAgenturistat ? stat.getAgenturistat() : null
            if (agentUriStat) {
                return agentUriStat.getEachuristatList().map(each => each.getUri())
            }
            return []
        })

        t.comment(`Received URI Stats count: ${uriStats.length}`)
        if (uriStats.length > 0) {
            t.ok(uriStats.includes('/user/input/uri/from/pages'), 'should record /user/input/uri/from/pages in uri stats')
        } else {
            t.fail('Uri stats should be recorded')
        }
    } catch (err) {
        t.fail(err.message)
    }
    t.end()
})

test('fetch /api/custom-uri with pinpoint-sampled:s0 should skip span', async (t) => {
    receivedSpans = []
    receivedStats = []
    try {
        const response = await fetch('http://127.0.0.1:3000/api/custom-uri', {
            headers: {
                'pinpoint-sampled': 's0'
            }
        })
        t.equal(response.status, 200, '/api/custom-uri with s0 responds with 200')

        const customUriSpans = receivedSpans.filter((s) => {
            const rpc = s.getAcceptevent()?.getRpc()
            return rpc && rpc.includes('/api/custom-uri')
        })
        t.equal(customUriSpans.length, 0, 'should not record span when pinpoint-sampled is s0')

        await new Promise(resolve => setTimeout(resolve, 3000))
        const uriStats = getCollectedUriStats()
        const hasCustomUriStat = uriStats.some((uri) => {
            return uri === '/user/input/uri/from/pages' || uri === 'GET /user/input/uri/from/pages'
        })
        t.ok(uriStats.length === 0 || hasCustomUriStat,
            'uri stats may be skipped or recorded depending on timing, but must not break DisableTrace path')
    } catch (err) {
        t.fail(err.message)
    }
    t.end()
})

test('fetch /api/error-500 should record span error and failure in URI stats', async (t) => {
    receivedSpans = []
    receivedStats = []
    try {
        const response = await fetch('http://127.0.0.1:3000/api/error-500')
        t.equal(response.status, 500, '/api/error-500 responds with 500')

        const span = await waitForSpan((s) => {
            const rpc = s.getAcceptevent()?.getRpc()
            return rpc && rpc.includes('/api/error-500')
        }, 10000)

        t.ok(span, 'received span for error request')
        t.equal(span.getErr(), 1, 'span should be marked as error')

        const annotations = span.getAnnotationList()
        const statusCodeAnnotation = annotations.find(ann => ann.getKey() === AnnotationKey.HTTP_STATUS_CODE.getCode())

        t.ok(statusCodeAnnotation, 'should have HTTP status code annotation')
        if (statusCodeAnnotation) {
            t.equal(statusCodeAnnotation.getValue().getIntvalue(), 500, 'status code annotation value should be 500')
        }

        await new Promise(resolve => setTimeout(resolve, 3000))

        const mergedStats = {}
        receivedStats.forEach(statMsg => {
            const agentUriStat = statMsg.getAgenturistat ? statMsg.getAgenturistat() : null
            if (agentUriStat) {
                agentUriStat.getEachuristatList().forEach(each => {
                    const uri = each.getUri()
                    if (!mergedStats[uri]) {
                        mergedStats[uri] = {
                            totalBuckets: new Array(8).fill(0),
                            failedBuckets: new Array(8).fill(0)
                        }
                    }
                    const totalHistList = each.getTotalhistogram().getHistogramList()
                    totalHistList.forEach((count, idx) => mergedStats[uri].totalBuckets[idx] += count)

                    const failedHistList = each.getFailedhistogram().getHistogramList()
                    failedHistList.forEach((count, idx) => mergedStats[uri].failedBuckets[idx] += count)
                })
            }
        })

        const errorUri = '/user/input/uri/error-500'
        const stat = mergedStats[errorUri]
        t.ok(stat, `URI stats found for ${errorUri}`)
        if (stat) {
            const totalCount = stat.totalBuckets.reduce((acc, val) => acc + val, 0)
            t.equal(totalCount, 1, 'Total count should be 1')

            const failedCount = stat.failedBuckets.reduce((acc, val) => acc + val, 0)
            t.equal(failedCount, 1, 'Failed count should be 1')
        }
    } catch (err) {
        t.fail(err.message)
    }
    t.end()
})

test('Next.js: a fetch() that fails in an API route sends the ExceptionMetaData of its async child trace', async (t) => {
    receivedSpans = []
    receivedExceptionMetaData = []
    const closedServer = net.createServer().listen(0)
    await once(closedServer, 'listening')
    const closedPort = closedServer.address().port
    await new Promise(resolve => closedServer.close(resolve))

    const response = await fetch(`http://127.0.0.1:3000/api/fetch-closed-port?port=${closedPort}`)
    t.equal(response.status, 502, 'the API route responds 502 after the fetch() fails')

    const span = await waitForSpan((s) => s.getAcceptevent()?.getRpc()?.includes('/api/fetch-closed-port'), 10000)
    const exceptionMetaData = await waitForExceptionMetaData((e) => e.getTransactionid().getSequence() === span.getTransactionid().getSequence(), 10000)
    const actualExceptionMetaDataList = receivedExceptionMetaData.filter((e) => e.getTransactionid().getSequence() === span.getTransactionid().getSequence())
    t.equal(actualExceptionMetaDataList.length, 1, 'one ExceptionMetaData for the request')
    t.equal(exceptionMetaData.getTransactionid().getAgentid(), span.getTransactionid().getAgentid(), 'ExceptionMetaData has the agent id of the request')
    t.equal(exceptionMetaData.getSpanid(), span.getSpanid(), 'ExceptionMetaData has the span id of the request')
    const actualExceptions = exceptionMetaData.getExceptionsList()
    t.equal(actualExceptions.length, 3, 'ExceptionMetaData has the AggregateError and its two connect errors')
    t.equal(actualExceptions[0].getExceptionclassname(), 'AggregateError', 'the undici request error of the fetch() is an AggregateError')
    t.deepEqual(actualExceptions.slice(1).map(exception => exception.getExceptionmessage()).sort(), [`connect ECONNREFUSED 127.0.0.1:${closedPort}`, `connect ECONNREFUSED ::1:${closedPort}`], 'then the two connect errors in AggregateError.errors, one per localhost address')
    t.notEqual(actualExceptions[1].getExceptionid(), actualExceptions[0].getExceptionid(), 'a connect error has its own exceptionId')
    t.equal(exceptionMetaData.getUritemplate(), 'NULL', 'ExceptionMetaData uriTemplate is NULL because the user input uriTemplate is recorded when the response ends, after the async child trace closed')
    t.end()
})

test('Next.js: an outgoing http.request() that fails in an API route records the error in its async child trace', async (t) => {
    receivedSpans = []
    receivedSpanChunks = []
    receivedExceptionMetaData = []
    const closedServer = net.createServer().listen(0)
    await once(closedServer, 'listening')
    const closedPort = closedServer.address().port
    await new Promise(resolve => closedServer.close(resolve))

    const target = `http://localhost:${closedPort}/`
    const response = await fetch(`http://127.0.0.1:3000/api/parent-service-name?target=${encodeURIComponent(target)}`)
    t.equal(response.status, 500, 'the API route responds 500 after the http.request() fails')

    const span = await waitForSpan((s) => s.getAcceptevent()?.getRpc()?.includes('/api/parent-service-name'), 10000)
    const httpRequestSpanEvent = span.getSpaneventList().find((spanEvent) => spanEvent.getServicetype() === ServiceType.asyncHttpClientInternal.getCode())
    const actualSpanChunk = await waitForSpanChunk((spanChunk) => spanChunk.getLocalasyncid()?.getAsyncid() === httpRequestSpanEvent.getAsyncevent(), 10000)
    t.equal(actualSpanChunk.getLocalasyncid().getSequence(), 1, 'the SpanChunk localAsyncId is the asyncEvent of the http.request span event with sequence 1')
    const actualHttpClientSpanEvent = actualSpanChunk.getSpaneventList().find((spanEvent) => spanEvent.getServicetype() === ServiceType.asyncHttpClient.getCode())
    t.ok(actualHttpClientSpanEvent.getExceptioninfo(), 'the asyncHttpClient span event of the SpanChunk has the exceptionInfo')

    await waitForExceptionMetaData((e) => e.getTransactionid().getSequence() === span.getTransactionid().getSequence(), 10000)
    const actualExceptionMetaDataList = receivedExceptionMetaData.filter((e) => e.getTransactionid().getSequence() === span.getTransactionid().getSequence())
    t.equal(actualExceptionMetaDataList.length, 1, 'one ExceptionMetaData for the request')
    const actualExceptions = actualExceptionMetaDataList[0].getExceptionsList()
    t.equal(actualExceptions.length, 3, 'ExceptionMetaData has the AggregateError and its two connect errors')
    t.equal(actualExceptions[0].getExceptionclassname(), 'AggregateError', 'the http.request() error is an AggregateError')
    t.equal(actualExceptions[0].getStacktraceelementList()[0].getFilename(), 'node:net', 'the first frame of the AggregateError is in node:net')
    t.true(actualExceptions[0].getStacktraceelementList()[0].getLinenumber() > 0, 'the first frame of the AggregateError has its line number')
    t.deepEqual(actualExceptions.slice(1).map(exception => exception.getExceptionmessage()).sort(), [`connect ECONNREFUSED 127.0.0.1:${closedPort}`, `connect ECONNREFUSED ::1:${closedPort}`], 'then the two connect errors in AggregateError.errors, one per localhost address')
    t.notEqual(actualExceptions[1].getExceptionid(), actualExceptions[0].getExceptionid(), 'a connect error has its own exceptionId')
    t.end()
})

test('Next.js: a mysql2 query that fails in an API route records the error on the Asynchronous Invocation of its query callback', async (t) => {
    receivedSpans = []
    receivedSpanChunks = []
    receivedExceptionMetaData = []
    const response = await fetch('http://127.0.0.1:3000/api/mysql-error')
    t.equal(response.status, 500, 'the API route responds 500 after the query fails')

    const span = await waitForSpan((s) => s.getAcceptevent()?.getRpc()?.includes('/api/mysql-error'), 10000)
    const querySpanEvent = span.getSpaneventList().find((spanEvent) => spanEvent.getServicetype() === mysqlExecuteQueryServiceType.getCode())
    t.notOk(querySpanEvent.getExceptioninfo(), 'the query span event has no error, because the query returns before its result')
    const callbackSpanChunk = await waitForSpanChunk((spanChunk) => spanChunk.getLocalasyncid()?.getAsyncid() === querySpanEvent.getAsyncevent(), 10000)
    const asyncInvocationSpanEvent = callbackSpanChunk.getSpaneventList().find((spanEvent) => spanEvent.getServicetype() === ServiceType.async.getCode())
    t.ok(asyncInvocationSpanEvent.getExceptioninfo(), 'the Asynchronous Invocation span event of the query callback has the error of the failed query')

    await waitForExceptionMetaData((e) => e.getTransactionid().getSequence() === span.getTransactionid().getSequence(), 10000)
    const actualExceptionMetaDataList = receivedExceptionMetaData.filter((e) => e.getTransactionid().getSequence() === span.getTransactionid().getSequence())
    t.equal(actualExceptionMetaDataList.length, 1, 'one ExceptionMetaData for the request')
    const actualExceptions = actualExceptionMetaDataList[0].getExceptionsList()
    t.equal(actualExceptions.length, 1, 'ExceptionMetaData has one exception')
    t.equal(actualExceptions[0].getExceptionmessage(), "Table 'test.no_such_table' doesn't exist", 'ExceptionMetaData exception is the error of the failed query')
    t.equal(actualExceptionMetaDataList[0].getUritemplate(), 'NULL', 'ExceptionMetaData uriTemplate is NULL because the user input uriTemplate is recorded when the response ends, after the async child trace closed')
    t.end()
})

test('Next.js: an API route records the fetch() before and after its first await at depth 1, with no route span event', async (t) => {
    receivedSpans = []
    const http = require('http')
    const targetServer = http.createServer((req, res) => res.end('target')).listen(0)
    await once(targetServer, 'listening')
    const target = `http://localhost:${targetServer.address().port}/`

    const response = await fetch(`http://127.0.0.1:3000/api/fetch-after-await?target=${encodeURIComponent(target)}`)
    t.equal(response.status, 200, 'the API route responds 200 after the two fetch() calls')
    const span = await waitForSpan((s) => s.getAcceptevent()?.getRpc()?.includes('/api/fetch-after-await'), 10000)
    targetServer.close()

    const spanEvents = span.getSpaneventList()
    t.equal(spanEvents.length, 2, 'the PSpan has only the two fetch() span events, with no route span event')
    const [fetchA, fetchB] = spanEvents
    t.equal(fetchA.getServicetype(), ServiceType.asyncHttpClientInternal.getCode(), 'fetch a is the fetch() before the first await')
    t.equal(fetchA.getDepth(), 1, 'fetch a is at depth 1')
    t.equal(fetchB.getServicetype(), ServiceType.asyncHttpClientInternal.getCode(), 'fetch b is the fetch() after the first await')
    t.equal(fetchB.getDepth(), 1, 'fetch b is at depth 1')
    t.end()
})

test('Next.js: a fetch() in an API route records the URL with its path in its http.request span event', async (t) => {
    receivedSpans = []
    receivedSpanChunks = []
    const http = require('http')
    const targetServer = http.createServer((req, res) => res.end('target')).listen(0)
    await once(targetServer, 'listening')
    const targetPort = targetServer.address().port
    const target = `http://127.0.0.1:${targetPort}/downstream?id=1`

    const response = await fetch(`http://127.0.0.1:3000/api/fetch-after-await?target=${encodeURIComponent(target)}`)
    t.equal(response.status, 200, 'the API route responds 200 after the fetch() calls')
    const span = await waitForSpan((s) => s.getAcceptevent()?.getRpc()?.includes('/api/fetch-after-await'), 10000)
    const [httpRequestSpanEvent] = span.getSpaneventList()
    const actualSpanChunk = await waitForSpanChunk((spanChunk) => spanChunk.getLocalasyncid()?.getAsyncid() === httpRequestSpanEvent.getAsyncevent(), 10000)
    targetServer.close()

    const fetchSpanEvent = actualSpanChunk.getSpaneventList().find((spanEvent) => spanEvent.getServicetype() === ServiceType.asyncHttpClient.getCode())
    const httpUrlAnnotation = fetchSpanEvent.getAnnotationList().find(ann => ann.getKey() === AnnotationKey.HTTP_URL.getCode())
    t.equal(httpUrlAnnotation.getValue().getStringvalue(), `127.0.0.1:${targetPort}/downstream`, 'the http.url of the fetch() span event is the host and path, without the query')
    t.end()
})

test('Next.js: an API route records a fetch() in a setTimeout callback at depth 1, with no route span event', async (t) => {
    receivedSpans = []
    const http = require('http')
    const targetServer = http.createServer((req, res) => res.end('target')).listen(0)
    await once(targetServer, 'listening')
    const target = `http://localhost:${targetServer.address().port}/`

    const response = await fetch(`http://127.0.0.1:3000/api/fetch-in-timer?target=${encodeURIComponent(target)}`)
    t.equal(response.status, 200, 'the API route responds 200 after the fetch() in the setTimeout callback')
    const span = await waitForSpan((s) => s.getAcceptevent()?.getRpc()?.includes('/api/fetch-in-timer'), 10000)
    targetServer.close()

    const spanEvents = span.getSpaneventList()
    t.equal(spanEvents.length, 1, 'the PSpan has only the fetch() span event, with no route span event')
    const [fetchA] = spanEvents
    t.equal(fetchA.getServicetype(), ServiceType.asyncHttpClientInternal.getCode(), 'fetch a is the fetch() in the setTimeout callback')
    t.equal(fetchA.getDepth(), 1, 'fetch a is at depth 1')
    t.end()
})

test('client disconnect before the /api/client-disconnect response should not record span error or failure in URI stats', async (t) => {
    receivedSpans = []
    receivedStats = []
    try {
        const client = sendRequestOverRawSocket(3000, '/api/client-disconnect')
        await new Promise(resolve => setTimeout(resolve, 300))
        client.destroy()

        const span = await waitForSpan((s) => {
            const rpc = s.getAcceptevent()?.getRpc()
            return rpc && rpc.includes('/api/client-disconnect')
        }, 10000)

        t.ok(span, 'received span for client disconnect request')
        t.equal(span.getErr(), 0, 'span should not be marked as error')

        const annotations = span.getAnnotationList()
        const statusCodeAnnotation = annotations.find(ann => ann.getKey() === AnnotationKey.HTTP_STATUS_CODE.getCode())
        t.ok(statusCodeAnnotation, 'should have HTTP status code annotation')
        if (statusCodeAnnotation) {
            t.equal(statusCodeAnnotation.getValue().getIntvalue(), 200, 'status code annotation value should be 200')
        }

        await new Promise(resolve => setTimeout(resolve, 3000))

        const mergedStats = {}
        receivedStats.forEach(statMsg => {
            const agentUriStat = statMsg.getAgenturistat ? statMsg.getAgenturistat() : null
            if (agentUriStat) {
                agentUriStat.getEachuristatList().forEach(each => {
                    const uri = each.getUri()
                    if (!mergedStats[uri]) {
                        mergedStats[uri] = {
                            totalBuckets: new Array(8).fill(0),
                            failedBuckets: new Array(8).fill(0)
                        }
                    }
                    const totalHistList = each.getTotalhistogram().getHistogramList()
                    totalHistList.forEach((count, idx) => mergedStats[uri].totalBuckets[idx] += count)

                    const failedHistList = each.getFailedhistogram().getHistogramList()
                    failedHistList.forEach((count, idx) => mergedStats[uri].failedBuckets[idx] += count)
                })
            }
        })

        const disconnectUri = '/user/input/uri/client-disconnect'
        const stat = mergedStats[disconnectUri]
        t.ok(stat, `URI stats found for ${disconnectUri}`)
        if (stat) {
            const totalCount = stat.totalBuckets.reduce((acc, val) => acc + val, 0)
            t.equal(totalCount, 1, 'Total count should be 1')

            const failedCount = stat.failedBuckets.reduce((acc, val) => acc + val, 0)
            t.equal(failedCount, 0, 'Failed count should be 0')
        }
    } catch (err) {
        t.fail(err.message)
    }
    t.end()
})

test('Next.js: inbound Pinpoint headers are recorded on the span', async (t) => {
    const isParentTraceRootSpan = (span) => span.getAcceptevent()?.getRpc() === '/' && span.getTransactionid()?.getAgentid() === 'parent.agent'
    try {
        receivedSpans = []
        const response = await new User().fetch('http://127.0.0.1:3000/', { headers: ParentTraceHeader.header('pinpoint-host', 'parent.host:3000') })
        t.equal(response.status, 200, '/ responds with 200')
        const span = await waitForSpan(isParentTraceRootSpan, 10000)
        t.equal(span.getTransactionid().getAgentid(), 'parent.agent', 'PTransactionId.agentId is the Pinpoint-TraceID agentId')
        t.equal(span.getTransactionid().getAgentstarttime(), '1599831487121', 'PTransactionId.agentStartTime is the Pinpoint-TraceID agentStartTime')
        t.equal(span.getTransactionid().getSequence(), '4', 'PTransactionId.sequence is the Pinpoint-TraceID sequence')
        t.equal(span.getSpanid(), '-387300102333636357', 'PSpan.spanId is the Pinpoint-SpanID')
        t.equal(span.getParentspanid(), '3116250228920588432', 'PSpan.parentSpanId is the Pinpoint-pSpanID')
        t.equal(span.getFlag(), 0, 'PSpan.flag is the Pinpoint-Flags')
        t.equal(span.getAcceptevent().getParentinfo().getParentapplicationname(), 'parent.application', 'PParentInfo.parentApplicationName is the Pinpoint-pAppName')
        t.equal(span.getAcceptevent().getParentinfo().getParentapplicationtype(), 1210, 'PParentInfo.parentApplicationType is the Pinpoint-pAppType')
        t.equal(span.getAcceptevent().getParentinfo().getAcceptorhost(), 'parent.host:3000', 'PParentInfo.acceptorHost is the Pinpoint-Host')

        receivedSpans = []
        const flagsResponse = await new User().fetch('http://127.0.0.1:3000/', { headers: ParentTraceHeader.header('pinpoint-flags', 'abc') })
        t.equal(flagsResponse.status, 200, '/ with Pinpoint-Flags abc responds with 200')
        const flagsSpan = await waitForSpan(isParentTraceRootSpan, 10000)
        t.equal(flagsSpan.getFlag(), 0, 'Pinpoint-Flags abc is PSpan.flag 0')

        receivedSpans = []
        const parentApplicationTypeResponse = await new User().fetch('http://127.0.0.1:3000/', { headers: ParentTraceHeader.header('pinpoint-papptype', '') })
        t.equal(parentApplicationTypeResponse.status, 200, '/ with an empty Pinpoint-pAppType responds with 200')
        const parentApplicationTypeSpan = await waitForSpan(isParentTraceRootSpan, 10000)
        t.equal(parentApplicationTypeSpan.getAcceptevent().getParentinfo().getParentapplicationtype(), -1, 'an empty Pinpoint-pAppType is PParentInfo.parentApplicationType UNDEFINED -1')
    } catch (err) {
        t.fail(err.message)
    }
    t.end()
})

test('Next.js: v4 serviceName is sent as Pinpoint-pServiceName and an inbound one is recorded as parentServiceName', async (t) => {
    receivedSpans = []
    const http = require('http')
    let outgoingRequestHeaders
    const outgoingServer = http.createServer((req, res) => {
        outgoingRequestHeaders = req.headers
        res.end('ok')
    })
    await new Promise(resolve => outgoingServer.listen(0, '127.0.0.1', resolve))
    try {
        const target = `http://127.0.0.1:${outgoingServer.address().port}/outgoing`
        const response = await new User().fetch(`http://127.0.0.1:3000/api/parent-service-name?target=${encodeURIComponent(target)}`, { headers: ParentTraceHeader.header('pinpoint-pservicename', 'parent.service') })
        t.equal(response.status, 200, '/api/parent-service-name responds with 200')

        t.equal(outgoingRequestHeaders['pinpoint-pservicename'], 'next.js.service', 'outgoing request has Pinpoint-pServiceName header of PINPOINT_SERVICE_NAME')

        const span = await waitForSpan((s) => s.getAcceptevent()?.getRpc()?.includes('/api/parent-service-name'), 10000)
        t.equal(span.getAcceptevent().getParentinfo().getParentservicename(), 'parent.service', 'PParentInfo.parentServiceName is the inbound Pinpoint-pServiceName')
    } catch (err) {
        t.fail(err.message)
    } finally {
        outgoingServer.close()
    }
    t.end()
})

test('Next.js: v3 sends no Pinpoint-pServiceName and an inbound request without it leaves parentServiceName unset', async (t) => {
    const { spawn } = require('child_process')
    const nextServer = spawn(
        path.normalize('./node_modules/.bin/next'),
        ['start', '-H', '127.0.0.1', '-p', '3002'],
        {
            cwd: testAppDir,
            env: Object.assign({}, process.env, {
                NODE_OPTIONS: '-r ../../../index.js',
                NODE_ENV: 'production',
                NEXT_TELEMETRY_DISABLED: '1',
                PINPOINT_APPLICATION_NAME: 'next.js.v3',
                PINPOINT_SERVICE_NAME: 'ignored.service',
                PINPOINT_PROTOCOL_VERSION: 'v3',
                PINPOINT_COLLECTOR_IP: '127.0.0.1',
                PINPOINT_COLLECTOR_SPAN_PORT: String(spanCollectorPort),
                PINPOINT_COLLECTOR_STAT_PORT: String(spanCollectorPort),
                PINPOINT_COLLECTOR_TCP_PORT: String(spanCollectorPort),
                PINPOINT_SAMPLING_RATE: '1',
            }),
        }
    )
    t.teardown(() => nextServer.kill())
    nextServer.stderr.on('data', (data) => {
        t.comment('next server stderr: ' + formatForTComment(data))
    })
    await new Promise((resolve, reject) => {
        waitForNextServerReady(nextServer, (error) => error ? reject(error) : resolve())
    })

    const http = require('http')
    let outgoingRequestHeaders
    const outgoingServer = http.createServer((req, res) => {
        outgoingRequestHeaders = req.headers
        res.end('ok')
    })
    await new Promise(resolve => outgoingServer.listen(0, '127.0.0.1', resolve))
    t.teardown(() => outgoingServer.close())

    try {
        receivedSpans = []
        const target = `http://127.0.0.1:${outgoingServer.address().port}/outgoing`
        const response = await new User().fetch(`http://127.0.0.1:3002/api/parent-service-name?target=${encodeURIComponent(target)}`, { headers: ParentTraceHeader.header('pinpoint-pappname', 'parent.application') })
        t.equal(response.status, 200, '/api/parent-service-name responds with 200')

        t.equal(outgoingRequestHeaders['pinpoint-pappname'], 'next.js.v3', 'outgoing request has Pinpoint-pAppName header of PINPOINT_APPLICATION_NAME')
        t.equal(outgoingRequestHeaders['pinpoint-pservicename'], undefined, 'v3 outgoing request has no Pinpoint-pServiceName header even with PINPOINT_SERVICE_NAME set')

        const span = await waitForSpan((s) => s.getAcceptevent()?.getRpc()?.includes('/api/parent-service-name') && s.getTransactionid()?.getAgentid() === 'parent.agent', 10000)
        t.equal(span.getAcceptevent().getParentinfo().getParentapplicationname(), 'parent.application', 'PParentInfo.parentApplicationName is the inbound Pinpoint-pAppName')
        t.equal(span.getAcceptevent().getParentinfo().getParentservicename(), '', 'PParentInfo.parentServiceName is unset')
    } catch (err) {
        t.fail(err.message)
    }
    t.end()
})

test('Next.js: application service type is NODE 1400 even with PINPOINT_SERVICE_TYPE', async (t) => {
    receivedSpans = []
    const http = require('http')
    let outgoingRequestHeaders
    const outgoingServer = http.createServer((req, res) => {
        outgoingRequestHeaders = req.headers
        res.end('ok')
    })
    await new Promise(resolve => outgoingServer.listen(0, '127.0.0.1', resolve))
    try {
        const target = `http://127.0.0.1:${outgoingServer.address().port}/outgoing`
        const response = await new User().fetch(`http://127.0.0.1:3000/api/parent-service-name?target=${encodeURIComponent(target)}`)
        t.equal(response.status, 200, '/api/parent-service-name responds with 200')

        t.equal(outgoingRequestHeaders['pinpoint-papptype'], '1400', 'outgoing request has Pinpoint-pAppType header of NODE 1400')

        const span = await waitForSpan((s) => s.getAcceptevent()?.getRpc()?.includes('/api/parent-service-name'), 10000)
        t.equal(span.getApplicationservicetype(), 1400, 'PSpan.applicationServiceType is NODE 1400')
    } catch (err) {
        t.fail(err.message)
    } finally {
        outgoingServer.close()
    }
    t.end()
})

test('Next.js: AgentStat sends the transaction count and response time of completed requests', async (t) => {
    try {
        receivedStats = []
        await waitForAgentStats(1, 15000)
        receivedStats = []

        await fetch('http://127.0.0.1:3000/api/custom-uri')
        await fetch('http://127.0.0.1:3000/api/custom-uri')
        await fetch('http://127.0.0.1:3000/api/custom-uri')

        // A stat collected before the requests can arrive after them, so wait for the count instead of the next stat
        const agentStats = await waitForAgentStats(1, 15000, (stats) => sumOfSampledCount(stats) >= 3)

        // In the full suite the test process's instrumented fetch can send a Pinpoint trace header, so the requests count as continuations
        t.equal(sumOfSampledCount(agentStats), 3, 'PTransaction.sampledNewCount + sampledContinuationCount is 3 requests')
        t.ok(agentStats.some(agentStat => agentStat.getResponsetime().getMax() > 0), 'PResponseTime.max is greater than 0')
    } catch (err) {
        t.fail(err.message)
    }
    t.end()
})

test('Next.js with error analysis disabled responds to a throwing API route and records its span', async (t) => {
    const { spawn } = require('child_process')
    const nextServer = spawn(
        path.normalize('./node_modules/.bin/next'),
        ['start', '-H', '127.0.0.1', '-p', '3001'],
        {
            cwd: testAppDir,
            env: Object.assign({}, process.env, {
                NODE_OPTIONS: '-r ../../../index.js',
                NODE_ENV: 'production',
                NEXT_TELEMETRY_DISABLED: '1',
                PINPOINT_APPLICATION_NAME: 'next.js.error-analysis-disabled',
                PINPOINT_SERVICE_NAME: 'next.js.service',
                PINPOINT_COLLECTOR_IP: '127.0.0.1',
                PINPOINT_COLLECTOR_SPAN_PORT: String(spanCollectorPort),
                PINPOINT_COLLECTOR_STAT_PORT: String(spanCollectorPort),
                PINPOINT_COLLECTOR_TCP_PORT: String(spanCollectorPort),
                PINPOINT_SAMPLING_RATE: '1',
                PINPOINT_FEATURES_ERROR_ANALYSIS: 'false',
            }),
        }
    )
    t.teardown(() => nextServer.kill())
    nextServer.stderr.on('data', (data) => {
        t.comment('next server stderr: ' + formatForTComment(data))
    })
    await new Promise((resolve, reject) => {
        waitForNextServerReady(nextServer, (error) => error ? reject(error) : resolve())
    })

    receivedSpans = []
    const response = await fetch('http://127.0.0.1:3001/api/throw')
    t.equal(response.status, 500, '/api/throw responds 500')

    const span = await waitForSpan((s) => s.getAcceptevent()?.getRpc()?.includes('/api/throw'), 10000)
    t.equal(span.getErr(), 1, 'the span is marked as error')
    t.end()
})

test('Next.js: no URI stat is sent when uriStats is off', async (t) => {
    receivedSpans = []
    receivedStats = []
    const server = await startNextServer(3001, { PINPOINT_FEATURES_URI_STATS: 'false' })
    t.teardown(() => server.kill())

    const response = await fetch('http://127.0.0.1:3001/api/custom-uri')
    t.equal(response.status, 200, '/api/custom-uri responds with 200')
    const span = await waitForSpan((s) => s.getAcceptevent()?.getRpc()?.includes('/api/custom-uri'), 10000)
    t.ok(span, 'the request is traced')
    await new Promise(resolve => setTimeout(resolve, 3000))

    t.false(receivedUriStatUris().includes('/user/input/uri/from/pages'), 'no URI stat has the user input URI template')
    t.end()
})

test('Next.js: the user input URI template is not used when uriStats.useUserInput is off', async (t) => {
    receivedSpans = []
    receivedStats = []
    const server = await startNextServer(3002, { PINPOINT_FEATURES_URI_STATS_USE_USER_INPUT: 'false' })
    t.teardown(() => server.kill())

    const response = await fetch('http://127.0.0.1:3002/api/custom-uri')
    t.equal(response.status, 200, '/api/custom-uri responds with 200')
    const span = await waitForSpan((s) => s.getAcceptevent()?.getRpc()?.includes('/api/custom-uri'), 10000)
    t.ok(span, 'the request is traced')
    await new Promise(resolve => setTimeout(resolve, 3000))

    t.false(receivedUriStatUris().includes('/user/input/uri/from/pages'), 'no URI stat has the user input URI template')
    t.end()
})

test('teardown', async (t) => {
    if (nextServerProcess) {
        nextServerProcess.kill()
    }
    if (spanCollector) {
        spanCollector.forceShutdown()
    }
    t.pass('teardown complete')
    t.end()
})

function waitForNextServerReady(nextServerProcess, callback) {
    const timeout = setTimeout(() => {
        if (!serverReady) {
            callback?.(new Error('Server did not start'))
        }
    }, 10000)

    let serverReady = false
    nextServerProcess.stdout.on('data', (data) => {
        const output = formatForTComment(data)
        if (output.includes('Ready in')) {
            serverReady = true
            clearTimeout(timeout)
            callback?.()
        }
    })
}

function waitForSpan(predicate, timeoutMs = 5000) {
    const started = Date.now()
    return new Promise((resolve, reject) => {
        const check = () => {
            const match = receivedSpans.find(predicate)
            if (match) {
                return resolve(match)
            }
            if (Date.now() - started > timeoutMs) {
                return reject(new Error('Timed out waiting for span'))
            }
            setTimeout(check, 50)
        }
        check()
    })
}

function waitForSpanChunk(predicate, timeoutMs = 5000) {
    const started = Date.now()
    return new Promise((resolve, reject) => {
        const check = () => {
            const match = receivedSpanChunks.find(predicate)
            if (match) {
                return resolve(match)
            }
            if (Date.now() - started > timeoutMs) {
                return reject(new Error('Timed out waiting for SpanChunk'))
            }
            setTimeout(check, 50)
        }
        check()
    })
}

function waitForExceptionMetaData(predicate, timeoutMs = 5000) {
    const started = Date.now()
    return new Promise((resolve, reject) => {
        const check = () => {
            const match = receivedExceptionMetaData.find(predicate)
            if (match) {
                return resolve(match)
            }
            if (Date.now() - started > timeoutMs) {
                return reject(new Error('Timed out waiting for ExceptionMetaData'))
            }
            setTimeout(check, 50)
        }
        check()
    })
}

function waitForAgentStats(count, timeoutMs, predicate = () => true) {
    const started = Date.now()
    return new Promise((resolve, reject) => {
        const check = () => {
            const agentStats = receivedStats.map(stat => stat.getAgentstat()).filter(Boolean)
            if (agentStats.length >= count && predicate(agentStats)) {
                return resolve(agentStats)
            }
            if (Date.now() - started > timeoutMs) {
                return reject(new Error('Timed out waiting for AgentStat'))
            }
            setTimeout(check, 50)
        }
        check()
    })
}

function sumOfSampledCount(agentStats) {
    return agentStats.reduce((sum, agentStat) => {
        const transaction = agentStat.getTransaction()
        return sum + transaction.getSamplednewcount() + transaction.getSampledcontinuationcount()
    }, 0)
}

function getCollectedUriStats() {
    return receivedStats.flatMap(stat => {
        const agentUriStat = stat.getAgenturistat ? stat.getAgenturistat() : null
        if (agentUriStat) {
            return agentUriStat.getEachuristatList().map(each => each.getUri())
        }
        return []
    })
}

// Match ANSI escapes (from https://stackoverflow.com/a/29497680/14444044).
const ANSI_RE =
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g /* eslint-disable-line no-control-regex */

/**
 * Format the given data for passing to t.comment().
 *
 * - t.comment() wipes leading whitespace. Prefix lines with '|' to avoid
 *   that, and to visually group a multi-line write.
 * - Drop ANSI escape characters, because those include control chars that
 *   are illegal in XML. When we convert TAP output to JUnit XML for
 *   Jenkins, then Jenkins complains about invalid XML. FORCE_COLOR=0
 *   can be used to disable ANSI escapes in next dev's usage of chalk,
 *   but not in its coloured exception output.
 */
function formatForTComment(data) {
    return (
        data
            .toString('utf8')
            .replace(ANSI_RE, '')
            .trimRight()
            .replace(/\r?\n/g, '\n|') + '\n'
    )
}

function startNextServer(port, env) {
    const { spawn } = require('child_process')
    const server = spawn(
        path.normalize('./node_modules/.bin/next'),
        ['start', '-H', '127.0.0.1', '-p', String(port)],
        {
            cwd: testAppDir,
            env: Object.assign({}, process.env, {
                NODE_OPTIONS: '-r ../../../index.js',
                NODE_ENV: 'production',
                DB_HOST: container.getHost(),
                DB_PORT: container.getPort(3306),
                DB_USER: container.getUsername(),
                DB_PASSWORD: container.getUserPassword(),
                NEXT_TELEMETRY_DISABLED: '1',
                PINPOINT_APPLICATION_NAME: 'nextjs.test.js',
                PINPOINT_SERVICE_NAME: 'next.js.service',
                PINPOINT_COLLECTOR_IP: '127.0.0.1',
                PINPOINT_COLLECTOR_SPAN_PORT: String(spanCollectorPort),
                PINPOINT_COLLECTOR_STAT_PORT: String(spanCollectorPort),
                PINPOINT_COLLECTOR_TCP_PORT: String(spanCollectorPort),
                PINPOINT_SAMPLING_RATE: '1',
                PINPOINT_FEATURES_URI_STATS_TIME_WINDOW: '1000'
            }, env),
        }
    )
    return new Promise((resolve, reject) => {
        waitForNextServerReady(server, (error) => error ? reject(error) : resolve(server))
    })
}

function receivedUriStatUris() {
    return receivedStats
        .map(stat => stat.getAgenturistat?.())
        .filter(agentUriStat => agentUriStat)
        .flatMap(agentUriStat => agentUriStat.getEachuristatList().map(each => each.getUri()))
}
