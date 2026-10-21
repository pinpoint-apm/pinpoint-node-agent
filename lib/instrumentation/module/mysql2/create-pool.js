/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const semver = require('semver')
const InstrumentMethod = require('../../instrument-method')
const MySQLCreatePoolInterceptor = require('../mysql/mysql-create-pool-interceptor')

module.exports = function (agent, version, createPool) {
  if (!semver.satisfies(version, '>=3.11.5 <4')) {
    return createPool
  }

  const traceContext = agent.getTraceContext()
  const target = { createPool }
  InstrumentMethod.make(target, 'createPool', traceContext).addScopedInterceptor(new MySQLCreatePoolInterceptor(traceContext))
  return target.createPool
}
