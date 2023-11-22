/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const semver = require('semver')
const log = require('../../utils/logger')
const InstrumentMethod = require('../instrument-method')
const MySQLCreatePoolInterceptor = require('./mysql/mysql-create-pool-interceptor')
const MySQLCreatePoolClusterInterceptor = require('./mysql/mysql-create-pool-cluster-interceptor')
const MySQLCreateConnectionInterceptor = require('./mysql/mysql-create-connection-interceptor')

module.exports = function (agent, version, mysql) {
  if (!semver.satisfies(version, '>=1 <4')) {
    log.debug('mysql2 version %s not supported - aborting...', version)
    return mysql
  }

  log.debug('shimming mysql.createPool')
  InstrumentMethod.make(mysql, 'createPool').addScopedInterceptor(new MySQLCreatePoolInterceptor())

  log.debug('shimming mysql.createPoolCluster')
  InstrumentMethod.make(mysql, 'createPoolCluster').addScopedInterceptor(new MySQLCreatePoolClusterInterceptor())

  log.debug('shimming mysql.createConnection')
  InstrumentMethod.make(mysql, 'createConnection').addScopedInterceptor(new MySQLCreateConnectionInterceptor())
  
  return mysql
}