const test = require('tape')
const axios = require('axios')

const { log, fixture, util, enableDataSending } = require('../test-helper')
enableDataSending()

const Agent = require('../../lib/agent')
const PinpointClient = require('../../lib/client/pinpoint-client')
const activeTrace = require('../../lib/metric/active-trace')
const AgentStatsMonitor = require('../../lib/metric/agent-stats-monitor')

const express = require('express')

const TEST_ENV = {
  host: 'localhost',
  port: 5005,
}
const getServerUrl = (path) => `http://${TEST_ENV.host}:${TEST_ENV.port}${path}`

class MockAgent extends Agent {
}
const agent = new MockAgent(fixture.config)

class MockPinpointClient {
}

test(`Should record active trace in multiple call`, function (t) {
  t.plan(2)

  const PATH = '/active-trace'
  const LASTONE_PATH = '/active-trace/lastone'
  const SHUTDOWN = '/shutdown'
  const app = new express()

  app.get(PATH, async (req, res) => {
    await util.sleep(2000)
    res.send('ok get')
  })

  app.get(LASTONE_PATH, async (req, res) => {
    t.equal(activeTrace.getAllTraces().length, 3)
    res.send('ok get')
  })

  app.get(SHUTDOWN, async(req, res) => {
    server.close()
  })

  const server = app.listen(TEST_ENV.port, async function () {
    await Promise.all([
      axios.get(getServerUrl(PATH)),
      axios.get(getServerUrl(PATH)),
      axios.get(getServerUrl(LASTONE_PATH)),
    ])

    t.equal(activeTrace.getAllTraces().length, 0)
    await axios.get(getServerUrl(SHUTDOWN))
  })
})

// test(`Should get histogram`, function (t) {
//   t.plan(4)

//   const PATH = '/active-trace'
//   const LASTONE_PATH = '/active-trace/lastone'
//   const app = new express()

//   app.get(PATH, async (req, res) => {
//     await util.sleep(7000)
//     for (i=0; i< 1000; i++ ) {
//       JSON.parse(res)
//     }
//     res.send('ok get')
//   })
//   app.get(LASTONE_PATH, async (req, res) => {
//     const histogram = activeTrace.getCurrentActiveTraceHistogram()
//     log.info(histogram)
//     t.equals(histogram.fastCount, 1)
//     t.equals(histogram.normalCount, 1)
//     t.equals(histogram.slowCount, 1)
//     t.equals(histogram.verySlowCount, 1)
//     for (i=0; i< 1000; i++ ) {
//       JSON.parse(req)
//     }
//     await util.sleep(1000)
//     res.send('ok get')
//   })

//   const server = app.listen(TEST_ENV.port, async function () {
//     axios.get(getServerUrl(PATH))
//     await util.sleep(2000)
//     axios.get(getServerUrl(PATH))
//     await util.sleep(2000)
//     axios.get(getServerUrl(PATH))
//     await util.sleep(2000)
//     axios.get(getServerUrl(LASTONE_PATH))

//     const agentStatsMonitor = new AgentStatsMonitor(agent.dataSender, agent.agentId, agent.agentStartTime)
//     setInterval(async () => {
//       axios.get(getServerUrl(PATH))
//       axios.get(getServerUrl(LASTONE_PATH))
//       agentStatsMonitor.send()
//       await util.sleep(2000)
//     }, 3000)

//     await util.sleep(3000)
//     server.close()
//   })
// })

test.onFinish(() => {
  agent.pinpointClient.dataSender.closeClient()
})
