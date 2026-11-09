/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const { ProcessAgentBuilder, startAgent } = require('../../support/process-agent-builder')
startAgent()
const express = require('express')
const { startMongoDB } = require('../../support/shared-containers')
const axios = require('axios')
const { MongoClient } = require('mongodb')
const apiMetaService = require('../../../lib/context/api-meta-service')
const MethodDescriptorBuilder = require('../../../lib/context/method-descriptor-builder')
const { TestGrpcDataSenderBuilder, MetadataAdaptor, SpanAdaptor } = require('../../support/test-grpc-data-sender')
const RecordingDataSender = require('../../support/recording-data-sender')
const DataSender = require('../../../lib/client/data-sender')

test('mongodb query', async (t) => {
    const grpcDataSenderBuilder = new TestGrpcDataSenderBuilder()
        .addAdaptor(new MetadataAdaptor())
        .addAdaptor(new SpanAdaptor())
    grpcDataSenderBuilder.build().then(async (grpcDataSender) => {
        const dataSender = new RecordingDataSender(new DataSender(grpcDataSender.config, grpcDataSender))
        const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()
        const mongodbContainer = await startMongoDB()
        const client = new MongoClient(mongodbContainer.getConnectionString(), { directConnection: true })

        const app = express()
        let traceRoot
        let result
        let findOneResult
        app.get('/', async (req, res) => {
            traceRoot = agent.currentTraceObject().getTraceRoot()
            result = await client.db('test1').collection('test').insertOne({ name: 'test' })
            findOneResult = await client.db('test1').collection('test').findOne({ name: 'test' })
            res.send(findOneResult.name)
        })

        const server = app.listen(5006, async () => {
            const response = await axios.get('http://localhost:5006/')
            t.equal(response.status, 200, 'status code is 200')

            t.true(result.insertedId, `insertedId is ${result.insertedId}`)
            t.deepEqual(result.insertedId, findOneResult._id, `findOne result is ${findOneResult._id}`)

            let actualSpan = await dataSender.waitForSpan(traceRoot)
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
            t.equal(actualSpanEvent.endPoint.split(':').pop(), `${mongodbContainer.getFirstMappedPort()}`, `port number is ${actualSpanEvent.endPoint.split(':').pop()}`)
            t.equal(actualSpanEvent.destinationId, 'test1', 'destinationId is test1')

            expectedBuilder = new MethodDescriptorBuilder('find')
                .setClassName('MongoClient')
            actualSpanEvent = actualSpan.spanEventList[2]
            actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(expectedBuilder)
            t.equal(actualSpanEvent.apiId, actualMethodDescriptor.apiId, 'apiId is equal')
            t.equal(actualSpanEvent.serviceType, 2651, 'serviceType is 2651')
            t.equal(actualSpanEvent.sequence, 2, 'sequence is 2')
            t.equal(actualSpanEvent.depth, 1, 'depth is 1')
            t.equal(actualSpanEvent.endPoint.split(':').pop(), `${mongodbContainer.getFirstMappedPort()}`, `port number is ${actualSpanEvent.endPoint.split(':').pop()}`)
            t.equal(actualSpanEvent.destinationId, 'test1', 'destinationId is test1')

            t.end()
        })
        t.teardown(async () => {
            client.close()
            server.close()
            grpcDataSender.close()
        })
    })
})
