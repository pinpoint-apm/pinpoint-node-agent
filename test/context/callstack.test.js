/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const agent = require('../support/agent-singleton-mock')
const axios = require('axios')
const apiMetaService = require('../../lib/context/api-meta-service')
const { ServiceTypeCode } = require('../../lib/constant/service-type')
const express = require('express')
const defaultPredefinedMethodDescriptorRegistry = require('../../lib/constant/default-predefined-method-descriptor-registry')
const MethodDescriptorBuilder = require('../../lib/context/method-descriptor-builder')
const localStorage = require('../../lib/instrumentation/context/local-storage')
const http = require('http')
const https = require('https')
const semver = require('semver')

test(`span and spanEvent call stack`, async (t) => {
    agent.bindHttp()

    t.plan(11)
    const traceContext = agent.getTraceContext()
    const trace = traceContext.newTraceObject2()
    localStorage.run(trace, () => {
        t.equal(trace.callStack.length ?? trace.callStack.stack.length, 0, 'callstack is 0')
        t.equal(traceContext.currentTraceObject(), trace, 'current trace is current asyncId trace object')

        axios.get(`https://github.com`, { httpAgent: new http.Agent({ keepAlive: false }) })
            .then(function (response) {
                t.true(response.status == 200)
                t.equal(traceContext.currentTraceObject(), trace, 'current trace is current asyncId trace object')
                t.equal(trace.repository.dataSender.mockSpanChunks[0].spanEventList.length, 2, 'spanEventList length')
                t.equal(trace.repository.dataSender.mockSpanChunks[0].spanEventList[1].annotations[0].key, 12, 'APIDesc key')
                t.equal(trace.repository.dataSender.mockSpanChunks[0].spanEventList[1].annotations[0].value, 'GET', 'APIDesc stringValue')
                t.equal(trace.repository.dataSender.mockSpanChunks[0].spanEventList[1].annotations[1].key, 40, 'HTTP.URL key')
                t.equal(trace.repository.dataSender.mockSpanChunks[0].spanEventList[1].annotations[1].value, 'github.com/', 'HTTP.URL stringValue')
                t.equal(trace.repository.dataSender.mockSpanChunks[0].spanEventList[1].annotations[2].key, 46, 'HTTP.status.code')
                t.equal(trace.repository.dataSender.mockSpanChunks[0].spanEventList[1].annotations[2].value, 200, 'HTTP.status.code stringValue')
                agent.completeTraceObject(trace)
            })
    })
})

const TEST_ENV = {
    host: 'localhost',
    port: 5006,
}
const getServerUrl = (path) => `http://${TEST_ENV.host}:${TEST_ENV.port}${path}`
test(`fix express call stack depth`, async (t) => {
    agent.bindHttpWithCallSite()

    const app = new express()
    const path = `/`

    app.use(express.json())
    app.use(express.urlencoded({
        extended: false
    }))

    const router1 = express.Router()
    router1.get(path, async (req, res) => {
        const result = await axios.get(`https://www.naver.com`, { httpsAgent: new https.Agent({ keepAlive: false }) })
        t.equal(result.status, 200)
        res.send('ok router1')
    })
    app.use('/router1', router1)

    const server = app.listen(TEST_ENV.port, async function () {
        const result1 = await axios.get(getServerUrl(`/router1${path}`), { httpAgent: new http.Agent({ keepAlive: false }) })
        t.ok(result1.status, 200)
        t.ok(result1.data, 'ok router1')

        t.equal(agent.getTrace(0).repository.dataSender.mockSpan.spanEventList.length, 4, `span has 6 span events`)
        t.equal(agent.getTrace(0).repository.dataSender.mockSpan.apiId, defaultPredefinedMethodDescriptorRegistry.nodeServerMethodDescriptor.getApiId(), 'nodeServerMethodDescriptor apiId')

        let actualBuilder = new MethodDescriptorBuilder('use')
            .setClassName('Router')
            .setLineNumber(57)
            .setFileName('callstack.test.js')
        let actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
        let actualSpanEvent = agent.getTrace(0).repository.dataSender.mockSpan.spanEventList[0]
        t.equal(actualSpanEvent.apiId, actualMethodDescriptor.apiId, 'use(jsonParser) apiId')
        t.equal(actualSpanEvent.sequence, 0, 'use(jsonParser) sequence')
        t.equal(actualSpanEvent.depth, 1, 'use(jsonParser) depth')
        t.equal(actualSpanEvent.serviceType, ServiceTypeCode.express, 'use(jsonParser) serviceType')

        actualBuilder = new MethodDescriptorBuilder('use')
            .setClassName('Router')
            .setLineNumber(58)
            .setFileName('callstack.test.js')
        actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
        actualSpanEvent = agent.getTrace(0).repository.dataSender.mockSpan.spanEventList[1]
        t.equal(actualSpanEvent.apiId, actualMethodDescriptor.apiId, 'use(urlencodedParser) apiId')
        t.equal(actualSpanEvent.sequence, 1, 'use(urlencodedParser) sequence')
        t.equal(actualSpanEvent.depth, 1, 'use(urlencodedParser) depth')
        t.equal(actualSpanEvent.serviceType, ServiceTypeCode.express, 'use(urlencodedParser) serviceType')

        if (semver.satisfies(process.versions.node, '>=17.0')) {
            actualBuilder = new MethodDescriptorBuilder('get')
                .setClassName('proto')
                .setLineNumber(63)
                .setFileName('callstack.test.js')
        } else {
            actualBuilder = new MethodDescriptorBuilder('get')
                .setClassName('Function.proto')
                .setLineNumber(63)
                .setFileName('callstack.test.js')
        }
        actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
        actualSpanEvent = agent.getTrace(0).repository.dataSender.mockSpan.spanEventList[2]
        t.equal(actualSpanEvent.apiId, actualMethodDescriptor.apiId, 'get(/) apiId')
        t.equal(actualSpanEvent.sequence, 2, 'get(/) sequence')
        t.equal(actualSpanEvent.depth, 1, 'get(/) depth')
        t.equal(actualSpanEvent.serviceType, ServiceTypeCode.express, 'get(/) serviceType')

        actualSpanEvent = agent.getTrace(0).repository.dataSender.mockSpan.spanEventList[3]
        t.equal(actualSpanEvent.apiId, 0, 'await axios.get(`https://naver.com`) apiId')
        t.equal(actualSpanEvent.sequence, 3, 'await axios.get(`https://naver.com`) sequence')
        t.equal(actualSpanEvent.depth, 2, 'await axios.get(`https://naver.com`) depth')
        t.equal(actualSpanEvent.serviceType, ServiceTypeCode.ASYNC_HTTP_CLIENT_INTERNAL, 'await axios.get(`https://naver.com`) serviceType')

        let actualAnnotation = actualSpanEvent.annotations[0]
        t.equal(actualAnnotation.key, 12, 'await axios.get(`https://naver.com`) spanevent annotation key')
        t.equal(actualAnnotation.value, 'http.request', 'await axios.get(`https://naver.com`) spanevent annotation value')

        t.equal(agent.getTrace(0).repository.dataSender.mockSpanChunks.length, 1, 'await axios.get(`https://naver.com`) spanchunk is 1')
        let actualSpanChunk = agent.getTrace(0).repository.dataSender.mockSpanChunks[0]
        t.equal(actualSpanChunk.agentId, agent.getTrace(0).repository.dataSender.mockSpan.agentId, 'await axios.get(`https://naver.com`) spanchunk agentId')
        t.equal(actualSpanEvent.asyncId.asyncId, actualSpanChunk.localAsyncId.asyncId, 'await axios.get(`https://naver.com`) nextAsyncId')
        t.equal(actualSpanChunk.localAsyncId.sequence, 1, 'await axios.get(`https://naver.com`) spanchunk localAsyncId.sequence')

        t.end()
        server.close()
    })
})

test('fix express call stack depth without callSite', async (t) => {
    agent.bindHttp()

    const app = new express()
    const path = `/`

    app.use(express.json())
    app.use(express.urlencoded({
        extended: false
    }))

    const router1 = express.Router()
    router1.get(path, async (req, res) => {
        const result = await axios.get(`https://www.naver.com`, { httpsAgent: new https.Agent({ keepAlive: false }) })
        t.equal(result.status, 200)
        res.send('ok router1')
    })
    app.use('/router1', router1)

    const server = app.listen(TEST_ENV.port, async function () {
        const result1 = await axios.get(getServerUrl(`/router1${path}`), {
            timeout: 10000,
            httpAgent: new http.Agent({ keepAlive: false }),
            httpsAgent: new https.Agent({ keepAlive: false }),
        })
        t.ok(result1.status, 200)
        t.ok(result1.data, 'ok router1')

        t.equal(agent.getTrace(0).repository.dataSender.mockSpan.spanEventList.length, 4, `span has 6 span events`)
        t.equal(agent.getTrace(0).repository.dataSender.mockSpan.apiId, defaultPredefinedMethodDescriptorRegistry.nodeServerMethodDescriptor.getApiId(), 'nodeServerMethodDescriptor apiId')

        let actualBuilder = new MethodDescriptorBuilder('use')
            .setClassName('Router')
        let actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
        let actualSpanEvent = agent.getTrace(0).repository.dataSender.mockSpan.spanEventList[0]
        t.equal(actualSpanEvent.apiId, actualMethodDescriptor.apiId, 'use(jsonParser) apiId')
        t.equal(actualSpanEvent.sequence, 0, 'use(jsonParser) sequence')
        t.equal(actualSpanEvent.depth, 1, 'use(jsonParser) depth')
        t.equal(actualSpanEvent.serviceType, ServiceTypeCode.express, 'use(jsonParser) serviceType')

        actualBuilder = new MethodDescriptorBuilder('use')
            .setClassName('Router')
        actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
        actualSpanEvent = agent.getTrace(0).repository.dataSender.mockSpan.spanEventList[1]
        t.equal(actualSpanEvent.apiId, actualMethodDescriptor.apiId, 'use(urlencodedParser) apiId')
        t.equal(actualSpanEvent.sequence, 1, 'use(urlencodedParser) sequence')
        t.equal(actualSpanEvent.depth, 1, 'use(urlencodedParser) depth')
        t.equal(actualSpanEvent.serviceType, ServiceTypeCode.express, 'use(urlencodedParser) serviceType')

        actualSpanEvent = agent.getTrace(0).repository.dataSender.mockSpan.spanEventList[3]
        t.equal(actualSpanEvent.apiId, 0, 'await axios.get(`https://naver.com`) apiId')
        t.equal(actualSpanEvent.sequence, 3, 'await axios.get(`https://naver.com`) sequence')
        t.equal(actualSpanEvent.depth, 2, 'await axios.get(`https://naver.com`) depth')
        t.equal(actualSpanEvent.serviceType, ServiceTypeCode.ASYNC_HTTP_CLIENT_INTERNAL, 'await axios.get(`https://naver.com`) serviceType')
        let actualAnnotation = actualSpanEvent.annotations[0]
        t.equal(actualAnnotation.key, 12, 'await axios.get(`https://naver.com`) spanevent annotation key')
        t.equal(actualAnnotation.value, 'http.request', 'await axios.get(`https://naver.com`) spanevent annotation value')

        t.equal(agent.getTrace(0).repository.dataSender.mockSpanChunks.length, 1, 'await axios.get(`https://naver.com`) spanchunk is 1')
        let actualSpanChunk = agent.getTrace(0).repository.dataSender.mockSpanChunks[0]
        t.equal(actualSpanChunk.agentId, agent.getTrace(0).repository.dataSender.mockSpan.agentId, 'await axios.get(`https://naver.com`) spanchunk agentId')
        t.equal(actualSpanEvent.asyncId.asyncId, actualSpanChunk.localAsyncId.asyncId, 'await axios.get(`https://naver.com`) nextAsyncId')
        t.equal(actualSpanChunk.localAsyncId.asyncId, actualSpanEvent.asyncId.asyncId, 'await axios.get(`https://naver.com`) spanchunk localAsyncId.asyncId')
        t.equal(actualSpanChunk.localAsyncId.sequence, 1, 'await axios.get(`https://naver.com`) spanchunk localAsyncId.sequence')

        t.end()
        server.close()
    })
})