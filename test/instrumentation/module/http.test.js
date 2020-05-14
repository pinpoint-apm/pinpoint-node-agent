const test = require('tape')
const agent = require('../../support/agent-singleton-mock')
const axios = require('axios')

test(`outgoing request URL escape a bug`, async (t) => {
    agent.bindHttp()

    t.plan(3)

    const trace = agent.createTraceObject()
    t.true(trace)

    axios.get(`https://eonet.sci.gsfc.nasa.gov/api/v2.1/categories`)
        .then(function (response) {
            t.true(response.status == 200)

            t.true(agent.pinpointClient.dataSender.mockSpanChunk.spanEventList.length == 1, `a spanEventList`)
            agent.completeTraceObject(trace)
        })
})