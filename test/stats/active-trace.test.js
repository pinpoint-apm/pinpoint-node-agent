const test = require('tape')
const axios = require('axios')
const { fixture, util } = require('../test-helper')
const activeTrace = require('../../lib/metric/active-trace')

const enableDataSending = require('../test-helper').enableDataSending
enableDataSending()
const Agent = require('../../lib/agent')

class MockPinpointClient {
  constructor(config, agentInfo) {
    this.mockConfig = config
    this.mockAgentInfo = agentInfo
    this.dataSender = {
      sendApiMetaInfo: function() {

      },
      sendSpan: function() {

      }
    }
  }
}

class MockAgent extends Agent {
  createAgentInfo(config, agentStartTime) {
    this.mockAgentInfo = super.createAgentInfo(config, agentStartTime)
    return this.mockAgentInfo
  }
  
  startSchedule(agentId, agentStartTime) {
    this.mockAgentId = agentId
    this.mockAgentStartTime = agentStartTime
  }

  initializePinpointClient(agentInfo) {
    this.pinpointClient = new MockPinpointClient(this.config, agentInfo)
  }
}
const agent = new MockAgent(fixture.config)

const express = require('express')

const TEST_ENV = {
  host: 'localhost',
  port: 5005,
}
const getServerUrl = (path) => `http://${TEST_ENV.host}:${TEST_ENV.port}${path}`

test(`Should record active trace in multiple call`, function (t) {
  t.plan(5)

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
    await Promise.all([
      axios.get(getServerUrl(PATH)),
      axios.get(getServerUrl(PATH)),
      axios.get(getServerUrl(LASTONE_PATH)),
    ])

    t.equal(activeTrace.getAllTraces().length, 0)
    t.equal(agent.mockAgentStartTime, agent.mockAgentInfo.startTimestamp, "startTimestamp equals")
    server.close()
  })

  t.equal(agent.mockAgentId, fixture.config.agentId, "Agent ID equals")
  t.equal(agent.mockAgentInfo, agent.pinpointClient.mockAgentInfo, "AgentInfo equals")
})
