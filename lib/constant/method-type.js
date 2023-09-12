/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

// MethodType.java from pinpoint-java
const MethodType = {
  // method
  DEFAULT: 0,
  // exception message
  EXCEPTION: 1,
  // information
  ANNOTATION: 2,
  // method parameter
  PARAMETER: 3,
  // tomcat, jetty, ...
  WEB_REQUEST: 100,
  // sync/async
  INVOCATION: 200,
  // corrupted when : 1. slow network, 2. too much node ...
  CORRUPTED: 900
}

module.exports = MethodType