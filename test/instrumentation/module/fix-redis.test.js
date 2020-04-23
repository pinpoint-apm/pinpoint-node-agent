const test = require('tape')
const agent = require('../../support/agent-singleton-mock')
const { GenericContainer } = require("testcontainers")

test(`redis destination id`, async (t) => {
    const container = await new GenericContainer("redis")
        .withExposedPorts(6379)
        .start()

    agent.bindHttp()

    t.plan(1)

    const redis = require('redis')
    const client = redis.createClient(
        container.getMappedPort(6379),
        container.getContainerIpAddress(),
    )

    client.on("error", function (error) {
        console.error(error);
    })

    client.set("key", "value", redis.print)
    client.get("key", redis.print)

    await client.quit()
    await container.stop()
})