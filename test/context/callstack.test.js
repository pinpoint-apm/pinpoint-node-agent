const test = require('tape')
const agent = require('../support/agent-singleton-mock')
const axios = require('axios')

test(`span and spanEvent call stack`, async (t) => {
    agent.bindHttp()

    t.plan(4)

    const trace = agent.createTraceObject()
    t.equal(trace.callStack.length, 0, "callstack is 0")
    t.equal(agent.traceContext.currentTraceObject(), trace, "current trace is current asyncId trace object")

    axios.get(`https://eonet.sci.gsfc.nasa.gov/api/v2.1/categories`)
        .then(function (response) {
            t.true(response.status == 200)
            t.equal(agent.traceContext.currentTraceObject(), trace, "current trace is current asyncId trace object")

            agent.completeTraceObject(trace)
        })
})

const express = require('express')
const TEST_ENV = {
    host: 'localhost',
    port: 5006,
}
const getServerUrl = (path) => `http://${TEST_ENV.host}:${TEST_ENV.port}${path}`
test(`fix express call stack depth`, async (t) => {
    agent.bindHttp()

    t.plan(1)

    const app = new express()
    const path = `/`

    app.use(express.json())
    app.use(express.urlencoded({
        extended: false
    }))

    const router1 = express.Router()
    router1.get(path, (req, res) => {
        res.send('ok router1')
    })

    app.use('/router1', router1)
    
    const server = app.listen(TEST_ENV.port, async function () {
        const result1 = await axios.get(getServerUrl(`/router1${path}`))
        t.ok(result1.status, 200)

        t.true(agent.pinpointClient.dataSender.mockSpanChunk.spanEventList.length == 1, `a spanEventList`)

        server.close()
    })
})