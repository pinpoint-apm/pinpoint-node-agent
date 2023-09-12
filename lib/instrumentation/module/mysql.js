/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const semver = require('semver')
const log = require('../../utils/logger')
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

  log.debug('shimming mysql.createPool')
  InstrumentMethod.make(mysql, 'createPool', agent.traceContext).addScopedInterceptor(new MySQLCreatePoolInterceptor(agent.traceContext))

  log.debug('shimming mysql.createPoolCluster')
  InstrumentMethod.make(mysql, 'createPoolCluster', agent.traceContext).addScopedInterceptor(new MySQLCreatePoolClusterInterceptor(agent.traceContext))

  log.debug('shimming mysql.createConnection')
  InstrumentMethod.make(mysql, 'createConnection', agent.traceContext).addScopedInterceptor(new MySQLCreateConnectionInterceptor(agent.traceContext))

  return mysql
}
