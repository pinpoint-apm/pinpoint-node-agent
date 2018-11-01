const test = require('tape')

const contextManger = require('../../src/context/context-manager')
const Context = require('../../src/context/context')

test('Should set and get with same context id', function (t) {
  t.plan(1)

  const context1 = new Context().createNew()

  contextManger.context = context1
  const context2 = contextManger.context

  t.equal(context1, context2)
})
