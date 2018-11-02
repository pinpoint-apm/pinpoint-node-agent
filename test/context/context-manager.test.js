const test = require('tap').test

const contextManger = require('context/context-manager')
const Context = require('context/context')

test('Should set and get with same context id', function (t) {
  t.plan(1)

  const context1 = new Context().create()

  contextManger.context = context1
  const context2 = contextManger.context

  t.equal(context1, context2)
})
