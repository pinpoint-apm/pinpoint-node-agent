/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const log = require('../../utils/log/logger')
const semver = require('semver')
const InstrumentMethod = require('../instrument-method')
const ExpressUseInterceptor = require('./express/express-use-interceptor')
const ExpressRouteInterceptor = require('./express/express-route-interceptor')

// https://github.com/elastic/apm-agent-nodejs/blob/master/lib/instrumentation/modules/express.js
module.exports = function (agent, version, express) {
  try {
    if (!semver.satisfies(version, '>=4.0.0 <6')) {
      log.warn(`express version ${version} not supported.`)
      return express
    }
  } catch (error) {
    log.error('Invalid Version error')
    return express
  }
  const routerPrototype = semver.satisfies(version, '^5') ? express.Router?.prototype : express.Router
  const traceContext = agent.getTraceContext()
  InstrumentMethod.make(routerPrototype, 'use', traceContext).addScopedInterceptor(new ExpressUseInterceptor(traceContext))
  InstrumentMethod.make(routerPrototype, 'route', traceContext).addScopedInterceptor(new ExpressRouteInterceptor(traceContext))

  return express
}
