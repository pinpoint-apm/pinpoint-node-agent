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

// https://github.com/nodejs/undici
test('shimming require(undici) cause by require-in-the-middle package', function (t) {
    // The testcontainer calls require('undici') in http-wait-strategy.js
    const { undiciHook } = require('../../../lib/instrumentation/module/undici')

    require('undici')
    t.true(undiciHook.isInstrumented, 'undici be instrumented by require("undici")')

    let actual = undiciHook.channels[0]
    t.equal(actual.name, 'undici:request:create', 'undici diagnostics channel is "undici:request:create"')
    t.equal(typeof actual.onMessage, 'function', 'undici diagnostics channel\'s onMessage is function')
    t.true(actual.channel.hasSubscribers, 'undici diagnostics channel has subscribers')
    t.end()
})

// https://nodejs.org/en/learn/getting-started/fetch
test('shimming udici by global nodejs fetch', function (t) {
    const collectorServer = new grpc.Server()
    collectorServer.addService(services.MetadataService, {

    })
    let spanCount = 0
    let spanChunkCount = 0
    collectorServer.addService(services.SpanService, {
        sendSpan: function (call) {
            call.on('data', function (data) {
                spanCount++
                t.true(data, 'span.on("data") is not null')

                if (spanCount === 1) {

                } else if (spanCount === 2) {
                    t.end()
                }
            })
        },
        sendSpanChunk: function (call) {
            call.on('data', function (data) {
                spanChunkCount++
                t.true(data, 'spanChunk.on("data") is not null')
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

        const app = new express()
        app.get('/test', async (req, res) => {
            const response = await fetch('http://localhost:5006/outgoing')
            const text = await response.text()
            res.send(text)
        })

        app.get('/outgoing', (req, res) => {
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