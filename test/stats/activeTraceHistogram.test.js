const test = require('tape')
const axios = require('axios')
const { util } = require('../test-helper')
const AgentStatsMonitor = require('../../lib/metric/agent-stats-monitor')
const agent = require('./agent-mock')()
const express = require('express')

const TEST_ENV = {
    host: 'localhost',
    port: 5005,
}
const getServerUrl = (path) => `http://${TEST_ENV.host}:${TEST_ENV.port}${path}`
  
test(`Should get histogram`, function (t) {
    t.plan(4)
  
    const PATH = '/active-trace'
    const LASTONE_PATH = '/active-trace/lastone'
    const app = new express()
  
    app.get(PATH, async (req, res) => {
      res.send('ok get')
    })
    app.get(LASTONE_PATH, async (req, res) => {
      const histogram = activeTrace.getCurrentActiveTraceHistogram()
      log.info(histogram)
      t.equals(histogram.fastCount, 1)
      t.equals(histogram.normalCount, 1)
      t.equals(histogram.slowCount, 1)
      t.equals(histogram.verySlowCount, 1)
      res.send('ok get')
    })
  
    const server = app.listen(TEST_ENV.port, async function () {
      axios.get(getServerUrl(PATH))
      await util.sleep(2000)
      axios.get(getServerUrl(PATH))
      await util.sleep(2000)
      axios.get(getServerUrl(PATH))
      await util.sleep(2000)
      axios.get(getServerUrl(LASTONE_PATH))
  
      const agentStatsMonitor = new AgentStatsMonitor(agent.dataSender, agent.agentId, agent.agentStartTime)
      axios.get(getServerUrl(PATH))
      axios.get(getServerUrl(LASTONE_PATH))
      agentStatsMonitor.send()
      await util.sleep(2000)
      server.close()
    })
  })