const async_hooks = require('async_hooks')

const traceObjectMap = new Map()

const init = (asyncId, type, triggerAsyncId, resource) => {
  if (type === 'TIMERWRAP') return
  if (traceObjectMap.get(triggerAsyncId) !== undefined) {
    traceObjectMap.set(asyncId, traceObjectMap.get(triggerAsyncId))
  }
}

const destory = (asyncId) => {
  if (traceObjectMap.has(asyncId)) {
    traceObjectMap.delete(asyncId)
  }
}

async_hooks.createHook({ init, destory }).enable()

const getObject = () => {
  const asyncId = async_hooks.executionAsyncId()
  console.log('getter asyncId :', asyncId)
  return traceObjectMap.get(asyncId)
}

const setObject = (value) => {
  const asyncId = async_hooks.executionAsyncId()
  console.log('setter asyncId :', asyncId)
  traceObjectMap.set(asyncId, value)
}

const getAllObject = () => {
  return traceObjectMap
}

module.exports = {
  getObject,
  setObject,
  getAllObject,
}
