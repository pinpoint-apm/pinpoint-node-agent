/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const semver = require('semver')
const InstrumentMethod = require('../../instrument-method')
const MySQLCreatePoolClusterInterceptor = require('../mysql/mysql-create-pool-cluster-interceptor')

module.exports = function (agent, version, createPoolCluster) {
  if (!semver.satisfies(version, '>=3.11.5 <4')) {
    return createPoolCluster
  }

  const traceContext = agent.getTraceContext()
  const target = { createPoolCluster }
  InstrumentMethod.make(target, 'createPoolCluster', traceContext).addScopedInterceptor(new MySQLCreatePoolClusterInterceptor(traceContext))
  return target.createPoolCluster
}
