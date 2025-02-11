/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const agent = require('../../support/agent-singleton-mock')
const express = require('express')
const { MongoDBContainer } = require('@testcontainers/mongodb')
const axios = require('axios')
const grpc = require('@grpc/grpc-js')
const services = require('../../../lib/data/v1/Service_grpc_pb')
const spanMessages = require('../../../lib/data/v1/Span_pb')
const { MongoClient } = require('mongodb')
const apiMetaService = require('../../../lib/context/api-meta-service')
const MethodDescriptorBuilder = require('../../../lib/context/method-descriptor-builder')
const { expected } = require('../../fixtures/instrument-support')

test('mongodb query', async (t) => {
    const collectorServer = new grpc.Server()
    collectorServer.addService(services.MetadataService, {
        requestApiMetaData: (call, callback) => {
            const result = new spanMessages.PResult()
            callback(null, result)
        }
    })
    collectorServer.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), async (error, port) => {
        agent.bindHttp(port)
        const mongodbContainer = await new MongoDBContainer("mongo:6.0.1").start()
        const client = new MongoClient(mongodbContainer.getConnectionString(), { directConnection: true })

        const app = express()
        app.get('/', async (req, res) => {
            const result = await client.db('test1').collection('test').insertOne({ name: 'test' })
            const findOneResult = await client.db('test1').collection('test').findOne({ name: 'test' })
            agent.callbackTraceClose(async (trace) => {
                t.true(result.insertedId, `insertedId is ${result.insertedId}`)
                t.deepEqual(result.insertedId, findOneResult._id, `findOne result is ${findOneResult._id}`)

                let actualSpan = trace.repository.dataSender.mockSpan
                let expectedBuilder = new MethodDescriptorBuilder().setApiDescriptor('Node Server Process')
                let actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(expectedBuilder)
                t.equal(actualSpan.apiId, actualMethodDescriptor.apiId, 'apiId is equal')
                t.equal(actualSpan.serviceType, 1400, 'serviceType is 1400')
                t.equal(actualSpan.endPoint, 'localhost:5006', 'endPoint is localhost:5006')
                t.equal(actualSpan.rpc, '/', 'rpc is /')

                expectedBuilder = new MethodDescriptorBuilder('get')
                    .setClassName('Router')
                let actualSpanEvent = actualSpan.spanEventList[0]
                actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(expectedBuilder)
                t.equal(actualSpanEvent.apiId, actualMethodDescriptor.apiId, 'apiId is equal')
                t.equal(actualSpanEvent.serviceType, 6600, 'serviceType is 6600')
                t.equal(actualSpanEvent.sequence, 0, 'sequence is 0')
                t.equal(actualSpanEvent.depth, 1, 'depth is 1')

                expectedBuilder = new MethodDescriptorBuilder('insert')
                    .setClassName('MongoClient')
                actualSpanEvent = actualSpan.spanEventList[1]
                actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(expectedBuilder)
                t.equal(actualSpanEvent.apiId, actualMethodDescriptor.apiId, 'apiId is equal')
                t.equal(actualSpanEvent.serviceType, 2651, 'serviceType is 2651')
                t.equal(actualSpanEvent.sequence, 1, 'sequence is 1')
                t.equal(actualSpanEvent.depth, 1, 'depth is 1')
                t.equal(actualSpanEvent.endPoint, expected(`[::1]:${mongodbContainer.getFirstMappedPort()}`, `127.0.0.1:${mongodbContainer.getFirstMappedPort()}`), `endPoint is ${actualSpanEvent.endPoint}`)
                t.equal(actualSpanEvent.destinationId, 'test1', 'destinationId is test1')

                expectedBuilder = new MethodDescriptorBuilder('find')
                    .setClassName('MongoClient')
                actualSpanEvent = actualSpan.spanEventList[2]
                actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(expectedBuilder)
                t.equal(actualSpanEvent.apiId, actualMethodDescriptor.apiId, 'apiId is equal')
                t.equal(actualSpanEvent.serviceType, 2651, 'serviceType is 2651')
                t.equal(actualSpanEvent.sequence, 2, 'sequence is 2')
                t.equal(actualSpanEvent.depth, 1, 'depth is 1')
                t.equal(actualSpanEvent.endPoint, expected(`[::1]:${mongodbContainer.getFirstMappedPort()}`, `127.0.0.1:${mongodbContainer.getFirstMappedPort()}`), `endPoint is ${actualSpanEvent.endPoint}`)
                t.equal(actualSpanEvent.destinationId, 'test1', 'destinationId is test1')

                t.end()
            })
            res.send(findOneResult.name)
        })

        const server = app.listen(5006, async () => {
            const result = await axios.get('http://localhost:5006/')
            t.equal(result.status, 200, 'status code is 200')
        })
        t.teardown(async () => {
            client.close()
            server.close()
            await mongodbContainer.stop()
            collectorServer.tryShutdown(() => { })
        })
    })
})

test.skip('mongodb query with error', (t) => {
    const collectorServer = new grpc.Server()
    collectorServer.addService(services.MetadataService, {
        requestApiMetaData: (call, callback) => {
            const result = new spanMessages.PResult()
            callback(null, result)
        }
    })
    collectorServer.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), async (error, port) => {
        agent.bindHttp(port)
        const mongodbContainer = await new MongoDBContainer("mongo:6.0.1").start()
        const client = new MongoClient(mongodbContainer.getConnectionString(), { directConnection: true, serverSelectionTimeoutMS: 100 })

        const app = express()
        app.get('/', async (req, res) => {
            await mongodbContainer.stop()
            const result = await client.db('test1').collection('test').insertOne({ name: 'test' })
            agent.callbackTraceClose(async (trace) => {
                t.end()
            })
            res.send(result.name)
        })

        const server = app.listen(5006, async () => {
            const result = await axios.get('http://localhost:5006/')
            t.equal(result.status, 200, 'status code is 200')
        })
        t.teardown(async () => {
            client.close()
            server.close()
            await mongodbContainer.stop()
            collectorServer.tryShutdown(() => {})
        })
    })
})