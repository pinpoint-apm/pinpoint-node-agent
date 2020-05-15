const test = require('tape')
const agent = require('../support/agent-singleton-mock')

test(`span and spanEvent call stack`, async (t) => {
    agent.bindHttp()

    t.plan(2)
    
    const trace = agent.createTraceObject()
    t.equal(trace.callStack.length, 0, "callstack is 0")
    t.equal(agent.traceContext.currentTraceObject(), trace, "current trace is current asyncId trace object")

    agent.completeTraceObject(trace)
})