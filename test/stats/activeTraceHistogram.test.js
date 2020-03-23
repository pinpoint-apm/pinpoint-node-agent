const test = require('tape')
const axios = require('axios')
const AgentStatsMonitor = require('../../lib/metric/agent-stats-monitor')

test(`Should get histogram`, function (t) {
    t.plan(4)
  
    const PATH = '/active-trace'
    const LASTONE_PATH = '/active-trace/lastone'
    const app = new express()
  
    app.get(PATH, async (req, res) => {
      await util.sleep(7000)
      res.send('ok get')
    })
    app.get(LASTONE_PATH, async (req, res) => {
      const histogram = activeTrace.getCurrentActiveTraceHistogram()
      log.info(histogram)
      t.equals(histogram.fastCount, 1)
      t.equals(histogram.normalCount, 1)
      t.equals(histogram.slowCount, 1)
      t.equals(histogram.verySlowCount, 1)
      for (i=0; i< 1000; i++ ) {
        JSON.parse(req)
      }
      await util.sleep(1000)
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
      setInterval(async () => {
        axios.get(getServerUrl(PATH))
        axios.get(getServerUrl(LASTONE_PATH))
        agentStatsMonitor.send()
        await util.sleep(2000)
      }, 3000)
  
      await util.sleep(3000)
      server.close()
    })
  })