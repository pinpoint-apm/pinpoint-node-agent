/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const DisableSpanEventRecorder = require('./disable-span-event-recorder')

class DisableAsyncTrace {
  traceAsyncBegin () {    
    return new DisableSpanEventRecorder()
  }
    
  traceAsyncEnd () {
  }
    
  canSampled () {
    return false
  }
    
  close () {
  }
}

module.exports = DisableAsyncTrace