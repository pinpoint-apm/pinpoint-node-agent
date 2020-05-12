const test = require('tape')
const agent = require('../../support/agent-singleton-mock')

test(`outgoing request URL escape a bug`, async (t) => {
    agent.bindHttp()

    t.plan(1)

    const trace = agent.createTraceObject()
    t.true(trace)

    agent.completeTraceObject(trace)
})