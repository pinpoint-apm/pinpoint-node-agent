/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const semver = require('semver')
const log = require('../../utils/log/logger')
const InstrumentMethod = require('../instrument-method')
const RedisInternalSendCommandInterceptor = require('./redis/redis-internal-send-command-interceptor')

module.exports = function (agent, version, redis) {
  if (!semver.satisfies(version, '>2.5.3')) {
    log.debug('redis version %s not supported - aborting...', version)
    return redis
  }

  const traceContext = agent.getTraceContext()
  InstrumentMethod.make(redis.RedisClient && redis.RedisClient.prototype, 'internal_send_command', traceContext).addScopedInterceptor(new RedisInternalSendCommandInterceptor(traceContext))
  return redis
}

