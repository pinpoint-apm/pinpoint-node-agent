'use strict'

const SimpleCache = require('../utils/simple-cache')
const HistogramSchema = require('./histogram-schema')
const ActiveTraceHistogram = require('./active-trace-histogram')
const log = require('../utils/logger')

const KEY_PREFIX = '_AT_'

const activeTraceCache = new SimpleCache()

const register = (trace) => {
  if (!trace || !trace.sampling) {
    return
  }
  activeTraceCache.put(getKeyFromTrace(trace), trace)
}

const remove = (trace) => {
  const key = getKeyFromTrace(trace)
  const activeTrace = activeTraceCache.get(key)
  if (activeTrace) {
    activeTraceCache.delete(key)
  }
  // response time
}

const getKeyFromTrace = (trace) => {
  return KEY_PREFIX + (trace.traceId && trace.traceId.transactionSequence())
}

const getAllTraces = () => {
  return activeTraceCache.getAll()
}

const getCurrentActiveTraceHistogram = () => {
  const currentTime = Date.now()
  return getActiveTraceHistogram(currentTime)
}

const getActiveTraceHistogram = (currentTime) => {
  const histogram = new ActiveTraceHistogram(HistogramSchema.NORMAL_SCHEMA)

  if (activeTraceCache.isEmpty()) {
    return histogram
  }

  getAllTraces().forEach(activeTrace => {
    if (activeTrace.getStartTime() > 0) {
      const elapsedTime = currentTime - activeTrace.getStartTime()
      histogram.increase(elapsedTime)
    }
  })
  return histogram
}

module.exports = {
  getAllTraces,
  getCurrentActiveTraceHistogram,
  getActiveTraceHistogram,
  register,
  remove
}
