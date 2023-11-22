/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const async_hooks = require('async_hooks')
const traceObjectMap = new Map()

const init = (asyncId, type, triggerAsyncId, resource) => {
  if (type === 'TIMERWRAP') return
  if (traceObjectMap.has(triggerAsyncId)) {
    traceObjectMap.set(asyncId, traceObjectMap.get(triggerAsyncId))
  }
}

const destroy = (asyncId) => {
  if (traceObjectMap.has(asyncId)) {
    traceObjectMap.delete(asyncId)
  }
}

const start = () => {
  async_hooks.createHook({init, destroy}).enable()
}

const getObject = () => {
  const asyncId = async_hooks.executionAsyncId()
  // log.debug('>> GETTER ASYNC ID:', asyncId)
  return traceObjectMap.get(asyncId)
}

const setObject = (value) => {
  const asyncId = async_hooks.executionAsyncId()
  // log.debug('>> SETTER ASYNC ID :', asyncId)
  traceObjectMap.set(asyncId, value)
}

const disable = () => {
  traceObjectMap.clear()
}

module.exports = {
  getObject,
  setObject,
  start,
  disable
}
