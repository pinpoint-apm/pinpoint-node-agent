/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const path = require('path')
const { startMySql } = require('../../../support/shared-containers')
const testAppDir = path.join(__dirname, 'nextjs-app-router')
const fs = require('fs')
const grpc = require('@grpc/grpc-js')
const services = require('../../../../lib/data/v1/Service_grpc_pb')
const { Empty } = require('google-protobuf/google/protobuf/empty_pb')
const SpanProto = require('../../../../lib/data/v1/Span_pb')
const StatProto = require('../../../../lib/data/v1/Stat_pb')
const CmdProto = require('../../../../lib/data/v1/Cmd_pb')
const AnnotationKey = require('../../../../lib/constant/annotation-key')
const { sendRequestOverRawSocket } = require('../../../support/raw-http-client')
const { FixturesUpstreamHeader } = require('../../../support/fixtures-upstream-header')

let container
let spanCollector
let spanCollectorPort
let receivedSpans = []
let receivedStats = []
test('setup', async (t) => {
    container = await startMySql()
    t.pass('setup complete')
    t.end()
})

test('setup: start span collector', (t) => {
    spanCollector = new grpc.Server()
    spanCollector.addService(services.SpanService, {
        sendSpan: function (call, callback) {
            call.on('data', (spanMessage) => {
                const span = spanMessage.getSpan()
                if (span) {
                    receivedSpans.push(span)
                }
            })
            call.on('end', () => {
                callback?.(null, new Empty())
            })
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
        requestExceptionMetaData: (call, callback) => callback?.(null, okResult),
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
                    NODE_OPTIONS: '-r ../../../../../index.js',
                    NODE_ENV: 'production',
                    DB_HOST: container.getHost(),
                    DB_PORT: container.getPort(3306),
                    DB_USER: container.getUsername(),
                    DB_PASSWORD: container.getUserPassword(),
                    NEXT_TELEMETRY_DISABLED: '1',
                    PINPOINT_APPLICATION_NAME: 'next.js.test.js',
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
        const client = sendRequestOverRawSocket(3000, `/api/parent-service-name?target=${encodeURIComponent(target)}`, FixturesUpstreamHeader.header('pinpoint-pservicename', 'upstream.service'))
        client.setTimeout(10000, () => client.destroy())
        let response = ''
        client.on('data', (chunk) => response += chunk)
        await new Promise(resolve => client.on('close', resolve))
        t.ok(response.startsWith('HTTP/1.1 200'), '/api/parent-service-name responds with 200')

        t.equal(outgoingRequestHeaders['pinpoint-pservicename'], 'next.js.service', 'outgoing request has Pinpoint-pServiceName header of PINPOINT_SERVICE_NAME')

        const span = await waitForSpan((s) => s.getAcceptevent()?.getRpc()?.includes('/api/parent-service-name'), 10000)
        t.equal(span.getAcceptevent().getParentinfo().getParentservicename(), 'upstream.service', 'PParentInfo.parentServiceName is the inbound Pinpoint-pServiceName')
    } catch (err) {
        t.fail(err.message)
    } finally {
        outgoingServer.close()
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
        const client = sendRequestOverRawSocket(3000, `/api/parent-service-name?target=${encodeURIComponent(target)}`)
        client.setTimeout(10000, () => client.destroy())
        let response = ''
        client.on('data', (chunk) => response += chunk)
        await new Promise(resolve => client.on('close', resolve))
        t.ok(response.startsWith('HTTP/1.1 200'), '/api/parent-service-name responds with 200')

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