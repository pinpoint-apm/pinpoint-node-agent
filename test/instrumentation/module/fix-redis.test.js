const test = require('tape')
const agent = require('../../support/agent-singleton-mock')
const { GenericContainer } = require("testcontainers")

test(`redis destination id`, async (t) => {
    const container = await new GenericContainer("redis")
        .withExposedPorts(6379)
        .start()

    agent.bindHttp()

    t.plan(1)

    // const trace = agent.createTraceObject()
    const redis = require('redis')

    const client = redis.createClient(
        container.getMappedPort(6379),
        container.getContainerIpAddress(),
    )

    client.on("error", function (error) {
        console.error(error);
    })

    client.set("key", "value", redis.print)
    client.get("key", async function(error, data) {
        t.equal(data, "value", "redis value validation")

        client.quit()
        // agent.completeTraceObject(trace)
        await container.stop()
    })
})