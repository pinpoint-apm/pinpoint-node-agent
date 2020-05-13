const test = require('tape')
const agent = require('../../support/agent-singleton-mock')
const axios = require('axios')

test(`outgoing request URL escape a bug`, async (t) => {
    agent.bindHttp()

    t.plan(2)

    const trace = agent.createTraceObject()
    t.true(trace)

    const result = await axios.get(`https://eonet.sci.gsfc.nasa.gov/api/v2.1/categories`)
    t.true(result.status == 200)

    agent.completeTraceObject(trace)
})