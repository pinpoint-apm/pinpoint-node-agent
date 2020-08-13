/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const setAsyncId = (object, asyncId) => {
  object.__$pinpoint$_asyncId = asyncId
}

const getAsyncId = (object) => {
  return object.__$pinpoint$_asyncId
}

module.exports = {
  setAsyncId,
  getAsyncId
}