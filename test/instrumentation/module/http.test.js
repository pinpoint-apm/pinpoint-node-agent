/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const agent = require('../../support/agent-singleton-mock')
const axios = require('axios')
const localStorage = require('../../../lib/instrumentation/context/local-storage')
const https = require('https')

test(`outgoing request URL escape a bug`, async (t) => {
    agent.bindHttp()

    t.plan(5)

    const trace = agent.createTraceObject()
    localStorage.run(trace, () => {
        t.true(trace)

        axios.get(`https://www.naver.com`, { httpsAgent: new https.Agent({ keepAlive: false }) })
            .then(function (response) {
                t.true(response.status == 200)
                const spanChunk = trace.repository.dataSender.findSpanChunk(trace.repository.buffer[0].asyncId)
                t.true(spanChunk.spanEventList.length == 2, `spanEventList`)
                const spanEvent = spanChunk.spanEventList[1]
                t.equal(spanEvent.annotations[0].value, "GET", "URL")
                t.equal(spanEvent.annotations[1].value, "www.naver.com/", "URL")
                agent.completeTraceObject(trace)
            })
    })
})