/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const MethodType = {
  DEFAULT: 0,
  EXCEPTION: 1,
  ANNOTATION: 2,
  PARAMETER: 3,
  WEB_REQUEST: 100,
  INVOCATION: 200,
  CORRUPTED: 900
}

module.exports = {
  MethodType
}
