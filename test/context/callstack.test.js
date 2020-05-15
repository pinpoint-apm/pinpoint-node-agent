const test = require('tape')
const agent = require('../support/agent-singleton-mock')

test(`span and spanEvent call stack`, async (t) => {
    agent.bindHttp()

    t.plan(1)
    
    const trace = agent.createTraceObject()
    t.equal(trace.callStack.length, 0, "callstack is 0")

    agent.completeTraceObject(trace)
})