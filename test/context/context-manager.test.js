/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const localStorage = require('../../lib/instrumentation/context/local-storage')

test('Should trace context in setTimeout', async function (t) {
  t.plan(1)

  const initVal = 'value-for-test'
  localStorage.run(initVal, () => {
    setTimeout(() => {
      const currentVal = localStorage.getStore()
      t.equal(currentVal, initVal)
    }, 300)
  })
})

test('Should trace context in setInterval', async function (t) {
  t.plan(1)

  const initVal = 'value-for-test'
  localStorage.run(initVal, () => {
    const interval = setInterval(() => {
      const currentVal = localStorage.getStore()
      t.equal(currentVal, initVal)
      clearInterval(interval)
    }, 300)
  })
})


test('Should trace context in Promise', function (t) {
  t.plan(2)

  const initVal = 'value-for-test'
  localStorage.run(initVal, () => {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        const currentVal = localStorage.getStore()
        t.equal(currentVal, initVal)
        resolve()
      }, 300)
    })
  
    promise.then(() => {
      const resolvedVal = localStorage.getStore()
      t.equal(resolvedVal, initVal)
    })
  })
})

test('Should trace context in setTimeout multiple times', async function (t) {
  t.plan(2)

  let initVal = 1
  localStorage.run(initVal, () => {
    setTimeout(() => {
      const currentVal = localStorage.getStore()
      t.equal(currentVal, initVal)
  
      localStorage.run(++initVal, () => {
        setTimeout(() => {
          const currentVal = localStorage.getStore()
          t.equal(currentVal, initVal)
        }, 300)
      })
    }, 300)
  })
})
