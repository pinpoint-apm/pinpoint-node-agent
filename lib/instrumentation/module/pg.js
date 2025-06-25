/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const semver = require('semver')
const log = require('../../utils/logger')
const InstrumentMethod = require('../instrument-method')
const PostgreSQLStatementExecuteQueryInterceptor = require('./pg/pg-statement-execute-query-interceptor')

// Support pg versions 7.x and 8.x
module.exports = function (agent, version, pg) {
  if (!semver.satisfies(version, '>=7.0.0')) {
    log.debug('pg version %s not supported - aborting...', version)
    return pg
  }

  const traceContext = agent.getTraceContext()
  InstrumentMethod.make(pg.Client.prototype, 'query', traceContext).addScopedInterceptor(new PostgreSQLStatementExecuteQueryInterceptor('Client'))

  return pg
}