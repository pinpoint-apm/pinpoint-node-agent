/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const agent = require('../../support/agent-singleton-mock')
const {
    GenericContainer
} = require("testcontainers")

test(`mongodb`, async (t) => {
    const container = await new GenericContainer("mongo")
        .withExposedPorts(27017)
        .start()

    agent.bindHttp()
    const trace = agent.createTraceObject()
    const Server = require('mongodb-core').Server
    var server = new Server({
        host: container.getHost(),
        port: container.getMappedPort(27017),
        reconnect: true,
        reconnectInterval: 50
    })

    // Add event listeners
    server.on('connect', async function (_server) {
        console.log('mongodb-core.test.js connected')

        // Execute the ismaster command
        _server.command('system.$cmd', {
            ismaster: true
        }, async function (err, result) {
            // Perform a document insert
            _server.insert('myproject.inserts1', [{
                a: 1
            }, {
                a: 2
            }], {
                writeConcern: {
                    w: 1
                },
                ordered: true
            }, async function (err, results) {
                t.equal(null, err)
                t.equal(2, results.result.n)

                server.destroy()
                await container.stop()
                agent.completeTraceObject(trace)
                t.end()
            })
        })
    })

    server.on('close', function () {
        console.log('mongodb-core.test.js closed')
        t.end()
    })

    server.on('reconnect', function () {
        console.log('mongodb-core.test.js reconnect')
    })

    // Start connection
    server.connect()

})