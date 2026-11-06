/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const agent = require('../../support/agent-singleton-mock')
const axios = require('axios')
const express = require('express')
const http = require('http')
const https = require('https')

test('exclusion URL sampling test', (t) => {
    process.env['PINPOINT_TRACE_EXCLUSION_URL_PATTERN'] = '/healthcheck,/metrics'
    agent.bindHttp()
    t.deepEqual(agent.traceContext.traceSampler.pathMatcher.patterns, ["/healthcheck", "/metrics"])
    let state = agent.traceContext.traceSampler.newState('/healthcheck')
    t.equal(state.isSampled(), false, 'isSampled is false')
    state = agent.traceContext.traceSampler.newState('/metrics')
    t.equal(state.isSampled(), false, 'isSampled is false')
    delete process.env.PINPOINT_TRACE_EXCLUSION_URL_PATTERN
    t.end()
})

test('outgoing request when canSample true', async (t) => {
    process.env['PINPOINT_TRACE_EXCLUSION_URL_PATTERN'] = "/heath_check"
    agent.bindHttp()
    await outgoingRequest(t, "/heath_check", false)
    delete process.env.PINPOINT_TRACE_EXCLUSION_URL_PATTERN

    t.end()
})

test('when pattern match is false, sampling is false', async (t) => {
    process.env['PINPOINT_TRACE_EXCLUSION_URL_PATTERN'] = "/heath_check?/**"
    agent.bindHttp()
    await outgoingRequest(t, "/heath_check", true)
    delete process.env.PINPOINT_TRACE_EXCLUSION_URL_PATTERN

    t.end()
})

test('when pattern match with cache size on ENV environment, sampling test with cache hit', async (t) => {
    process.env['PINPOINT_TRACE_EXCLUSION_URL_PATTERN'] = "/heath_check?/**,/tes?"
    agent.bindHttp()
    await outgoingRequest(t, "/test", false)
    delete process.env.PINPOINT_TRACE_EXCLUSION_URL_PATTERN

    process.env['PINPOINT_TRACE_EXCLUSION_URL_PATTERN'] = "/heath_check?/**,/tes?"
    process.env['PINPOINT_TRACE_EXCLUSION_URL_CACHE_SIZE'] = "0"
    agent.bindHttp()
    await outgoingRequest(t, "/test", false)
    delete process.env.PINPOINT_TRACE_EXCLUSION_URL_PATTERN
    delete process.env.PINPOINT_TRACE_EXCLUSION_URL_CACHE_SIZE

    process.env['PINPOINT_TRACE_EXCLUSION_URL_CACHE_SIZE'] = "0"
    agent.bindHttp()
    await outgoingRequest(t, "/test", true)
    delete process.env.PINPOINT_TRACE_EXCLUSION_URL_CACHE_SIZE

    process.env['PINPOINT_TRACE_EXCLUSION_URL_PATTERN'] = "/heath_check?/**,/test?"
    agent.bindHttp()
    await outgoingRequest(t, "/test", true)
    delete process.env.PINPOINT_TRACE_EXCLUSION_URL_PATTERN

    process.env['PINPOINT_TRACE_EXCLUSION_URL_PATTERN'] = "/heath_check?/**,/test?"
    process.env['PINPOINT_TRACE_EXCLUSION_URL_CACHE_SIZE'] = "0"
    agent.bindHttp()
    await outgoingRequest(t, "/test", true)
    delete process.env.PINPOINT_TRACE_EXCLUSION_URL_PATTERN
    delete process.env.PINPOINT_TRACE_EXCLUSION_URL_CACHE_SIZE

    t.end()
})

test('when pattern match with cache size form JSON, sampling test with cache hit', async (t) => {
    let config = require('../../fixtures/pinpoint-config-test.json')
    config = Object.assign({}, config, {
        "features": {
            "traceExclusionUrl": {
                "patterns": ["/heath_check?/**", "/tes?"]
            }
        }
    })
    agent.bindHttp(config)
    await outgoingRequest(t, "/test", false)

    config = require('../../fixtures/pinpoint-config-test.json')
    config = Object.assign({}, config, {
        "features": {
            "traceExclusionUrl": {
                "patterns": ["/heath_check?/**", "/tes?"],
                "cacheSize": 0
            }
        }
    })
    agent.bindHttp(config)
    await outgoingRequest(t, "/test", false)

    config = require('../../fixtures/pinpoint-config-test.json')
    config = Object.assign({}, config, {
        "features": {
            "traceExclusionUrl": {
                "cacheSize": 0
            }
        }
    })
    agent.bindHttp(config)
    await outgoingRequest(t, "/test", true)

    config = require('../../fixtures/pinpoint-config-test.json')
    config = Object.assign({}, config, {
        "features": {
            "traceExclusionUrl": {
                "patterns": ["/heath_check?/**", "/test?"]
            }
        }
    })
    agent.bindHttp(config)
    await outgoingRequest(t, "/test", true)

    config = require('../../fixtures/pinpoint-config-test.json')
    config = Object.assign({}, config, {
        "features": {
            "traceExclusionUrl": {
                "patterns": ["/heath_check?/**", "/test?"],
                "cacheSize": 0
            }
        }
    })
    agent.bindHttp(config)
    await outgoingRequest(t, "/test", true)

    t.end()
})

async function outgoingRequest(t, path, expectedSampling) {
    return new Promise((resolve) => {
        const PATH = path
        const app = new express()

        let actualTrace
        app.get(PATH, async (req, res) => {
            actualTrace = agent.currentTraceObject()
            if (typeof expectedSampling === 'boolean') {
                if (expectedSampling) {
                    t.equal(actualTrace.constructor.name, 'Trace', 'actualTrace is Trace')
                } else {
                    t.equal(actualTrace.constructor.name, 'DisableTrace', 'actualTrace is DisableTrace')
                }
            }
            const result1 = await axios.get(getServerUrl(OUTGOING_PATH))
            t.equal(result1.data, 'ok get', `sampling is ${actualTrace.constructor.name !== 'DisableTrace'}, outgoing req ok`)
            res.send('ok get')
        })

        const OUTGOING_PATH = '/outgoingrequest'
        app.get(OUTGOING_PATH, async (req, res) => {
            const headers = req.headers
            if (actualTrace.constructor.name === 'DisableTrace') {
                t.equal('s0', headers['pinpoint-sampled'], 'When no sampling, pinpoint-sampled is s0')
            } else {
                t.equal(actualTrace.spanBuilder.getTraceRoot().getTraceId().toStringDelimiterFormatted(), headers['pinpoint-traceid'])
                t.equal(actualTrace.spanBuilder.getTraceRoot().getTraceId().getSpanId(), headers['pinpoint-pspanid'])
                t.equal(agent.getConfig().getApplicationName(), headers['pinpoint-pappname'])
                t.equal(Number(headers['pinpoint-papptype']), 1400, 'pinpoint-papptype header is NODE 1400')
                t.equal(actualTrace.spanBuilder.getTraceRoot().getTraceId().flags, headers['pinpoint-flags'])
                t.equal(headers['pinpoint-sampled'], undefined, 'When sampling, pinpoint-sampled is undefined')
            }
            res.send('ok get')
        })

        const server = app.listen(TEST_ENV.port, async () => {
            const result1 = await axios.get(getServerUrl(PATH), {
                timeout: 3000,
                httpAgent: new http.Agent({ keepAlive: false }),
                httpsAgent: new https.Agent({ keepAlive: false }),
            })
            t.equal(result1.status, 200, `sampling is ${actualTrace.constructor.name !== 'DisableTrace'}, response status 200 ok`)

            server.close()
            resolve(t)
        })
    })
}

const TEST_ENV = {
    host: 'localhost',
    port: 5006,
}
const getServerUrl = (path) => `http://${TEST_ENV.host}:${TEST_ENV.port}${path}`
