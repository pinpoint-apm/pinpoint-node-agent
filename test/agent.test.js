const test = require('tape')

const { log, fixture, util, enableDataSending } = require('./test-helper')
enableDataSending()

test('Should initialize agent', function (t) {
  t.plan(1)

  const agent = require('./stats/agent-mock')()
  t.ok(agent)
})
