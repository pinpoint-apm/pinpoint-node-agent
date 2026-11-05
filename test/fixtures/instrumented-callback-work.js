/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const agent = require('../support/agent-singleton-mock')
const InstrumentMethod = require('../../lib/instrumentation/instrument-method')

const instrumentedCallbackWork = {
    run(callback) {
        setImmediate(callback)
    },
}
InstrumentMethod.make(instrumentedCallbackWork, 'run', agent.getTraceContext()).addScopedInterceptor({ callbackIndexOf: () => 0 })

module.exports = instrumentedCallbackWork
