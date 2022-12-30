/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const agent = require('../support/agent-singleton-mock')
const axios = require('axios')

test(`span and spanEvent call stack`, async (t) => {
    agent.bindHttp()

    t.plan(11)

    const trace = agent.createTraceObject()
    t.equal(trace.callStack.length, 0, "callstack is 0")
    t.equal(agent.traceContext.currentTraceObject(), trace, "current trace is current asyncId trace object")

    axios.get(`https://github.com`)
        .then(function (response) {
            t.true(response.status == 200)
            t.equal(agent.traceContext.currentTraceObject(), trace, "current trace is current asyncId trace object")
            t.equal(agent.dataSender.mockSpanChunk.spanEventList.length, 2, "spanEventList length")
            t.equal(agent.dataSender.mockSpanChunk.spanEventList[1].annotations[0].key, 12, "APIDesc key")
            t.equal(agent.dataSender.mockSpanChunk.spanEventList[1].annotations[0].value.stringValue, "GET", "APIDesc stringValue")
            t.equal(agent.dataSender.mockSpanChunk.spanEventList[1].annotations[1].key, 40, "HTTP.URL key")
            t.equal(agent.dataSender.mockSpanChunk.spanEventList[1].annotations[1].value.stringValue, 'github.com/', "HTTP.URL stringValue")
            t.equal(agent.dataSender.mockSpanChunk.spanEventList[1].annotations[2].key, 46, "HTTP.status.code")
            t.equal(agent.dataSender.mockSpanChunk.spanEventList[1].annotations[2].value.intValue, 200, "HTTP.status.code stringValue")
            agent.completeTraceObject(trace)
        })
})

const express = require('express')
const TEST_ENV = {
    host: 'localhost',
    port: 5006,
}
const getServerUrl = (path) => `http://${TEST_ENV.host}:${TEST_ENV.port}${path}`
test.skip(`fix express call stack depth`, async (t) => {
    agent.bindHttp()

    t.plan(9)

    const app = new express()
    const path = `/`

    app.use(express.json())
    app.use(express.urlencoded({
        extended: false
    }))

    const router1 = express.Router()
    router1.get(path, async (req, res) => {
        const result = await axios.get(`https://github.com`)
        t.equal(result.status, 200)
        res.send('ok router1')
    })

    app.use('/router1', router1)

    const server = app.listen(TEST_ENV.port, async function () {
        const result1 = await axios.get(getServerUrl(`/router1${path}`))
        t.ok(result1.status, 200)
        t.equal(agent.dataSender.mockSpan.spanEventList.length, 4, `span has 3 spanevents`)
        t.equal(agent.dataSender.mockSpan.spanEventList[2].annotations[0].value.stringValue, "express.middleware.jsonParser", "first spanevent json parser")
        t.equal(agent.dataSender.mockSpan.spanEventList[2].depth, 1, "express.middleware.jsonParser depth is one")
        t.equal(agent.dataSender.mockSpan.spanEventList[1].annotations[0].value.stringValue, 'express.middleware.urlencodedParser', "url encoding")
        t.equal(agent.dataSender.mockSpan.spanEventList[1].depth, 2, "express.middleware.urlencodedParser depth is one")
        t.equal(agent.dataSender.mockSpan.spanEventList[0].sequence, 2, "express get")
        t.equal(agent.dataSender.mockSpan.spanEventList[0].depth, 3, "express get depth is one")

        server.close()
    })
})