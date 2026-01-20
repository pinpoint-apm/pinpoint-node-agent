/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const path = require('path')
const fixtures = path.resolve(__dirname, '..', '..', '..', 'fixtures', 'db')
const { MySqlContainer } = require('@testcontainers/mysql')
const testAppDir = path.join(__dirname, 'nextjs-app-router')
const fs = require('fs')
const grpc = require('@grpc/grpc-js')
const services = require('../../../../lib/data/v1/Service_grpc_pb')
const { Empty } = require('google-protobuf/google/protobuf/empty_pb')
const SpanProto = require('../../../../lib/data/v1/Span_pb')
const StatProto = require('../../../../lib/data/v1/Stat_pb')
const CmdProto = require('../../../../lib/data/v1/Cmd_pb')

let container
let spanCollector
let spanCollectorPort
let receivedSpans = []
test('setup', async (t) => {
    const source = path.resolve(fixtures, 'mysql.sql')
    container = await new MySqlContainer()
        .withCommand('--default-authentication-plugin=mysql_native_password')
        .withEnvironment({
            'MYSQL_DATABASE': 'test',
            'TZ': 'Asia/Seoul',
        })
        .withCopyFilesToContainer([{
            source: source,
            target: '/docker-entrypoint-initdb.d/mysql.sql'
        }])
        .start()
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
                    NODE_OPTIONS: '-r ../../../../../index.js',
                    NODE_ENV: 'production',
                    DB_HOST: container.getHost(),
                    DB_PORT: container.getPort(3306),
                    DB_USER: container.getUsername(),
                    DB_PASSWORD: container.getUserPassword(),
                    NEXT_TELEMETRY_DISABLED: '1',
                    PINPOINT_APPLICATION_NAME: 'next.js.test.js',
                    PINPOINT_COLLECTOR_IP: '127.0.0.1',
                    PINPOINT_COLLECTOR_SPAN_PORT: String(spanCollectorPort),
                    PINPOINT_COLLECTOR_STAT_PORT: String(spanCollectorPort),
                    PINPOINT_COLLECTOR_TCP_PORT: String(spanCollectorPort),
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
    try {
        const res = await fetch('http://127.0.0.1:3000/')
        t.equal(res.status, 200, '/ responds with 200')

        const span = await waitForSpan((span) => span.getAcceptevent()?.getRpc() === '/')
        t.ok(span, 'received span from Next.js request')
        t.equal(span.getAcceptevent().getRpc(), '/', 'rpc should be root path')
    } catch (err) {
        t.fail(err.message)
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
    await container.stop()
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