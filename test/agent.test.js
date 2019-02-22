const test = require('tape')

const { log, fixture, util, enableDataSending } = require('./test-helper')
enableDataSending()

test('Should initialize agent', function (t) {
  t.plan(1)

  const Agent = require('../lib/agent')
  const agent = new Agent(fixture.config)

  t.ok(agent)
})


// test.onFinish(() => {
//   agent.dataSender.closeClient()
// })
