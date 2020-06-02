const test = require('tape')
const PinpointClient = require('../../lib/client/pinpoint-client')
const dataSenderMock = require(`../support/data-sender-mock`)
const { fixture, log } = require('../test-helper')

test(`send ping interval`, async (t) => {
    t.plan(1)

    const config = fixture.config
    const client = new PinpointClient(config, {
        agentId: config.agentId
    })
    client.dataSender = dataSenderMock()
    t.true(client.dataSender.pingCount > 0, `agent ping schedule`)
})