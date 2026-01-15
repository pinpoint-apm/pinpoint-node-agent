/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const semver = require('semver')
const log = require('../../utils/log/logger')
const InstrumentMethod = require('../instrument-method')
const KoaRegisterInterceptor = require('./koa/koa-register-interceptor')

module.exports = function (agent, version, router) {
  if (!semver.satisfies(version, '>=5.2.0 <8')) {
    log.debug('koa-router version %s not supported - aborting...', version)
    return router
  }

  const traceContext = agent.getTraceContext()
  InstrumentMethod.make(router.prototype, 'register', traceContext).addScopedInterceptor(new KoaRegisterInterceptor(traceContext))

  return router
}