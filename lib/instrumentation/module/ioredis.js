/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const semver = require('semver')
const log = require('../../utils/log/logger')
const InstrumentMethod = require('../instrument-method')
const IoredisSendCommandInterceptor = require('./ioredis/ioredis-send-command-interceptor')

module.exports = function (agent, version, ioredis) {
  if (!semver.satisfies(version, '>=2.0.0 <6.0.0')) {
    log.debug('ioredis version %s not supported - aborting...', version)
    return ioredis
  }

  const traceContext = agent.getTraceContext()
  InstrumentMethod.make(ioredis.prototype, 'sendCommand', traceContext).addScopedInterceptor(new IoredisSendCommandInterceptor(traceContext))
  return ioredis
}
