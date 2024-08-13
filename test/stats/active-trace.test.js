/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const axios = require('axios')
const { fixture, util } = require('../test-helper')
const activeTrace = require('../../lib/metric/active-trace')
const agent = require('../support/agent-singleton-mock')
const express = require('express')
const http = require('http')

const TEST_ENV = {
  host: 'localhost',
  port: 5005,
}
const getServerUrl = (path) => `http://${TEST_ENV.host}:${TEST_ENV.port}${path}`

test(`Should record active trace in multiple call`, function (t) {
  agent.bindHttp()

  const PATH = '/active-trace'
  const LASTONE_PATH = '/active-trace/lastone'
  const SHUTDOWN = '/shutdown'
  const app = new express()

  app.get(PATH, async (req, res) => {
    await util.sleep(2000)
    res.send('ok get')
  })

  app.get(LASTONE_PATH, async (req, res) => {
    res.send('ok get')
  })

  const server = app.listen(TEST_ENV.port, async function () {
    Promise.all([
      axios.get(getServerUrl(PATH), { httpAgent: new http.Agent({ keepAlive: false })}),
      axios.get(getServerUrl(PATH), { httpAgent: new http.Agent({ keepAlive: false })}),
      axios.get(getServerUrl(LASTONE_PATH), { httpAgent: new http.Agent({ keepAlive: false })}),
    ]).then((result) => {
      t.equal(activeTrace.getAllTraces().length, 0)
      t.equal(agent.mockAgentStartTime, agent.agentInfo.startTimestamp, "startTimestamp equals")
      
      server.close()
      t.end()
    }).catch(() => {
      server.close()
      t.end()
    })
  })

  t.equal(agent.mockAgentId, fixture.config.agentId, "Agent ID equals")
  t.equal(agent.agentInfo, agent.pinpointClient.agentInfo, "AgentInfo equals")
})