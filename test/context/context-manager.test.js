const test = require('tap').test

const contextManger = require('context/context-manager')
const Context = require('context/context')

test('Should set and get with same context id', function (t) {
  t.plan(1)

  this.contextManger = contextManger.create({
    agentId: 'agent-for-dev',
    agenStartTime: Date.now()
  })

  const context = this.contextManger.createNewContext()

  t.equal(context, this.contextManger.currentContext)
})
