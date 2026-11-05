/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
require('./agent-singleton-mock')
const { ProcessAgentBuilder } = require('./process-agent-builder')
const RecordingDataSender = require('./recording-data-sender')
const instrumentedCallbackWork = require('../fixtures/instrumented-callback-work')
const http = require('node:http')
const express = require('express')

test('A later ProcessAgentBuilder.build() returns the agent the first build() made', (t) => {
    const first = new ProcessAgentBuilder({ applicationName: 'first' }).setDataSender(new RecordingDataSender()).build()
    const second = new ProcessAgentBuilder({ applicationName: 'second' }).setDataSender(new RecordingDataSender()).build()

    t.equal(second, first, 'tests share one agent per process')
    t.end()
})

test('A test traces its request with the trace context it uses', (t) => {
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

test('The next test traces its request with its own trace context, apart from the previous test', (t) => {
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

test('A callback instrumented when its module loaded sends its span chunk with the trace context the test uses', (t) => {
    const dataSender = new RecordingDataSender()
    new ProcessAgentBuilder().setDataSender(dataSender).build()

    assertHttpServer(t, (app) => {
        app.get('/', (req, res) => {
            instrumentedCallbackWork.run(() => res.send('ok'))
        })
    }, () => {
        t.equal(dataSender.spans().length, 1, 'the app span is recorded for the test')
        t.equal(dataSender.spanChunks().length, 1, 'the callback span chunk is recorded for the test')
    })
})

function assertHttpServer(t, routes, asserts) {
    const otherServer = http.createServer((req, res) => {
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
                    asserts()
                    t.end()
                }))
            })
        })
        t.teardown(() => server.close())
    })
    t.teardown(() => otherServer.close())
}
