/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const disableAsyncId = require('./trace/disable-async-id')

class DisableSpanEventRecorder {
  constructor(traceRoot) {
    this.traceRoot = traceRoot
  }

  recordServiceType() {}

  recordApiDesc() {}

  recordAttribute() {}

  recordApiId() {}

  setApiId0() {}

  getNextAsyncId() {
    return disableAsyncId
  }

  recordNextSpanId() {}

  recordDestinationId() {}

  recordApi() {}

  recordArgs() {}

  recordEndPoint() {}

  recordException(error, markError) {
    if (markError && error) {
      this.traceRoot.getShared().maskErrorCode(1)
    }
  }

  recordSqlInfo() {}

  recordSqlParsingResult() {}
}

class NullDisableSpanEventRecorder {
  getNextAsyncId() {
    return disableAsyncId
  }

  recordServiceType() {}

  recordApiDesc() {}

  recordAttribute() {}

  recordApiId() {}

  setApiId0() {}

  recordNextSpanId() {}

  recordDestinationId() {}

  recordApi() {}

  recordArgs() {}

  recordEndPoint() {}

  recordException() {}

  recordSqlInfo() {}

  recordSqlParsingResult() {}
}

DisableSpanEventRecorder.nullObject = new NullDisableSpanEventRecorder()

module.exports = DisableSpanEventRecorder
