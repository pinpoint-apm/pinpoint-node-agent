const test = require('tape')
const agent = require('../../support/agent-singleton-mock')
const { GenericContainer } = require("testcontainers")

test(`redis destination id`, async (t) => {
    const container = await new GenericContainer("redis")
        .withExposedPorts(6379)
        .start()

    agent.bindHttp()

    t.plan(2)

    let trace = agent.traceContext.currentTraceObject()
    t.true(trace === undefined)

    // trace = agent.createTraceObject()

    const redis = require('redis')
    const client = redis.createClient(
        container.getMappedPort(6379),
        container.getContainerIpAddress(),
    )

    client.on("error", function (error) {
        console.error(error);
    })

    client.set("key", "value", redis.print)
    client.get("key", function(error, data) {
        t.equal(data, "value", "redis value validation")
    })

    // agent.completeTraceObject(trace)
    await client.quit()
    await container.stop()
})