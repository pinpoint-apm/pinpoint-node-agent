const test = require('tape')
const axios = require('axios')
const { fixture, util } = require('../test-helper')
const activeTrace = require('../../lib/metric/active-trace')
const agent = require('../support/agent-singleton-mock')
const express = require('express')

const TEST_ENV = {
  host: 'localhost',
  port: 5005,
}
const getServerUrl = (path) => `http://${TEST_ENV.host}:${TEST_ENV.port}${path}`

test(`Should record active trace in multiple call`, function (t) {
  agent.bindEmitHttpModule()

  t.plan(6)

  const PATH = '/active-trace'
  const LASTONE_PATH = '/active-trace/lastone'
  const SHUTDOWN = '/shutdown'
  const app = new express()

  app.get(PATH, async (req, res) => {
    await util.sleep(2000)
    res.send('ok get')
  })

  app.get(LASTONE_PATH, async (req, res) => {
    t.equal(activeTrace.getAllTraces().length, 3, "input request equals")
    res.send('ok get')
  })

  const server = app.listen(TEST_ENV.port, async function () {
    t.equal(activeTrace.getAllTraces().length, 0, "all traces cleaned")

    Promise.all([
      axios.get(getServerUrl(PATH)),
      axios.get(getServerUrl(PATH)),
      axios.get(getServerUrl(LASTONE_PATH)),
    ]).then((result) => {
      t.equal(activeTrace.getAllTraces().length, 0)
      t.equal(agent.mockAgentStartTime, agent.mockAgentInfo.startTimestamp, "startTimestamp equals")
      server.close()
    }).catch((error) => {
      server.close()
    })
  })

  t.equal(agent.mockAgentId, fixture.config.agentId, "Agent ID equals")
  t.equal(agent.mockAgentInfo, agent.pinpointClient.mockAgentInfo, "AgentInfo equals")
})