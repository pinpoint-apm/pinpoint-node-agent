/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { ExceptionRecorder, exceptionRecorderNullObject } = require('./exception-recorder')

class ExceptionEnricher {
    constructor(config) {
        this.config = config
    }

    newExceptionRecorder(traceRoot, dataSender) {
        return new ExceptionRecorder(traceRoot, dataSender, this.config.getMaxDepth())
    }
}

const exceptionEnricherNullObject = Object.freeze({
    newExceptionRecorder() {
        return exceptionRecorderNullObject
    }
})

module.exports = {
    ExceptionEnricher,
    exceptionEnricherNullObject
}
