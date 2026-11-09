/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const { ProcessAgentBuilder, startAgent, nullDataSenderAgent } = require('../../support/process-agent-builder')
startAgent()
const http = require('node:http')
const { TestGrpcDataSenderBuilder, SpanAdaptor, MetadataAdaptor } = require('../../support/test-grpc-data-sender')
const axios = require('axios')
const defaultPredefinedMethodDescriptorRegistry = require('../../../lib/constant/default-predefined-method-descriptor-registry')
const ServiceType = require('../../../lib/context/service-type')
const annotationKey = require('../../../lib/constant/annotation-key')
const { sendRequestOverRawSocket } = require('../../support/raw-http-client')
const https = require('https')
const express = require('express')
const localStorage = require('../../../lib/instrumentation/context/local-storage')
const HttpRequestTraceBuilder = require('../../../lib/instrumentation/http/http-request-trace-builder')
const TraceHeaderBuilder = require('../../../lib/instrumentation/http/trace-header-builder')
const DataSender = require('../../../lib/client/data-sender')
const RecordingDataSender = require('../../support/recording-data-sender')

const TEST_ENV = {
    host: 'localhost',
    port: 5006,
}
const getServerUrl = (path) => `http://${TEST_ENV.host}:${TEST_ENV.port}${path}`

test('http error status code', async (t) => {
    const spanAdaptor = new SpanAdaptor()
    const grpcDataSender = await new TestGrpcDataSenderBuilder()
        .addAdaptor(spanAdaptor)
        .addAdaptor(new MetadataAdaptor())
        .build()
    t.teardown(() => {
        grpcDataSender.close()
    })
    const dataSender = new RecordingDataSender(new DataSender(grpcDataSender.config, grpcDataSender))
    const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()

    let traceRoot
    const server = http.createServer((req, res) => {
        traceRoot = agent.currentTraceObject().getTraceRoot()
        res.writeHead(500)
        res.end('ok')
    })
    await new Promise(resolve => server.listen(0, resolve))
    const port = server.address().port
    const result = await axios.get(`http://localhost:${port}`, { httpAgent: new http.Agent({ keepAlive: false }) })
                            .catch((error) => {
                                t.equal(error.response.status, 500, 'HTTTP status code should be 500')
                                return error.response
                            })
    t.equal(result.status, 500, 'await result HTTTP status code should be 500')
    server.close()

    const pSpan = await spanAdaptor.span(traceRoot)
    const actualPTransactionId = pSpan.getTransactionid()
    t.equal(actualPTransactionId.getAgentid(), traceRoot.getAgentId(), `transactionId agentId should be ${traceRoot.getAgentId()}`)
    t.equal(actualPTransactionId.getAgentstarttime(), traceRoot.getTraceId().getAgentStartTime(), `transactionId agentStartTime should be ${traceRoot.getTraceId().getAgentStartTime()}`)
    t.equal(actualPTransactionId.getSequence(), traceRoot.getTraceId().getTransactionId(), `transactionId should be ${traceRoot.getTraceId().getTransactionId()}`)
    t.equal(pSpan.getSpanid(), traceRoot.getTraceId().getSpanId(), `spanId should be ${traceRoot.getTraceId().getSpanId()}`)
    t.equal(pSpan.getParentspanid(), '-1', 'parentSpanId should be -1')
    t.equal(pSpan.getStarttime(), traceRoot.getTraceStartTime(), `startTime should be ${traceRoot.getTraceStartTime()}`)

    const actualSpan = dataSender.findSpan(traceRoot)
    t.equal(pSpan.getElapsed(), actualSpan.elapsedTime, `elapsedTime should be ${actualSpan.elapsedTime}`)
    t.equal(pSpan.getApiid(), defaultPredefinedMethodDescriptorRegistry.nodeServerMethodDescriptor.apiId, `apiId should be ${defaultPredefinedMethodDescriptorRegistry.nodeServerMethodDescriptor.apiId}`)
    t.equal(pSpan.getServicetype(), ServiceType.node.code, `serviceType should be ${ServiceType.node.code}`)

    const pAcceptEvent = pSpan.getAcceptevent()
    t.equal(pAcceptEvent.getRpc(), '/', 'rpc should be /')
    t.equal(pAcceptEvent.getEndpoint(), actualSpan.endPoint, `endpoint should be ${actualSpan.endPoint}`)
    t.equal(pAcceptEvent.getRemoteaddr(), actualSpan.remoteAddress, `remoteAddress should be ${actualSpan.remoteAddress}`)

    t.equal(pSpan.getFlag(), 0, 'flag should be 0')
    t.equal(pSpan.getErr(), 1, 'error should be 1')
    t.end()
})
test('http should not mark a client disconnect before the response as an error', (t) => {
    const dataSender = new RecordingDataSender()
    const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()

    let client
    const server = http.createServer((req, res) => {
        dataSender.waitForSpan(agent.currentTraceObject().getTraceRoot()).then((span) => {
            t.equal(span.annotations[0].key, annotationKey.HTTP_STATUS_CODE.getCode(), 'HTTP status code annotation is recorded')
            t.equal(span.annotations[0].value, 200, 'HTTP status code is 200')
            t.equal(span.traceRoot.getShared().getErrorCode(), undefined, 'client disconnect does not mark the error code')
            server.close()
            t.end()
        })
        res.on('close', () => res.end('ok'))
        client.destroy()
    })
    server.listen(0, () => {
        client = sendRequestOverRawSocket(server.address().port, '/')
    })
})

test('http should not mark a client close after the response as an error', (t) => {
    const dataSender = new RecordingDataSender()
    const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()

    let client
    const server = http.createServer((req, res) => {
        dataSender.waitForSpan(agent.currentTraceObject().getTraceRoot()).then((span) => {
            t.equal(span.annotations[0].value, 200, 'HTTP status code is 200')
            t.equal(span.traceRoot.getShared().getErrorCode(), undefined, 'client close after the response does not mark the error code')
            client.destroy()
            server.close()
            t.end()
        })
        res.end('ok')
    })
    server.listen(0, () => {
        client = sendRequestOverRawSocket(server.address().port, '/')
    })
})

test('http should mark a 500 response after a client disconnect as an error', (t) => {
    const dataSender = new RecordingDataSender()
    const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()

    let client
    const server = http.createServer((req, res) => {
        dataSender.waitForSpan(agent.currentTraceObject().getTraceRoot()).then((span) => {
            t.equal(span.annotations[0].value, 500, 'HTTP status code is 500')
            t.equal(span.traceRoot.getShared().getErrorCode(), 1, '500 status code marks the error code')
            server.close()
            t.end()
        })
        res.on('close', () => {
            res.statusCode = 500
            res.end('error')
        })
        client.destroy()
    })
    server.listen(0, () => {
        client = sendRequestOverRawSocket(server.address().port, '/')
    })
})

test('nested request HTTP', async function (t) {
    const dataSender = new RecordingDataSender()
    const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()
    const app = new express()

    let actualAssertsOn5006
    let actualTransactionIdSequence
    app.get('/test', async (req, res) => {
        await axios.get(`http://localhost:5006/test`)
        res.send('ok')

        const actualTraceOn5005 = localStorage.getStore()
        const span = await dataSender.waitForSpan(actualTraceOn5005.getTraceRoot())
        t.equal(req.headers['host'], 'localhost:5005', 'http://localhost:5005/test endPoint')

        if (actualTransactionIdSequence === undefined) {
            actualTransactionIdSequence = span.traceRoot.getTraceId().transactionId
        }
        t.equal(actualTransactionIdSequence, span.traceRoot.getTraceId().transactionId, `http://localhost:5005/test transactionId sequence is ${actualTransactionIdSequence}`)

        actualAssertsOn5006(actualTraceOn5005)

        actualTransactionIdSequence = String(parseInt(actualTransactionIdSequence) + 1)
    })

    const appGraphQL = new express()
    appGraphQL.get('/test', (req, res) => {
        res.send('ok')

        const actualTraceOn5006 = localStorage.getStore()
        actualAssertsOn5006 = (actualTraceOn5005) => {
            const requestTraceBuilder = new HttpRequestTraceBuilder(agent.getTraceContext(), req)
            const requestTrace = requestTraceBuilder.build()
            const traceHeader = new TraceHeaderBuilder(requestTraceBuilder.request).build()
            const traceId = traceHeader.getTraceId()
            t.equal(req.headers['host'], 'localhost:5006', 'http://localhost:5006/test endPoint')
            t.equal(traceId.flags, 0, 'http://localhost:5006/test flags')
            t.equal(traceHeader.host, 'localhost:5006', 'http://localhost:5006/test host')
            t.equal(traceHeader.parentApplicationName, agent.getConfig().getApplicationName(), 'http://localhost:5006/test parentApplicationName')
            t.equal(traceHeader.parentApplicationType, 1400, 'http://localhost:5006/test parentApplicationType')
            t.equal(traceId.parentSpanId, actualTraceOn5005.spanBuilder.traceRoot.getTraceId().spanId, 'http://localhost:5006/test parentSpanId')
            t.equal(requestTrace.rpcName, '/test', 'http://localhost:5006/test rpcName')
            t.equal(traceHeader.sampled, undefined, 'http://localhost:5006/test header sampled')
            t.deepEqual(traceId, actualTraceOn5006.getTraceId(), 'http://localhost:5006/test transactionId')
            t.equal(actualTraceOn5006.getTraceId().getTransactionId(), actualTransactionIdSequence, `http://localhost:5006/test transactionId sequence is ${actualTransactionIdSequence}`)
        }
    })

    const serverGraphQL = appGraphQL.listen(5006, () => {
        const server = app.listen(5005, async function () {
            await axios.get(`http://localhost:5005/test`, { httpAgent: new http.Agent({ keepAlive: false }) })
            await axios.get(`http://localhost:5005/test`, { httpAgent: new http.Agent({ keepAlive: false }) })
            await axios.get(`http://localhost:5005/test`, { httpAgent: new http.Agent({ keepAlive: false }) })
            await axios.get(`http://localhost:5005/test`, { httpAgent: new http.Agent({ keepAlive: false }) })
            await axios.get(`http://localhost:5005/test`, { httpAgent: new http.Agent({ keepAlive: false }) })
            t.end()
            serverGraphQL.close()
            server.close()
        })
    })
})

test('outgoing request when canSample false', (t) => {
    nullDataSenderAgent({ 'sampling': { 'enable': false } })
    const PATH = '/request'
    const app = new express()

    app.get(PATH, async (req, res) => {
        const result1 = await axios.get(getServerUrl(OUTGOING_PATH), {
            timeout: 1000,
            httpAgent: new http.Agent({ keepAlive: false }),
            httpsAgent: new https.Agent({ keepAlive: false }),
        })
        t.equal(result1.data, 'ok get', 'result equals')
        res.send('ok get')
    })

    const OUTGOING_PATH = '/outgoingrequest'
    app.get(OUTGOING_PATH, async (req, res) => {
        // ClientCallStartInterceptor.java requestTraceWriter.write(metadata);
        t.equal('s0', req.headers['pinpoint-sampled'], `sampled Header equals ${req.headers['pinpoint-sampled']}`)
        res.send('ok get')
    })

    const server = app.listen(TEST_ENV.port, async () => {
        const result1 = await axios.get(getServerUrl(PATH), {
            timeout: 1000,
            httpAgent: new http.Agent({ keepAlive: false }),
            httpsAgent: new https.Agent({ keepAlive: false }),
        })
        t.equal(result1.status, 200)

        server.close()
        t.end()
    })
})

test('incomming request agent sampled true', (t) => {
    const dataSender = new RecordingDataSender()
    const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()
    incomingRequest(t, agent, true, dataSender)
})

test('incomming request by User', (t) => {
    const dataSender = new RecordingDataSender()
    const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()

    const app = new express()
    const PATH = '/incommingrequest'
    let expectedTransactionId
    let expectedSpanId
    let expectedFlags
    let incomingTraceRoot
    app.get(PATH, async (req, res) => {
        const trace = agent.currentTraceObject()
        incomingTraceRoot = trace.getTraceRoot()

        expectedTransactionId = trace.getTraceId().toStringDelimiterFormatted()
        expectedSpanId = trace.getTraceId().spanId
        expectedFlags = trace.getTraceId().getFlags()
        t.equal(typeof expectedTransactionId, 'string')
        t.equal(typeof expectedSpanId, 'string')
        t.equal(trace.getTraceId().parentSpanId, '-1')
        t.equal(trace.canSampled(), true)
        t.equal(typeof trace.getTraceId().agentStartTime, 'string')
        t.equal(typeof trace.getTraceId().getTransactionId(), 'string')

        const result1 = await axios.get(getServerUrl(OUTGOING_PATH))
        t.equal(result1.data, 'ok get', 'result equals')
        res.send('ok get')
    })

    const OUTGOING_PATH = '/outgoingrequest'
    app.get(OUTGOING_PATH, async (req, res) => {
        const actualHeaders = {
            'accept': 'application/json, text/plain, */*',
            'user-agent': 'axios/0.18.1',
            'host': 'localhost:5006',
            'pinpoint-traceid': 'express-spring-sampleid^1599831487121^4',
            'pinpoint-spanid': '8478505740685359',
            'pinpoint-pspanid': '-387300102333636357',
            'pinpoint-pappname': agent.getConfig().getApplicationName(),
            'pinpoint-papptype': '1400',
            'pinpoint-flags': '0',
            'pinpoint-host': 'localhost:5006',
            'connection': 'close'
        }
        const headers = req.headers
        t.equal(expectedTransactionId, headers['pinpoint-traceid'])
        t.equal(expectedSpanId, headers['pinpoint-pspanid'])
        t.equal(actualHeaders['pinpoint-pappname'], headers['pinpoint-pappname'])
        t.equal(actualHeaders['pinpoint-papptype'], headers['pinpoint-papptype'])
        t.equal(actualHeaders['pinpoint-host'], headers['pinpoint-host'])
        t.equal(actualHeaders['pinpoint-sampled'], headers['pinpoint-sampled'])
        t.equal(expectedFlags, headers['pinpoint-flags'], `flags Header equals ${expectedFlags}`)
        res.send('ok get')
    })

    const server = app.listen(TEST_ENV.port, async () => {
        const result1 = await axios.get(getServerUrl(PATH))
        t.equal(result1.status, 200)
        const actualTraceId = (await dataSender.waitForSpan(incomingTraceRoot)).traceRoot.getTraceId()
        t.equal(typeof actualTraceId.getSpanId(), 'string')
        t.equal(typeof actualTraceId.getParentSpanId(), 'string')
        t.equal(typeof actualTraceId.agentStartTime, 'string')
        t.equal(typeof actualTraceId.getTransactionId(), 'string')
        server.close()
        t.end()
    })
})

//https://github.com/naver/pinpoint/blob/ab07664e2ed944e90aa9c44f7e39597f39264c2b/bootstrap-core/src/main/java/com/navercorp/pinpoint/bootstrap/plugin/request/DefaultTraceHeaderReader.java#L78
function incomingRequest(t, agent, sampled, dataSender) {
    const app = new express()

    let config = {
        headers: {
            'host': 'localhost:3000',
            'connection': 'Keep-Alive',
            'accept-encoding': 'gzip',
            'user-agent': 'okhttp/4.8.1',
            'pinpoint-traceid': 'express-spring-sampleid^1599831487121^4',
            'pinpoint-spanid': '-387300102333636357',
            'pinpoint-pspanid': '3116250228920588432',
            'pinpoint-flags': '0',
            'pinpoint-pappname': 'express-spring-sample',
            'pinpoint-papptype': '1210',
            'pinpoint-host': 'localhost:3000'
        },
        params: {},
        timeout: 1000,
        httpAgent: new http.Agent({ keepAlive: false }),
        httpsAgent: new https.Agent({ keepAlive: false }),
    }

    const PATH = '/incommingrequest'
    let expectedTransactionId
    let expectedSpanId
    let incomingTraceRoot
    app.get(PATH, async (req, res) => {
        const trace = agent.currentTraceObject()
        incomingTraceRoot = trace.getTraceRoot()
        const headers = config.headers

        expectedTransactionId = trace.getTraceRoot().getTraceId().toStringDelimiterFormatted()
        expectedSpanId = trace.getTraceRoot().getTraceId().getSpanId()
        t.equal(expectedTransactionId, headers['pinpoint-traceid'], `traceId Header equals ${expectedTransactionId}`)
        t.equal(expectedSpanId, headers['pinpoint-spanid'], `spanId Header equals ${expectedSpanId}`)
        t.equal(trace.getTraceRoot().getTraceId().getParentSpanId(), headers['pinpoint-pspanid'], `parentSpanId Header equals ${trace.getTraceRoot().getTraceId().getParentSpanId()}`)
        t.equal(trace.canSampled(), sampled, `sampled equals ${trace.canSampled()}`)

        const result1 = await axios.get(getServerUrl(OUTGOING_PATH), {
            timeout: 1000,
            httpAgent: new http.Agent({ keepAlive: false }),
            httpsAgent: new https.Agent({ keepAlive: false }),
        })
        t.equal(result1.data, 'ok get', 'result equals')
        res.send('ok get')
    })

    const OUTGOING_PATH = '/outgoingrequest'
    app.get(OUTGOING_PATH, async (req, res) => {
        const expectedHeaders = {
            'accept': 'application/json, text/plain, */*',
            'user-agent': 'axios/0.18.1',
            'host': 'localhost:5006',
            'pinpoint-traceid': 'express-spring-sampleid^1599831487121^4',
            'pinpoint-spanid': '8478505740685359',
            'pinpoint-pspanid': '-387300102333636357',
            'pinpoint-pappname': agent.getConfig().getApplicationName(),
            'pinpoint-papptype': '1400',
            'pinpoint-flags': '0',
            'pinpoint-host': 'localhost:5006',
            'connection': 'close'
        }
        const headers = req.headers
        if (sampled) {
            t.equal(expectedTransactionId, headers['pinpoint-traceid'])
            t.equal(expectedSpanId, headers['pinpoint-pspanid'])
            t.equal(expectedHeaders['pinpoint-pappname'], headers['pinpoint-pappname'])
            t.equal(expectedHeaders['pinpoint-papptype'], headers['pinpoint-papptype'])
            t.equal(expectedHeaders['pinpoint-host'], headers['pinpoint-host'])
            t.equal(expectedHeaders['pinpoint-sampled'], headers['pinpoint-sampled'])
        } else {
            // ClientCallStartInterceptor.java requestTraceWriter.write(metadata);
            t.equal('s0', headers['pinpoint-sampled'])
        }
        res.send('ok get')
    })

    const server = app.listen(TEST_ENV.port, async () => {
        const result1 = await axios.get(getServerUrl(PATH), config)
        t.equal(result1.status, 200)
        if (sampled) {
            const actualTraceId = (await dataSender.waitForSpan(incomingTraceRoot)).traceRoot.getTraceId()
            t.equal(typeof actualTraceId.getSpanId(), 'string')
            t.equal(typeof actualTraceId.getParentSpanId(), 'string')
            t.equal(typeof actualTraceId.getAgentStartTime(), 'string')
            t.equal(typeof actualTraceId.getTransactionId(), 'string')
        }
        server.close()
        t.end()
    })
}
