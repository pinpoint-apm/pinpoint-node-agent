/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const agent = require('../../support/agent-singleton-mock')
const { RedisContainer } = require('@testcontainers/redis')
const { Wait } = require('testcontainers')
const { addressStringOf } = require('../../../lib/utils/convert-utils')
const localStorage = require('../../../lib/instrumentation/context/local-storage')

test(`redis destination id`, async (t) => {
    const container = await new RedisContainer()
        .withWaitStrategy(Wait.forAll([
            Wait.forListeningPorts(),
            Wait.forLogMessage("Ready to accept connections")
        ]))
        .start()

    agent.bindHttp()

    t.plan(6)

    const trace = agent.createTraceObject()
    localStorage.run(trace, () => {
        const redis = require('redis')
    
        const client = redis.createClient({ url: container.getConnectionUrl() })
    
        client.on("error", function (error) {
            console.error(error)
        })
    
        client.set("key", "value", async function (error) {
            t.true(error == null, "error is null")
    
            const trace = agent.traceContext.currentTraceObject()
            t.equal(trace.callStack.length, 1, "callStack is 1")
        })
        t.equal(agent.traceContext.currentTraceObject().callStack.length, 0, "set spanevent callstack")
    
        client.get("key", async function (error, data) {
            t.equal(data, "value", "redis value validation")
    
            const trace = agent.traceContext.currentTraceObject()
            t.equal(trace.callStack.length, 1, "callStack is 1")
    
            client.quit()
            agent.completeTraceObject(trace)
            await container.stop()
        })
        t.equal(agent.traceContext.currentTraceObject().callStack.length, 0, "get spanevent callstack")
    })
})

test("ioredis destination id", async function (t) {
    const container = await new RedisContainer()
        .withWaitStrategy(Wait.forAll([
            Wait.forListeningPorts(),
            Wait.forLogMessage("Ready to accept connections")
        ]))    
        .start()

    agent.bindHttp()

    t.plan(5)

    const trace = agent.createTraceObject()
    localStorage.run(trace, async () => {
        const Redis = require('ioredis')
        const port = container.getMappedPort(6379)
        const redis = new Redis(
            port,
            container.getHost(),
        )
        redis.on("error", function (error) {
            console.error(error)
        })
    
        const result = await redis.set("key", "value")
        t.equal(result, "OK", "Success set data")
    
        redis.get("key", async function (error, data) {
            t.equal(data, "value", "redis value validation")

            setImmediate(async () => {
                t.true(agent.dataSender.mockSpanChunks[0].spanEventList.length > 0, "a spanEventList should has one chunk")
        
                const spanevent = trace.storage.storage[0]
                t.equal(spanevent.destinationId, "Redis", "Redis destionation ID check")
                t.true(spanevent.endPoint.endsWith(`:${port}`), `localhost:${port}`)
        
                redis.quit()
                agent.completeTraceObject(trace)
                await container.stop()
            })
        })
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

// https://github.com/NodeRedis/node-redis#rediscreateclient
test(`Fix app crash without callback function https://github.com/pinpoint-apm/pinpoint-node-agent/pull/12`, async (t) => {
    const container = await new RedisContainer()
        .withWaitStrategy(Wait.forAll([
            Wait.forListeningPorts(),
            Wait.forLogMessage("Ready to accept connections")
        ]))
        .start()

    agent.bindHttp()

    t.plan(6)

    const trace = agent.createTraceObject()
    localStorage.run(trace, () => {
        const redis = require('redis')
    
        const client = redis.createClient({ url: container.getConnectionUrl(), db: 3 })
    
        client.select(2)
    
        client.on("error", function (error) {
            console.error(error)
        })
    
        client.set("key", "value", async function (error) {
            t.true(error == null, "error is null")
    
            const trace = agent.traceContext.currentTraceObject()
            t.equal(trace.callStack.length, 1, "callStack is 1")
        })
        t.equal(agent.traceContext.currentTraceObject().callStack.length, 0, "set spanevent callstack")
    
        client.get("key", async function (error, data) {
            t.equal(data, "value", "redis value validation")
    
            const trace = agent.traceContext.currentTraceObject()
            t.equal(trace.callStack.length, 1, "callStack is 1")
    
            client.quit()
            agent.completeTraceObject(trace)
            await container.stop()
        })
        t.equal(agent.traceContext.currentTraceObject().callStack.length, 0, "get spanevent callstack")
    })
})
