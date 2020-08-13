/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const convertStringStringValue = (value1, value2) => {
  return {
    stringValue1: value1 ? JSON.stringify(value1) : null,
    stringValue2: value2 ? JSON.stringify(value2) : null,
  }
}

const addressStringOf = (host, port) => {
  if (typeof host != 'string') {
    return null
  }

  if (typeof port != 'number') {
    return null
  }

  return `${host}:${port}`
}

module.exports = {
  convertStringStringValue,
  addressStringOf
}
