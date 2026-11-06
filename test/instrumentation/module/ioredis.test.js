/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const axios = require('axios')
const agent = require('../../support/agent-singleton-mock')
const express = require('express')
const Koa = require('koa')
const Router = require('koa-router')
const koaBodyParser = require('koa-bodyparser')
const ioRedis = require('ioredis')
const { startRedis } = require('../../support/shared-containers')
const localStorage = require('../../../lib/instrumentation/context/local-storage')

const TEST_ENV = {
    host: 'localhost',
    port: 5005,
}
const getServerUrl = (path) => `http://${TEST_ENV.host}:${TEST_ENV.port}${path}`

const redisData = {
    name: 'jundol',
    job: 'bon developer',
    salary: 500000000,
}

test("ioredis destination id", async function (t) {
    const container = await startRedis()

    agent.bindHttp()

    t.plan(5)

    const trace = agent.createTraceObject()
    localStorage.run(trace, async () => {
        const port = container.getMappedPort(6379)
        const redis = new ioRedis(
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
                t.true(agent.dataSender.findSpanChunks(trace.getTraceRoot())[0].spanEventList.length > 0, "a spanEventList should has one chunk")

                const spanevent = trace.repository.buffer[0]
                t.equal(spanevent.destinationId, "Redis", "Redis destionation ID check")
                t.true(spanevent.endPoint.endsWith(`:${port}`), `localhost:${port}`)

                redis.quit()
                agent.completeTraceObject(trace)
            })
        })
    })
})

const testName2 = 'express-ioredis'
test(`${testName2} should Record the connections between express and ioredis.`, async function (t) {
    agent.bindHttp()
    const container = await startRedis()

    const testName = testName2

    const app = new express()
    const redis = new ioRedis(container.getMappedPort(6379), container.getHost())
    const PATH = `/${testName}`

    app.use(express.json())
    app.use(function (req, res, next) {
        req.cache = redis
        next()
    })
    app.post(PATH, function (req, res, next) {
        req.accepts('application/json')
        var key = req.body.name
        var value = JSON.stringify(req.body)
        req.cache.set(key, value, function (err, data) {
            if (err) {
                console.log(err)
                res.send("error " + err)
                return
            }
            req.cache.expire(key, 10)
            res.json(value)
        })
    })
    app.get(`${PATH}/:name`, function (req, res, next) {
        var key = req.params.name
        req.cache.get(key, function (err, data) {
            if (err) {
                console.log(err)
                res.send("error " + err)
                return
            }
            var value = JSON.parse(data)
            res.json(value)
        })
    })
    app.use(function (req, res, next) {
        var err = new Error('Not Found')
        err.status = 404
        next(err)
    })
    const server = app.listen(TEST_ENV.port, async function () {
        const rstPush = await axios.post(getServerUrl(PATH), redisData)
        t.equal(rstPush.status, 200)

        await redis.quit()
        server.close()
        t.end()
    })
})

const testName4 = 'koa-ioredis'
test(`${testName4} should Record the connections between koa and ioredis.`, async function (t) {
    agent.bindHttp()
    const container = await startRedis()

    const testName = testName4

    const app = new Koa()
    const router = new Router()
    const redis = new ioRedis(container.getMappedPort(6379), container.getHost())

    const PATH = `/${testName}`
    app.use(koaBodyParser())
    router.post(PATH, async function (ctx, next) {
        const key = ctx.request.body.name
        const value = JSON.stringify(ctx.request.body)
        await redis.set(key, value)
        ctx.body = 'test'
    })

    router.get(`${PATH}/:name`, async (ctx, next) => {
        const key = ctx.params.name
        // await Promise.all([
        //   redis.get(key),
        //   redis.get(key),
        //   redis.get(key)
        // ])


        redis.get(key, (err, result) => {
            if (err) {
                console.error(err)
            } else {
                // console.log(result)
            }
        })

        redis.get(key, (err, result) => {
            if (err) {
                console.error(err)
            } else {
                // console.log(result)
            }
        })
        redis.get(key, (err, result) => {
            if (err) {
                console.error(err)
            } else {
                // console.log(result)
            }
        })

        ctx.body = 'test'
    })

    app.use(router.routes()).use(router.allowedMethods())

    const server = app.listen(TEST_ENV.port, async () => {
        const rstPush = await axios.post(getServerUrl(PATH), redisData)
        t.equal(rstPush.status, 200)
        const rstGet = await axios.get(getServerUrl(`${PATH}/jundol`))
        t.equal(rstGet.status, 200)

        await redis.quit()
        server.close()
        t.end()
    })
})
