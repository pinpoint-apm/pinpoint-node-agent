/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const DisableTrace = require('./disable-trace')

class DisableAsyncTrace extends DisableTrace {
}

module.exports = DisableAsyncTrace