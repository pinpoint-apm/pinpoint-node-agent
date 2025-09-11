/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const agent = require('../../support/agent-singleton-mock')
const grpc = require('@grpc/grpc-js')
const services = require('../../../lib/data/v1/Service_grpc_pb')
const express = require('express')
const GrpcDataSenderBuilder = require('../../client/grpc-data-sender-builder')
const axios = require('axios')
const http = require('http')
const ServiceType = require('../../../lib/context/service-type')
const defaultPredefinedMethodDescriptorRegistry = require('../../../lib/constant/default-predefined-method-descriptor-registry')
const annotationKey = require('../../../lib/constant/annotation-key')

// https://github.com/nodejs/undici
// The testcontainer calls require('undici') in http-wait-strategy.js
test('shimming require(undici) cause by require-in-the-middle package', function (t) {
    const { request } = require('undici')
    const collectorServer = new grpc.Server()
    let spanCount = 0
    let actualTestSpan
    let actualFetchAPISpan
    let outgoingRequestParentSpanId
    collectorServer.addService(services.SpanService, {
        sendSpan: function (call) {
            call.on('data', function (data) {
                spanCount++
                t.true(data, 'span.on("data") is not null')

                if (spanCount === 1) {
                    const actualOutgoingRequestSpan = data.getSpan()

                    const actualTransactionId = actualOutgoingRequestSpan.getTransactionid()
                    const traceRoot = actualFetchAPISpan.traceRoot
                    t.equal(actualTransactionId.getAgentid(), traceRoot.getAgentId(), `Outgoing request Span agent id is ${traceRoot.getAgentId()}`)
                    t.equal(actualTransactionId.getAgentstarttime(), traceRoot.getTraceId().getAgentStartTime(), `Outgoing request Span agent start time is ${traceRoot.getTraceId().getAgentStartTime()}`)
                    t.equal(actualTransactionId.getSequence(), traceRoot.getTraceId().getTransactionId(), `Outgoing request Span transaction id is ${traceRoot.getTransactionId()}`)
                    t.equal(actualOutgoingRequestSpan.getSpanid(), traceRoot.getTraceId().getSpanId(), `Outgoing request Span span id is ${traceRoot.getTraceId().getSpanId()}`)
                    t.equal(actualOutgoingRequestSpan.getParentspanid(), traceRoot.getTraceId().getParentSpanId(), `Outgoing request Span parent span id is ${traceRoot.getTraceId().getParentSpanId()}`)
                    // https://d2.naver.com/helloworld/1194202
                    outgoingRequestParentSpanId = actualOutgoingRequestSpan.getParentspanid()

                    t.equal(actualOutgoingRequestSpan.getStarttime(), traceRoot.getTraceStartTime(), `Outgoing request Span start time is ${traceRoot.getTraceStartTime()}`)
                    t.equal(actualOutgoingRequestSpan.getElapsed(), actualFetchAPISpan.elapsedTime, `Outgoing request Span elapsed time is ${actualFetchAPISpan.elapsedTime}`)
                    const nodeServerApiId = defaultPredefinedMethodDescriptorRegistry.nodeServerMethodDescriptor
                    t.equal(actualOutgoingRequestSpan.getApiid(), nodeServerApiId.apiId, `Outgoing request Span is ${nodeServerApiId.apiId}`)

                    t.equal(actualOutgoingRequestSpan.getServicetype(), ServiceType.node.code, 'Outgoing request Span service type is node')

                    const actualOutgoingRequestAcceptEvent = actualOutgoingRequestSpan.getAcceptevent()
                    t.equal(actualOutgoingRequestAcceptEvent.getRpc(), '/outgoing', 'Outgoing request Span rpc is /outgoing')
                    t.equal(actualOutgoingRequestAcceptEvent.getEndpoint(), 'localhost:5006', 'Outgoing request Span endpoint is localhost:5006')
                    t.equal(actualOutgoingRequestAcceptEvent.getRemoteaddr(), actualTestSpan.remoteAddress, `Outgoing request Span remote address is ${actualTestSpan.remoteAddress}`)

                    t.equal(actualOutgoingRequestSpan.getFlag(), 0, 'Outgoing request Span flag is 0')
                    t.equal(actualOutgoingRequestSpan.getErr(), 1, 'Outgoing request Span error is 1')
                    t.equal(actualOutgoingRequestSpan.getExceptioninfo(), undefined, 'Outgoing request Span exception info is undefined')
                    t.equal(actualOutgoingRequestSpan.getApplicationservicetype(), ServiceType.node.code, 'Outgoing request Span application service type is node')
                    t.equal(actualOutgoingRequestSpan.getLoggingtransactioninfo(), 0, 'Outgoing request Span logging transaction info is 0')

                    const actualOutgoingRequestSpanEvents = actualOutgoingRequestSpan.getSpaneventList()
                    actualOutgoingRequestSpanEvents.forEach((pSpanEvent, index) => {
                        const spanEvent = actualFetchAPISpan.spanEventList[index]
                        t.equal(pSpanEvent.getSequence(), spanEvent.sequence, `Outgoing request Span event sequence is ${spanEvent.sequence}`)
                        t.equal(pSpanEvent.getDepth(), spanEvent.depth, `Outgoing request Span event depth is ${spanEvent.depth}`)
                        t.equal(pSpanEvent.getStartelapsed(), spanEvent.startElapsedTime, `Outgoing request Span event start elapsed time is ${spanEvent.startElapsed}`)
                        t.equal(pSpanEvent.getEndelapsed(), spanEvent.elapsedTime, `Outgoing request Span event end elapsed time is ${spanEvent.elapsedTime}`)
                        t.equal(pSpanEvent.getServicetype(), spanEvent.serviceType, `Outgoing request Span event service type is ${spanEvent.serviceType}`)
                        t.equal(pSpanEvent.getApiid(), spanEvent.apiId, `Outgoing request Span event api id is ${spanEvent.apiId}`)
                        t.equal(pSpanEvent.getAsyncevent(), spanEvent.asyncId?.getAsyncId() ?? 0, `Outgoing request Span event async id is ${spanEvent.asyncId?.getAsyncId() ?? 0}`)

                        if (index === 1) {
                            t.equal(pSpanEvent.getExceptioninfo().getIntvalue(), spanEvent.exceptionInfo.intValue, `Outgoing request Span event index=${index} exception info is 1`)
                            t.equal(pSpanEvent.getExceptioninfo().getStringvalue().getValue(), spanEvent.exceptionInfo.stringValue, `Outgoing request Span event index=${index} exception info `)
                        }

                        const pMessageEvent = pSpanEvent.getNextevent().getMessageevent()
                        t.equal(pMessageEvent.getNextspanid(), spanEvent.nextSpanId, `Outgoing request Span event next span id is ${spanEvent.nextSpanId}`)
                        t.equal(pMessageEvent.getEndpoint(), spanEvent.endPoint ?? '', `Outgoing request Span event endpoint is ${spanEvent.endPoint}`)
                        t.equal(pMessageEvent.getDestinationid(), spanEvent.destinationId ?? '', `Outgoing request Span event destination id is ${spanEvent.destinationId}`)

                        const pAnnotations = pSpanEvent.getAnnotationList()
                        pAnnotations.forEach((pAnnotation, index) => {
                            const annotation = spanEvent.annotations[index]
                            t.equal(pAnnotation.getKey(), annotation.key, `Outgoing request Span event annotation key is ${annotation.key}`)
                            const pAnnotationValue = pAnnotation.getValue()
                            t.equal(pAnnotationValue.getStringvalue(), annotation.value, `Outgoing request Span event annotation value is ${annotation.value}`)
                        })
                    })
                } else if (spanCount === 2) {
                    const actualPChildTraceByUndici = data.getSpanchunk()

                    const actualTransactionId = actualPChildTraceByUndici.getTransactionid()
                    const traceRoot = actualTestSpan.traceRoot
                    t.equal(actualTransactionId.getAgentid(), traceRoot.getAgentId(), `child trace by undici agent id is ${traceRoot.getAgentId()}`)
                    t.equal(actualTransactionId.getAgentstarttime(), traceRoot.getTraceId().getAgentStartTime(), `child trace by undici agent start time is ${traceRoot.getTraceId().getAgentStartTime()}`)
                    t.equal(actualTransactionId.getSequence(), traceRoot.getTraceId().getTransactionId(), `child trace by undici transaction id is ${traceRoot.getTransactionId()}`)
                    t.equal(actualPChildTraceByUndici.getSpanid(), traceRoot.getTraceId().getSpanId(), `child trace by undici span id is ${traceRoot.getTraceId().getSpanId()}`)

                    const actualSpanChunk = agent.dataSender.getSpanChunk(traceRoot)
                    t.equal(actualPChildTraceByUndici.getEndpoint(), actualSpanChunk.endPoint ?? '', `child trace by undici endpoint is ${actualSpanChunk.endPoint}`)
                    t.equal(actualPChildTraceByUndici.getApplicationservicetype(), actualSpanChunk.applicationServiceType, `child trace by undici application service type is ${actualSpanChunk.applicationServiceType}`)
                    t.equal(actualPChildTraceByUndici.getKeytime(), actualSpanChunk.keyTime, `child trace by undici key time is ${actualSpanChunk.keyTime}`)

                    const pSpanEvents = actualPChildTraceByUndici.getSpaneventList()
                    pSpanEvents.forEach((pSpanEvent, index) => {
                        const spanEvent = actualSpanChunk.spanEventList[index]
                        t.equal(pSpanEvent.getSequence(), spanEvent.sequence, `child trace by undici span event sequence is ${spanEvent.sequence}`)
                        t.equal(pSpanEvent.getDepth(), spanEvent.depth, `child trace by undici span event depth is ${spanEvent.depth}`)
                        t.equal(pSpanEvent.getStartelapsed(), spanEvent.startElapsedTime, `child trace by undici span event start elapsed time is ${spanEvent.startElapsed}`)
                        t.equal(pSpanEvent.getEndelapsed(), spanEvent.elapsedTime, `child trace by undici span event end elapsed time is ${spanEvent.elapsedTime}`)
                        t.equal(pSpanEvent.getServicetype(), spanEvent.serviceType, `child trace by undici span event service type is ${spanEvent.serviceType}`)
                        t.equal(pSpanEvent.getApiid(), spanEvent.apiId, `child trace by undici span event api id is ${spanEvent.apiId}`)
                        t.equal(pSpanEvent.getAsyncevent(), spanEvent.asyncId?.getAsyncId() ?? 0, `child trace by undici span event async id is ${spanEvent.asyncId?.getAsyncId() ?? 0}`)

                        const pMessageEvent = pSpanEvent.getNextevent().getMessageevent()
                        t.equal(pMessageEvent.getNextspanid(), spanEvent.nextSpanId, `child trace by undici span event next span id is ${spanEvent.nextSpanId}`)
                        t.equal(pMessageEvent.getEndpoint(), spanEvent.endPoint ?? '', `child trace by undici span event endpoint is ${spanEvent.endPoint}`)
                        t.equal(pMessageEvent.getDestinationid(), spanEvent.destinationId ?? '', `child trace by undici span event destination id is ${spanEvent.destinationId}`)

                        const pAnnotations = pSpanEvent.getAnnotationList()
                        pAnnotations.forEach((pAnnotation, index) => {
                            const annotation = spanEvent.annotations[index]
                            t.equal(pAnnotation.getKey(), annotation.key, `child trace by undici span event annotation key is ${annotation.key}`)
                            const pAnnotationValue = pAnnotation.getValue()
                            if (annotation.key === annotationKey.HTTP_STATUS_CODE.code) {
                                t.equal(pAnnotationValue.getIntvalue(), annotation.value, `child trace by undici span event annotation value is ${annotation.value}`)
                            } else {
                                t.equal(pAnnotationValue.getStringvalue(), annotation.value, `child trace by undici span event annotation value is ${annotation.value}`)
                            }
                        })
                    })
                } else if (spanCount === 3) {
                    const actualPSpan = data.getSpan()

                    const actualTransactionId = actualPSpan.getTransactionid()
                    const traceRoot = actualTestSpan.traceRoot
                    t.equal(actualTransactionId.getAgentid(), traceRoot.getAgentId(), `agent id is ${traceRoot.getAgentId()}`)
                    t.equal(actualTransactionId.getAgentstarttime(), traceRoot.getTraceId().getAgentStartTime(), `agent start time is ${traceRoot.getTraceId().getAgentStartTime()}`)
                    t.equal(actualTransactionId.getSequence(), traceRoot.getTraceId().getTransactionId(), `transaction id is ${traceRoot.getTransactionId()}`)
                    t.equal(actualPSpan.getSpanid(), traceRoot.getTraceId().getSpanId(), `span id is ${traceRoot.getTraceId().getSpanId()}`)
                    t.equal(actualPSpan.getParentspanid(), '-1', `parent span id is ${traceRoot.getTraceId().getParentSpanId()}`)
                    t.equal(actualPSpan.getSpanid(), outgoingRequestParentSpanId, `The parentSpanId of the outgoing request traceId is the spanId of the /test request ${actualPSpan.getSpanid()}`)

                    t.equal(actualPSpan.getStarttime(), traceRoot.getTraceStartTime(), `start time is ${traceRoot.getTraceStartTime()}`)
                    t.equal(actualPSpan.getElapsed(), actualTestSpan.elapsedTime, `elapsed time is ${actualTestSpan.elapedTime}`)
                    const nodeServerApiId = defaultPredefinedMethodDescriptorRegistry.nodeServerMethodDescriptor
                    t.equal(actualPSpan.getApiid(), nodeServerApiId.apiId, `Node process Span is ${nodeServerApiId.apiId}`)

                    // http-request-trace-builder.js record(spanRecorder)
                    t.equal(actualPSpan.getServicetype(), ServiceType.node.code, 'service type is node')

                    const actualAcceptEvent = actualPSpan.getAcceptevent()
                    t.equal(actualAcceptEvent.getRpc(), '/test', 'rpc is /outgoing')
                    t.equal(actualAcceptEvent.getEndpoint(), 'localhost:5006', 'endpoint is localhost:5006')
                    t.equal(actualAcceptEvent.getRemoteaddr(), actualTestSpan.remoteAddress, `remote address is ${actualTestSpan.remoteAddress}`)

                    t.equal(actualPSpan.getFlag(), 0, 'flag is 0')
                    t.equal(actualPSpan.getErr(), 0, 'error is 0')
                    t.equal(actualPSpan.getExceptioninfo(), undefined, 'exception info is undefined')
                    t.equal(actualPSpan.getApplicationservicetype(), ServiceType.node.code, 'application service type is node')
                    t.equal(actualPSpan.getLoggingtransactioninfo(), 0, 'logging transaction info is 0')

                    const actualSpanEvents = actualPSpan.getSpaneventList()
                    actualSpanEvents.forEach((pSpanEvent, index) => {
                        const spanEvent = actualTestSpan.spanEventList[index]
                        t.equal(pSpanEvent.getSequence(), spanEvent.sequence, `span event sequence is ${spanEvent.sequence}`)
                        t.equal(pSpanEvent.getDepth(), spanEvent.depth, `span event depth is ${spanEvent.depth}`)
                        t.equal(pSpanEvent.getStartelapsed(), spanEvent.startElapsedTime, `span event start elapsed time is ${spanEvent.startElapsed}`)
                        t.equal(pSpanEvent.getEndelapsed(), spanEvent.elapsedTime, `span event end elapsed time is ${spanEvent.elapsedTime}`)
                        t.equal(pSpanEvent.getServicetype(), spanEvent.serviceType, `span event service type is ${spanEvent.serviceType}`)
                        t.equal(pSpanEvent.getApiid(), spanEvent.apiId, `span event api id is ${spanEvent.apiId}`)
                        t.equal(pSpanEvent.getAsyncevent(), spanEvent.asyncId?.getAsyncId() ?? 0, `span event async id is ${spanEvent.asyncId?.getAsyncId() ?? 0}`)

                        const pMessageEvent = pSpanEvent.getNextevent().getMessageevent()
                        t.equal(pMessageEvent.getNextspanid(), spanEvent.nextSpanId, `span event next span id is ${spanEvent.nextSpanId}`)
                        t.equal(pMessageEvent.getEndpoint(), spanEvent.endPoint ?? '', `span event endpoint is ${spanEvent.endPoint}`)
                        t.equal(pMessageEvent.getDestinationid(), spanEvent.destinationId ?? '', `span event destination id is ${spanEvent.destinationId}`)

                        const pAnnotations = pSpanEvent.getAnnotationList()
                        pAnnotations.forEach((pAnnotation, index) => {
                            const annotation = spanEvent.annotations[index]
                            t.equal(pAnnotation.getKey(), annotation.key, `annotation key is ${annotation.key}`)
                            const pAnnotationValue = pAnnotation.getValue()
                            t.equal(pAnnotationValue.getStringvalue(), annotation.value, `annotation value is ${annotation.value}`)
                        })
                    })

                    t.end()
                } else {
                    t.fail('span count is over 3')
                }
            })
        },
    })

    let dataSender
    collectorServer.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (err, port) => {
        dataSender = new GrpcDataSenderBuilder(port)
            .enableSpan()
            .enableSpanChunk()
            .build()
        agent.bindHttp(dataSender)

        const app = new express()
        app.get('/test', async (req, res) => {
            agent.callbackTraceClose((trace) => {
                actualTestSpan = agent.dataSender.getSpan(trace.spanBuilder.traceRoot)
            })
            const { body } = await request('http://localhost:5006/outgoing')
            const text = await body.text()
            res.send(text)
        })

        app.get('/outgoing', (req, res) => {
            agent.callbackTraceClose((trace) => {
                actualFetchAPISpan = agent.dataSender.getSpan(trace.spanBuilder.traceRoot)
            })
            throw new Error('test')
        })

        app.use(function (err, req, res, next) {
            res.status(500).send('Internal Server Error')
        })

        const server = app.listen(5006, async () => {
            const result = await axios.get('http://localhost:5006/test', { httpsAgent: new http.Agent({ keepAlive: false }) })
            t.equal(result.data, 'Internal Server Error', 'response is test')
            server.close()
        })
    })

    t.teardown(() => {
        dataSender.close()
        collectorServer.forceShutdown()
    })
})

if (parseInt(process.versions.node.split('.')[0], 10) < 20) {
    test('node version 20 or higher specific test', function (t) {
        t.pass('This test runs only on Node.js version 20 or higher')
        t.end()
    })
    return
}

// https://nodejs.org/en/learn/getting-started/fetch
test('shimming udici by global nodejs fetch', function (t) {
    const collectorServer = new grpc.Server()
    let spanCount = 0
    let actualTestSpan
    let actualFetchAPISpan
    let outgoingRequestParentSpanId
    collectorServer.addService(services.SpanService, {
        sendSpan: function (call) {
            call.on('data', function (data) {
                spanCount++
                t.true(data, 'span.on("data") is not null')

                if (spanCount === 1) {
                    const actualOutgoingRequestSpan = data.getSpan()

                    const actualTransactionId = actualOutgoingRequestSpan.getTransactionid()
                    const traceRoot = actualFetchAPISpan.traceRoot
                    t.equal(actualTransactionId.getAgentid(), traceRoot.getAgentId(), `Outgoing request Span agent id is ${traceRoot.getAgentId()}`)
                    t.equal(actualTransactionId.getAgentstarttime(), traceRoot.getTraceId().getAgentStartTime(), `Outgoing request Span agent start time is ${traceRoot.getTraceId().getAgentStartTime()}`)
                    t.equal(actualTransactionId.getSequence(), traceRoot.getTraceId().getTransactionId(), `Outgoing request Span transaction id is ${traceRoot.getTransactionId()}`)
                    t.equal(actualOutgoingRequestSpan.getSpanid(), traceRoot.getTraceId().getSpanId(), `Outgoing request Span span id is ${traceRoot.getTraceId().getSpanId()}`)
                    t.equal(actualOutgoingRequestSpan.getParentspanid(), traceRoot.getTraceId().getParentSpanId(), `Outgoing request Span parent span id is ${traceRoot.getTraceId().getParentSpanId()}`)
                    // https://d2.naver.com/helloworld/1194202
                    outgoingRequestParentSpanId = actualOutgoingRequestSpan.getParentspanid()

                    t.equal(actualOutgoingRequestSpan.getStarttime(), traceRoot.getTraceStartTime(), `Outgoing request Span start time is ${traceRoot.getTraceStartTime()}`)
                    t.equal(actualOutgoingRequestSpan.getElapsed(), actualFetchAPISpan.elapsedTime, `Outgoing request Span elapsed time is ${actualFetchAPISpan.elapsedTime}`)
                    const nodeServerApiId = defaultPredefinedMethodDescriptorRegistry.nodeServerMethodDescriptor
                    t.equal(actualOutgoingRequestSpan.getApiid(), nodeServerApiId.apiId, `Outgoing request Span is ${nodeServerApiId.apiId}`)

                    t.equal(actualOutgoingRequestSpan.getServicetype(), ServiceType.node.code, 'Outgoing request Span service type is node')

                    const actualOutgoingRequestAcceptEvent = actualOutgoingRequestSpan.getAcceptevent()
                    t.equal(actualOutgoingRequestAcceptEvent.getRpc(), '/outgoing', 'Outgoing request Span rpc is /outgoing')
                    t.equal(actualOutgoingRequestAcceptEvent.getEndpoint(), 'localhost:5006', 'Outgoing request Span endpoint is localhost:5006')
                    t.equal(actualOutgoingRequestAcceptEvent.getRemoteaddr(), actualTestSpan.remoteAddress, `Outgoing request Span remote address is ${actualTestSpan.remoteAddress}`)

                    t.equal(actualOutgoingRequestSpan.getFlag(), 0, 'Outgoing request Span flag is 0')
                    t.equal(actualOutgoingRequestSpan.getErr(), 0, 'Outgoing request Span error is 0')
                    t.equal(actualOutgoingRequestSpan.getExceptioninfo(), undefined, 'Outgoing request Span exception info is undefined')
                    t.equal(actualOutgoingRequestSpan.getApplicationservicetype(), ServiceType.node.code, 'Outgoing request Span application service type is node')
                    t.equal(actualOutgoingRequestSpan.getLoggingtransactioninfo(), 0, 'Outgoing request Span logging transaction info is 0')

                    const actualOutgoingRequestSpanEvents = actualOutgoingRequestSpan.getSpaneventList()
                    actualOutgoingRequestSpanEvents.forEach((pSpanEvent, index) => {
                        const spanEvent = actualFetchAPISpan.spanEventList[index]
                        t.equal(pSpanEvent.getSequence(), spanEvent.sequence, `Outgoing request Span event sequence is ${spanEvent.sequence}`)
                        t.equal(pSpanEvent.getDepth(), spanEvent.depth, `Outgoing request Span event depth is ${spanEvent.depth}`)
                        t.equal(pSpanEvent.getStartelapsed(), spanEvent.startElapsedTime, `Outgoing request Span event start elapsed time is ${spanEvent.startElapsed}`)
                        t.equal(pSpanEvent.getEndelapsed(), spanEvent.elapsedTime, `Outgoing request Span event end elapsed time is ${spanEvent.elapsedTime}`)
                        t.equal(pSpanEvent.getServicetype(), spanEvent.serviceType, `Outgoing request Span event service type is ${spanEvent.serviceType}`)
                        t.equal(pSpanEvent.getApiid(), spanEvent.apiId, `Outgoing request Span event api id is ${spanEvent.apiId}`)
                        t.equal(pSpanEvent.getAsyncevent(), spanEvent.asyncId?.getAsyncId() ?? 0, `Outgoing request Span event async id is ${spanEvent.asyncId?.getAsyncId() ?? 0}`)

                        const pMessageEvent = pSpanEvent.getNextevent().getMessageevent()
                        t.equal(pMessageEvent.getNextspanid(), spanEvent.nextSpanId, `Outgoing request Span event next span id is ${spanEvent.nextSpanId}`)
                        t.equal(pMessageEvent.getEndpoint(), spanEvent.endPoint ?? '', `Outgoing request Span event endpoint is ${spanEvent.endPoint}`)
                        t.equal(pMessageEvent.getDestinationid(), spanEvent.destinationId ?? '', `Outgoing request Span event destination id is ${spanEvent.destinationId}`)

                        const pAnnotations = pSpanEvent.getAnnotationList()
                        pAnnotations.forEach((pAnnotation, index) => {
                            const annotation = spanEvent.annotations[index]
                            t.equal(pAnnotation.getKey(), annotation.key, `Outgoing request Span event annotation key is ${annotation.key}`)
                            const pAnnotationValue = pAnnotation.getValue()
                            t.equal(pAnnotationValue.getStringvalue(), annotation.value, `Outgoing request Span event annotation value is ${annotation.value}`)
                        })
                    })
                } else if (spanCount === 2) {
                    const actualPChildTraceByUndici = data.getSpanchunk()

                    const actualTransactionId = actualPChildTraceByUndici.getTransactionid()
                    const traceRoot = actualTestSpan.traceRoot
                    t.equal(actualTransactionId.getAgentid(), traceRoot.getAgentId(), `child trace by undici agent id is ${traceRoot.getAgentId()}`)
                    t.equal(actualTransactionId.getAgentstarttime(), traceRoot.getTraceId().getAgentStartTime(), `child trace by undici agent start time is ${traceRoot.getTraceId().getAgentStartTime()}`)
                    t.equal(actualTransactionId.getSequence(), traceRoot.getTraceId().getTransactionId(), `child trace by undici transaction id is ${traceRoot.getTransactionId()}`)
                    t.equal(actualPChildTraceByUndici.getSpanid(), traceRoot.getTraceId().getSpanId(), `child trace by undici span id is ${traceRoot.getTraceId().getSpanId()}`)

                    const actualSpanChunk = agent.dataSender.getSpanChunk(traceRoot)
                    t.equal(actualPChildTraceByUndici.getEndpoint(), actualSpanChunk.endPoint ?? '', `child trace by undici endpoint is ${actualSpanChunk.endPoint}`)
                    t.equal(actualPChildTraceByUndici.getApplicationservicetype(), actualSpanChunk.applicationServiceType, `child trace by undici application service type is ${actualSpanChunk.applicationServiceType}`)
                    t.equal(actualPChildTraceByUndici.getKeytime(), actualSpanChunk.keyTime, `child trace by undici key time is ${actualSpanChunk.keyTime}`)

                    const pSpanEvents = actualPChildTraceByUndici.getSpaneventList()
                    pSpanEvents.forEach((pSpanEvent, index) => {
                        const spanEvent = actualSpanChunk.spanEventList[index]
                        t.equal(pSpanEvent.getSequence(), spanEvent.sequence, `child trace by undici span event sequence is ${spanEvent.sequence}`)
                        t.equal(pSpanEvent.getDepth(), spanEvent.depth, `child trace by undici span event depth is ${spanEvent.depth}`)
                        t.equal(pSpanEvent.getStartelapsed(), spanEvent.startElapsedTime, `child trace by undici span event start elapsed time is ${spanEvent.startElapsed}`)
                        t.equal(pSpanEvent.getEndelapsed(), spanEvent.elapsedTime, `child trace by undici span event end elapsed time is ${spanEvent.elapsedTime}`)
                        t.equal(pSpanEvent.getServicetype(), spanEvent.serviceType, `child trace by undici span event service type is ${spanEvent.serviceType}`)
                        t.equal(pSpanEvent.getApiid(), spanEvent.apiId, `child trace by undici span event api id is ${spanEvent.apiId}`)
                        t.equal(pSpanEvent.getAsyncevent(), spanEvent.asyncId?.getAsyncId() ?? 0, `child trace by undici span event async id is ${spanEvent.asyncId?.getAsyncId() ?? 0}`)

                        const pMessageEvent = pSpanEvent.getNextevent().getMessageevent()
                        t.equal(pMessageEvent.getNextspanid(), spanEvent.nextSpanId, `child trace by undici span event next span id is ${spanEvent.nextSpanId}`)
                        t.equal(pMessageEvent.getEndpoint(), spanEvent.endPoint ?? '', `child trace by undici span event endpoint is ${spanEvent.endPoint}`)
                        t.equal(pMessageEvent.getDestinationid(), spanEvent.destinationId ?? '', `child trace by undici span event destination id is ${spanEvent.destinationId}`)

                        const pAnnotations = pSpanEvent.getAnnotationList()
                        pAnnotations.forEach((pAnnotation, index) => {
                            const annotation = spanEvent.annotations[index]
                            t.equal(pAnnotation.getKey(), annotation.key, `child trace by undici span event annotation key is ${annotation.key}`)
                            const pAnnotationValue = pAnnotation.getValue()
                            if (annotation.key === annotationKey.HTTP_STATUS_CODE.code) {
                                t.equal(pAnnotationValue.getIntvalue(), annotation.value, `child trace by undici span event annotation value is ${annotation.value}`)
                            } else {
                                t.equal(pAnnotationValue.getStringvalue(), annotation.value, `child trace by undici span event annotation value is ${annotation.value}`)
                            }
                        })
                    })
                } else if (spanCount === 3) {
                    const actualPSpan = data.getSpan()

                    const actualTransactionId = actualPSpan.getTransactionid()
                    const traceRoot = actualTestSpan.traceRoot
                    t.equal(actualTransactionId.getAgentid(), traceRoot.getAgentId(), `agent id is ${traceRoot.getAgentId()}`)
                    t.equal(actualTransactionId.getAgentstarttime(), traceRoot.getTraceId().getAgentStartTime(), `agent start time is ${traceRoot.getTraceId().getAgentStartTime()}`)
                    t.equal(actualTransactionId.getSequence(), traceRoot.getTraceId().getTransactionId(), `transaction id is ${traceRoot.getTransactionId()}`)
                    t.equal(actualPSpan.getSpanid(), traceRoot.getTraceId().getSpanId(), `span id is ${traceRoot.getTraceId().getSpanId()}`)
                    t.equal(actualPSpan.getParentspanid(), '-1', `parent span id is ${traceRoot.getTraceId().getParentSpanId()}`)
                    t.equal(actualPSpan.getSpanid(), outgoingRequestParentSpanId, `The parentSpanId of the outgoing request traceId is the spanId of the /test request ${actualPSpan.getSpanid()}`)

                    t.equal(actualPSpan.getStarttime(), traceRoot.getTraceStartTime(), `start time is ${traceRoot.getTraceStartTime()}`)
                    t.equal(actualPSpan.getElapsed(), actualTestSpan.elapsedTime, `elapsed time is ${actualTestSpan.elapedTime}`)
                    const nodeServerApiId = defaultPredefinedMethodDescriptorRegistry.nodeServerMethodDescriptor
                    t.equal(actualPSpan.getApiid(), nodeServerApiId.apiId, `Node process Span is ${nodeServerApiId.apiId}`)

                    // http-request-trace-builder.js record(spanRecorder)
                    t.equal(actualPSpan.getServicetype(), ServiceType.node.code, 'service type is node')

                    const actualAcceptEvent = actualPSpan.getAcceptevent()
                    t.equal(actualAcceptEvent.getRpc(), '/test', 'rpc is /outgoing')
                    t.equal(actualAcceptEvent.getEndpoint(), 'localhost:5006', 'endpoint is localhost:5006')
                    t.equal(actualAcceptEvent.getRemoteaddr(), actualTestSpan.remoteAddress, `remote address is ${actualTestSpan.remoteAddress}`)

                    t.equal(actualPSpan.getFlag(), 0, 'flag is 0')
                    t.equal(actualPSpan.getErr(), 0, 'error is 0')
                    t.equal(actualPSpan.getExceptioninfo(), undefined, 'exception info is undefined')
                    t.equal(actualPSpan.getApplicationservicetype(), ServiceType.node.code, 'application service type is node')
                    t.equal(actualPSpan.getLoggingtransactioninfo(), 0, 'logging transaction info is 0')

                    const actualSpanEvents = actualPSpan.getSpaneventList()
                    actualSpanEvents.forEach((pSpanEvent, index) => {
                        const spanEvent = actualTestSpan.spanEventList[index]
                        t.equal(pSpanEvent.getSequence(), spanEvent.sequence, `span event sequence is ${spanEvent.sequence}`)
                        t.equal(pSpanEvent.getDepth(), spanEvent.depth, `span event depth is ${spanEvent.depth}`)
                        t.equal(pSpanEvent.getStartelapsed(), spanEvent.startElapsedTime, `span event start elapsed time is ${spanEvent.startElapsed}`)
                        t.equal(pSpanEvent.getEndelapsed(), spanEvent.elapsedTime, `span event end elapsed time is ${spanEvent.elapsedTime}`)
                        t.equal(pSpanEvent.getServicetype(), spanEvent.serviceType, `span event service type is ${spanEvent.serviceType}`)
                        t.equal(pSpanEvent.getApiid(), spanEvent.apiId, `span event api id is ${spanEvent.apiId}`)
                        t.equal(pSpanEvent.getAsyncevent(), spanEvent.asyncId?.getAsyncId() ?? 0, `span event async id is ${spanEvent.asyncId?.getAsyncId() ?? 0}`)

                        const pMessageEvent = pSpanEvent.getNextevent().getMessageevent()
                        t.equal(pMessageEvent.getNextspanid(), spanEvent.nextSpanId, `span event next span id is ${spanEvent.nextSpanId}`)
                        t.equal(pMessageEvent.getEndpoint(), spanEvent.endPoint ?? '', `span event endpoint is ${spanEvent.endPoint}`)
                        t.equal(pMessageEvent.getDestinationid(), spanEvent.destinationId ?? '', `span event destination id is ${spanEvent.destinationId}`)

                        const pAnnotations = pSpanEvent.getAnnotationList()
                        pAnnotations.forEach((pAnnotation, index) => {
                            const annotation = spanEvent.annotations[index]
                            t.equal(pAnnotation.getKey(), annotation.key, `annotation key is ${annotation.key}`)
                            const pAnnotationValue = pAnnotation.getValue()
                            t.equal(pAnnotationValue.getStringvalue(), annotation.value, `annotation value is ${annotation.value}`)
                        })
                    })

                    t.end()
                } else {
                    t.fail('span count is over 3')
                }
            })
        },
    })

    let dataSender
    collectorServer.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (err, port) => {
        dataSender = new GrpcDataSenderBuilder(port)
            .enableSpan()
            .enableSpanChunk()
            .build()
        agent.bindHttp(dataSender)

        const app = new express()
        app.get('/test', async (req, res) => {
            agent.callbackTraceClose((trace) => {
                actualTestSpan = agent.dataSender.getSpan(trace.spanBuilder.traceRoot)
            })
            const response = await fetch('http://localhost:5006/outgoing')
            const text = await response.text()
            res.send(text)
        })

        app.get('/outgoing', (req, res) => {
            agent.callbackTraceClose((trace) => {
                actualFetchAPISpan = agent.dataSender.getSpan(trace.spanBuilder.traceRoot)
            })
            res.send('test')
        })

        const server = app.listen(5006, async () => {
            const result = await axios.get('http://localhost:5006/test', { httpsAgent: new http.Agent({ keepAlive: false }) })
            t.equal(result.data, 'test', 'response text is test')
            server.close()
        })
    })

    t.teardown(() => {
        dataSender.close()
        collectorServer.forceShutdown()
    })
})