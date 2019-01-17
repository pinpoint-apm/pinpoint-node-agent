const test = require('tape')
const { log, fixture, util } = require('../test-helper')

const contextManger = require('../../src/context/context-manager')

test('Should trace context in setTimeout', async function (t) {
  t.plan(1)

  const initVal = 'value-for-test'
  contextManger.setObject(initVal)

  setTimeout(() => {
    const currentVal = contextManger.getObject()
    t.equal(currentVal, initVal)
  }, 300)
})

test('Should trace context in setInterval', async function (t) {
  t.plan(1)

  const initVal = 'value-for-test'
  contextManger.setObject(initVal)

  const interval = setInterval(() => {
    const currentVal = contextManger.getObject()
    t.equal(currentVal, initVal)
    clearInterval(interval)
  }, 300)
})


test('Should trace context in Promise', function (t) {
  t.plan(2)

  const initVal = 'value-for-test'
  contextManger.setObject(initVal)

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      const currentVal = contextManger.getObject()
      t.equal(currentVal, initVal)
      resolve()
    }, 300)
  })

  promise.then(() => {
    const resolvedVal = contextManger.getObject()
    t.equal(resolvedVal, initVal)
  })
})

test('Should trace context in setTimeout multiple times', async function (t) {
  t.plan(2)

  let initVal = 1
  contextManger.setObject(initVal)

  setTimeout(() => {
    const currentVal = contextManger.getObject()
    t.equal(currentVal, initVal)
    contextManger.setObject(++initVal)

    setTimeout(() => {
      const currentVal = contextManger.getObject()
      t.equal(currentVal, initVal)
    }, 300)
  }, 300)
})
