/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { nextExceptionId } = require('./id-generator')
const { namedGroupCallSite } = require('../../instrumentation/call-stack')

class Exception {
    constructor(errorClassName, errorMessage, startTime) {
        this.errorClassName = errorClassName
        this.errorMessage = errorMessage
        this.startTime = startTime
        this.exceptionId = nextExceptionId()
        this.exceptionDepth = 1
        this.frameStack = []
    }
}

const nullErrorClassName = 'unknown'
const nullErrorMessage = ''

class ExceptionBuilder {
    constructor(error) {
        this.error = error
    }

    build() {
        if (!this.error || typeof this.error.stack !== 'string') {
            return new Exception(nullErrorClassName, nullErrorMessage, Date.now())
        }

        const stack = this.error.stack.split(/\r?\n/)
        if (stack.length < 1) {
            return new Exception(nullErrorClassName, nullErrorMessage, Date.now())
        }

        const className = this.extractErrorClassName(stack[0])
        const message = this.error.message ?? nullErrorMessage

        const exception = new Exception(className, message, Date.now())
        exception.frameStack = stack.slice(1).map(callSite => {
            return namedGroupCallSite(callSite.trim())
        })
        exception.stack = stack
        return exception
    }

    extractErrorClassName(firstLine) {
        if (!firstLine || typeof firstLine !== 'string') {
            return nullErrorClassName
        }

        const match = /^([^:\s]+):/.exec(firstLine)
        return match && match[1] ? match[1].trim() : nullErrorClassName
    }

}

module.exports = {
    Exception,
    ExceptionBuilder
}