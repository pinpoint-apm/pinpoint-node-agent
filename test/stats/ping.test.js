const test = require('tape')
const agent = require('../support/agent-singleton-mock')

test(`send ping interval`, async (t) => {
    agent.bindHttp()

    t.plan(1)

    t.true(agent.pinpointClient.dataSender.pingCount > 0, `agent ping schedule`)
})