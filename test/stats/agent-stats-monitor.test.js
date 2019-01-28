const test = require('tape')
const axios = require('axios')

const { log, fixture, util, enableDataSending } = require('../test-helper')
enableDataSending()

const Agent = require('../../src/agent')
const agent = new Agent(fixture.config)
const AgentStatsMonitor = require('../../src/metric/agent-stats-monitor')

const express = require('express')

const TEST_ENV = {
  host: 'localhost',
  port: 5006,
}
const getServerUrl = (path) => `http://${TEST_ENV.host}:${TEST_ENV.port}${path}`

test('Should collect and send stats one', function (t) {
  t.plan(1)

  const statsMonitor = new AgentStatsMonitor(agent.dataSender, agent.agentId, agent.agentStartTime)
  statsMonitor.send()

  t.ok(statsMonitor)
})

test.only(`Should send stats in every 1 sec`, function (t) {
  t.plan(1)

  const PATH = '/active-trace'
  const app = new express()

  app.get(PATH, async (req, res) => {
    const randomMillis = util.randomBetween(1, 6) * 1000
    log.info('randomMillis', randomMillis)
    await util.sleep(randomMillis)

    // give cpu load
    // for (i=0; i< 1000; i++ ) {
    //   JSON.parse(res)
    // }

    res.send('ok get')
  })

  const server = app.listen(TEST_ENV.port, async function () {
    const timer = setInterval(async () => {
      axios.get(getServerUrl(PATH))
      count++
    }, 4000)

    // server.close()
  })
})

test.onFinish(() => {
  agent.dataSender.closeClient()
})
