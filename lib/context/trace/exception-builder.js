/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { nextExceptionId } = require('./id-generator')

class Exception {
    constructor(className, message, startTime) {
        this.className = className
        this.message = message
        this.startTime = startTime
        this.exceptionId = nextExceptionId()
        this.exceptionDepth = 1
        this.frameStack = []
    }
}

class ExceptionBuilder {
    constructor(error) {
        this.error = error
    }

    build() {
        return new Exception(
            this.error.name || 'Error',
            this.error.message || '',
            Date.now()
        )
    }
}

module.exports = {
    Exception,
    ExceptionBuilder
}