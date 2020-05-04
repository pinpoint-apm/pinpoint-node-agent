const test = require('tape')
const agent = require('../support/agent-singleton-mock')
const { GenericContainer } = require("testcontainers")

test(`fix redis call stack depth`, async (t) => {
    const container = await new GenericContainer("redis")
        .withExposedPorts(6379)
        .start()

    agent.bindHttp()

    t.plan(2)

    const trace = agent.createTraceObject()
    const redis = require('redis')
    const client = redis.createClient(
        container.getMappedPort(6379),
        container.getContainerIpAddress(),
    )

    client.set("key", "value", async function (error) {
        t.true(error == null, "error is null")

        const trace = agent.traceContext.currentTraceObject()
        t.equal(trace.callStack.length, 0, "callStack is 0")

        client.quit()
        agent.completeTraceObject(trace)
        await container.stop()
    })
})