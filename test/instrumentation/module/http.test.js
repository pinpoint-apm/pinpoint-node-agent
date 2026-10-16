/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const agent = require('../../support/agent-singleton-mock')
const http = require('node:http')
const grpc = require('@grpc/grpc-js')
const services = require('../../../lib/data/v1/Service_grpc_pb')
const GrpcDataSenderBuilder = require('../../client/grpc-data-sender-builder')
const axios = require('axios')
const defaultPredefinedMethodDescriptorRegistry = require('../../../lib/constant/default-predefined-method-descriptor-registry')
const ServiceType = require('../../../lib/context/service-type')
const annotationKey = require('../../../lib/constant/annotation-key')
const { sendRequestOverRawSocket } = require('../../support/raw-http-client')

test('http error status code', (t) => {
    const collectorServer = new grpc.Server()
    let spanOrSpanChunkCallback
    collectorServer.addService(services.SpanService, {
        sendSpan: (call, callback) => {
            call.on('data', (data) => {
                let spanOrSpanChunk = data.getSpan()
                if (!spanOrSpanChunk) {
                    spanOrSpanChunk = data.getSpanchunk()
                }
                spanOrSpanChunkCallback?.(spanOrSpanChunk)
            })
            call.on('end', () => {
                call.end()
            })
        }
    })

    let dataSender
    collectorServer.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (err, port) => {
        dataSender = new GrpcDataSenderBuilder(port)
            .enableSpan()
            .enableSpanChunk()
            .build()
        agent.bindHttp(dataSender)

        const server = http.createServer((req, res) => {
            agent.callbackTraceClose((trace) => {
                actualTrace = trace
            })
            res.writeHead(500)
            res.end('ok')
        })
        server.listen(0, async () => {
            const port = server.address().port
            const result = await axios.get(`http://localhost:${port}`, { httpAgent: new http.Agent({ keepAlive: false }) })
                                    .catch((error) => {
                                        t.equal(error.response.status, 500, 'HTTTP status code should be 500')
                                        return error.response
                                    })
            t.equal(result.status, 500, 'await result HTTTP status code should be 500')
            server.close()
        })
    })

    let actualTrace
    let callbackCount = 0
    spanOrSpanChunkCallback = (actual) => {
        callbackCount++

        if (callbackCount === 1) {
            const pSpan = actual
            const actualPTransactionId = pSpan.getTransactionid()
            const traceRoot = actualTrace.getTraceRoot()
            t.equal(actualPTransactionId.getAgentid(), traceRoot.getAgentId(), `transactionId agentId should be ${traceRoot.getAgentId()}`)
            t.equal(actualPTransactionId.getAgentstarttime(), traceRoot.getTraceId().getAgentStartTime(), `transactionId agentStartTime should be ${traceRoot.getTraceId().getAgentStartTime()}`)
            t.equal(actualPTransactionId.getSequence(), traceRoot.getTraceId().getTransactionId(), `transactionId should be ${traceRoot.getTraceId().getTransactionId()}`)
            t.equal(pSpan.getSpanid(), traceRoot.getTraceId().getSpanId(), `spanId should be ${traceRoot.getTraceId().getSpanId()}`)
            t.equal(pSpan.getParentspanid(), '-1', 'parentSpanId should be -1')
            t.equal(pSpan.getStarttime(), traceRoot.getTraceStartTime(), `startTime should be ${traceRoot.getTraceStartTime()}`)

            const actualSpan = agent.dataSender.getSpan(traceRoot)
            t.equal(pSpan.getElapsed(), actualSpan.elapsedTime, `elapsedTime should be ${actualSpan.elapsedTime}`)
            t.equal(pSpan.getApiid(), defaultPredefinedMethodDescriptorRegistry.nodeServerMethodDescriptor.apiId, `apiId should be ${defaultPredefinedMethodDescriptorRegistry.nodeServerMethodDescriptor.apiId}`)
            t.equal(pSpan.getServicetype(), ServiceType.node.code, `serviceType should be ${ServiceType.node.code}`)

            const pAcceptEvent = pSpan.getAcceptevent()
            t.equal(pAcceptEvent.getRpc(), '/', 'rpc should be /')
            t.equal(pAcceptEvent.getEndpoint(), actualSpan.endPoint, `endpoint should be ${actualSpan.endPoint}`)
            t.equal(pAcceptEvent.getRemoteaddr(), actualSpan.remoteAddress, `remoteAddress should be ${actualSpan.remoteAddress}`)

            t.equal(pSpan.getFlag(), 0, 'flag should be 0')
            t.equal(pSpan.getErr(), 1, 'error should be 1')
        }
        t.end()
    }

    t.teardown(() => {
        collectorServer.forceShutdown()
        dataSender.close()
    })
})
test('http should not mark a client disconnect before the response as an error', (t) => {
    agent.bindHttp()

    let client
    const server = http.createServer((req, res) => {
        agent.callbackTraceClose((trace) => {
            t.equal(trace.spanBuilder.annotations[0].key, annotationKey.HTTP_STATUS_CODE.getCode(), 'HTTP status code annotation is recorded')
            t.equal(trace.spanBuilder.annotations[0].value, 200, 'HTTP status code is 200')
            t.equal(trace.getTraceRoot().getShared().getErrorCode(), undefined, 'client disconnect does not mark the error code')
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
    agent.bindHttp()

    let client
    const server = http.createServer((req, res) => {
        agent.callbackTraceClose((trace) => {
            t.equal(trace.spanBuilder.annotations[0].value, 200, 'HTTP status code is 200')
            t.equal(trace.getTraceRoot().getShared().getErrorCode(), undefined, 'client close after the response does not mark the error code')
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
    agent.bindHttp()

    let client
    const server = http.createServer((req, res) => {
        agent.callbackTraceClose((trace) => {
            t.equal(trace.spanBuilder.annotations[0].value, 500, 'HTTP status code is 500')
            t.equal(trace.getTraceRoot().getShared().getErrorCode(), 1, '500 status code marks the error code')
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
