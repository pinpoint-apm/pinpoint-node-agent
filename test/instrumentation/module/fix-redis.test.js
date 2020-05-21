const test = require('tape')
const agent = require('../../support/agent-singleton-mock')
const { GenericContainer } = require("testcontainers")
const { addressStringOf } = require('../../../lib/utils/convert-utils')

test(`redis destination id`, async (t) => {
    const container = await new GenericContainer("redis")
        .withExposedPorts(6379)
        .start()

    agent.bindHttp()

    t.plan(6)

    const trace = agent.createTraceObject()
    const redis = require('redis')

    const client = redis.createClient(
        container.getMappedPort(6379),
        container.getContainerIpAddress(),
    )

    client.on("error", function (error) {
        console.error(error);
    })

    client.set("key", "value", async function (error) {
        t.true(error == null, "error is null")

        const trace = agent.traceContext.currentTraceObject()
        t.equal(trace.callStack.length, 0, "callStack is 0")
    })
    t.equal(agent.traceContext.currentTraceObject().callStack.length, 0, "set spanevent callstack")

    client.get("key", async function (error, data) {
        t.equal(data, "value", "redis value validation")

        const trace = agent.traceContext.currentTraceObject()
        t.equal(trace.callStack.length, 0, "callStack is 0")

        client.quit()
        agent.completeTraceObject(trace)
        await container.stop()
    })
    t.equal(agent.traceContext.currentTraceObject().callStack.length, 0, "get spanevent callstack")
})

test("ioredis destination id", async function (t) {
    const container = await new GenericContainer("redis")
        .withExposedPorts(6379)
        .start()

    agent.bindHttp()

    t.plan(5)

    const trace = agent.createTraceObject()
    const Redis = require('ioredis')
    const port = container.getMappedPort(6379)
    const redis = new Redis(
        port,
        container.getContainerIpAddress(),
    )
    redis.on("error", function (error) {
        console.error(error);
    })

    const result = await redis.set("key", "value")
    t.equal(result, "OK", "Success set data")

    redis.get("key", async function (error, data) {
        t.equal(data, "value", "redis value validation")

        t.true(agent.pinpointClient.dataSender.mockSpanChunk.spanEventList.length > 0, "a spanEventList should has one chunk")

        const spanevent = agent.pinpointClient.dataSender.mockSpanChunk.spanEventList[0]
        t.equal(spanevent.destinationId, "Redis", "Redis destionation ID check")
        t.equal(spanevent.endPoint, `localhost:${port}`)

        redis.quit()
        agent.completeTraceObject(trace)
        await container.stop()
    })
})

test(`addressStringOf`, (t) => {
    t.plan(4)

    let value = addressStringOf(null, null)
    t.true(value == null)

    value = addressStringOf(undefined, undefined)
    t.true(value == null)

    value = addressStringOf("localhost", 8980)
    t.equal(value, "localhost:8980")

    value = addressStringOf("127.0.0.1", 8000)
    t.equal(value, "127.0.0.1:8000")
})