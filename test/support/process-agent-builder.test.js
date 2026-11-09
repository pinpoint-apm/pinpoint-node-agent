/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const { ProcessAgentBuilder, startAgent } = require('./process-agent-builder')
startAgent()
const RecordingDataSender = require('./recording-data-sender')
const TraceContext = require('../../lib/context/trace-context')
const http = require('node:http')
const express = require('express')

test('A later ProcessAgentBuilder.build() returns the agent the first build() made', (t) => {
    const first = new ProcessAgentBuilder({ applicationName: 'first' }).setDataSender(new RecordingDataSender()).build()
    const second = new ProcessAgentBuilder({ applicationName: 'second' }).setDataSender(new RecordingDataSender()).build()

    t.equal(second, first, 'tests share one agent per process')
    t.end()
})

test('A later ProcessAgentBuilder.build() keeps the one TraceContext', (t) => {
    const first = new ProcessAgentBuilder().setDataSender(new RecordingDataSender()).build().getTraceContext()
    const second = new ProcessAgentBuilder().setDataSender(new RecordingDataSender()).build().getTraceContext()

    t.equal(second, first, 'tests share one trace context per process')
    t.ok(second instanceof TraceContext, 'the trace context is a TraceContext')
    t.end()
})

test('A test records its request in the data sender it passes', (t) => {
    const dataSender = new RecordingDataSender()
    new ProcessAgentBuilder().setDataSender(dataSender).build()

    assertHttpServer(t, (app, requestOutgoing) => {
        app.get('/', (req, res) => {
            requestOutgoing(() => res.send('ok'))
        })
    }, () => {
        t.equal(dataSender.spans().length, 2, 'the app span and the other server\'s span are recorded for the test')
        t.equal(dataSender.spanChunks().length, 1, 'the outgoing request span chunk is recorded for the test')
    })
})

test('The next test records its request only in its own data sender', (t) => {
    const dataSender = new RecordingDataSender()
    new ProcessAgentBuilder().setDataSender(dataSender).build()

    assertHttpServer(t, (app, requestOutgoing) => {
        app.get('/', (req, res) => {
            requestOutgoing(() => res.send('ok'))
        })
    }, () => {
        t.equal(dataSender.spans().length, 2, 'only this test\'s app span and the other server\'s span are recorded for it')
        t.equal(dataSender.spanChunks().length, 1, 'only this test\'s outgoing request span chunk is recorded for it')
    })
})

test('A later ProcessAgentBuilder.build() samples by the config it is given', (t) => {
    const dataSender = new RecordingDataSender()
    new ProcessAgentBuilder({ sampling: { enable: false } }).setDataSender(dataSender).build()

    assertHttpServer(t, (app, requestOutgoing) => {
        app.get('/', (req, res) => {
            requestOutgoing(() => res.send('ok'))
        })
    }, () => {
        t.equal(dataSender.spans().length, 0, 'no span is recorded when sampling is disabled')
    })
})

test('A later ProcessAgentBuilder.build() gives the agent the config it is given', (t) => {
    const dataSender = new RecordingDataSender()
    new ProcessAgentBuilder({ applicationName: 'other.application' }).setDataSender(dataSender).build()

    assertHttpServer(t, (app, requestOutgoing) => {
        app.get('/', (req, res) => {
            requestOutgoing(() => res.send('ok'))
        })
    }, (otherRequestHeaders) => {
        t.equal(otherRequestHeaders['pinpoint-pappname'], 'other.application', 'the outgoing request carries the given application name')
    })
})

test('A later ProcessAgentBuilder.build() without json goes back to the default config', (t) => {
    const dataSender = new RecordingDataSender()
    new ProcessAgentBuilder().setDataSender(dataSender).build()

    assertHttpServer(t, (app, requestOutgoing) => {
        app.get('/', (req, res) => {
            requestOutgoing(() => res.send('ok'))
        })
    }, (otherRequestHeaders) => {
        t.equal(dataSender.spans().length, 2, 'the app span and the other server\'s span are recorded')
        t.equal(otherRequestHeaders['pinpoint-pappname'], 'test.application.name', 'the outgoing request carries the default application name')
    })
})

function assertHttpServer(t, routes, asserts) {
    let otherRequestHeaders
    const otherServer = http.createServer((req, res) => {
        otherRequestHeaders = req.headers
        res.end('ok')
    })
    otherServer.listen(0, () => {
        const app = express()
        routes(app, (callback) => {
            const outgoing = http.request({ port: otherServer.address().port, path: '/other' }, (response) => {
                response.resume()
                response.on('end', callback)
            })
            outgoing.end()
        })
        const server = app.listen(0, () => {
            http.get({ port: server.address().port, path: '/' }, (response) => {
                response.resume()
                response.on('end', () => setImmediate(() => {
                    asserts(otherRequestHeaders)
                    t.end()
                }))
            })
        })
        t.teardown(() => server.close())
    })
    t.teardown(() => otherServer.close())
}
