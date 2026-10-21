/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const semver = require('semver')
const InstrumentMethod = require('../../instrument-method')
const MySQLCreateConnectionInterceptor = require('../mysql/mysql-create-connection-interceptor')

module.exports = function (agent, version, createConnection) {
  if (!semver.satisfies(version, '>=3.11.5 <4')) {
    return createConnection
  }

  const traceContext = agent.getTraceContext()
  const target = { createConnection }
  InstrumentMethod.make(target, 'createConnection', traceContext).addScopedInterceptor(new MySQLCreateConnectionInterceptor(traceContext))
  return target.createConnection
}
