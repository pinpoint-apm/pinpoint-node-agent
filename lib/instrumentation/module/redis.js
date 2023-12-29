/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const semver = require('semver')
const log = require('../../utils/logger')
const InstrumentMethod = require('../instrument-method')
const RedisInternalSendCommandInterceptor = require('./redis/redis-internal-send-command-interceptor')

module.exports = function (agent, version, redis) {
  if (!semver.satisfies(version, '>2.5.3')) {
    log.debug('redis version %s not supported - aborting...', version)
    return redis
  }

  const proto = redis.RedisClient && redis.RedisClient.prototype
  log.debug('shimming redis.RedisClient.prototype.internal_send_command')
  InstrumentMethod.make(proto, 'internal_send_command').addScopedInterceptor(new RedisInternalSendCommandInterceptor())
  return redis
}

