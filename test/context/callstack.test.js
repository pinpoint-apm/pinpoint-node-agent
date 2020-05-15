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