/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const agent = require('../support/agent-singleton-mock')
const { RedisContainer } = require('@testcontainers/redis')
const { Wait } = require("testcontainers")
const localStorage = require('../../lib/instrumentation/context/local-storage')

test(`fix redis call stack depth`, async (t) => {
    const container = await new RedisContainer()
        .withWaitStrategy(Wait.forAll([
            Wait.forListeningPorts(),
            Wait.forLogMessage("Ready to accept connections")
        ]))    
        .start()

    agent.bindHttp()

    t.plan(2)

    const trace = agent.createTraceObject()
    localStorage.run(trace, () => {
        const redis = require('redis')
        const client = redis.createClient({ url: container.getConnectionUrl() })
    
        client.set('key', 'value', async function (error) {
            t.true(error == null, 'error is null')
    
            const trace = agent.traceContext.currentTraceObject()
            t.equal(trace.callStack.length, 1, 'callStack is 1')
    
            client.quit()
            agent.completeTraceObject(trace)
            await container.stop()
        })
    })
})