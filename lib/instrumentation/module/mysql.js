/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const semver = require('semver')
const log = require('../../utils/log/logger')
const InstrumentMethod = require('../instrument-method')
const MySQLCreateConnectionInterceptor = require('./mysql/mysql-create-connection-interceptor')
const MySQLCreatePoolInterceptor = require('./mysql/mysql-create-pool-interceptor')
const MySQLCreatePoolClusterInterceptor = require('./mysql/mysql-create-pool-cluster-interceptor')

// https://github.com/elastic/apm-agent-nodejs/blob/master/lib/instrumentation/modules/mysql.js
module.exports = function (agent, version, mysql) {
  if (!semver.satisfies(version, '^2.0.0')) {
    log.debug('mysql version %s not supported - aborting...', version)
    return mysql
  }

  const traceContext = agent.getTraceContext()
  InstrumentMethod.make(mysql, 'createPool', traceContext).addScopedInterceptor(new MySQLCreatePoolInterceptor(traceContext))
  InstrumentMethod.make(mysql, 'createPoolCluster', traceContext).addScopedInterceptor(new MySQLCreatePoolClusterInterceptor(traceContext))
  InstrumentMethod.make(mysql, 'createConnection', traceContext).addScopedInterceptor(new MySQLCreateConnectionInterceptor(traceContext))

  return mysql
}
