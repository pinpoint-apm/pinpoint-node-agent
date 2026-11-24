/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { ExceptionBuilder } = require('./exception-builder')
const { nextExceptionId } = require('./id-generator')

class ExceptionChain {
    constructor(exceptions, maxDepth) {
        this.outermost = exceptions[0]
        this.exceptionId = this.outermost.exceptionId
        this.exceptions = exceptions
        this.maxDepth = maxDepth
    }

    static make(error, startTime, maxDepth) {
        return new ExceptionChain(newExceptions(error, nextExceptionId(), startTime, null, maxDepth), maxDepth)
    }

    valueOf(error, startTime) {
        if (error === this.outermost.error) {
            return this
        }
        const wrapping = newExceptions(error, this.exceptionId, startTime, this.outermost.error, this.maxDepth)
        this.exceptions.forEach(exception => {
            exception.exceptionDepth += wrapping.length
        })
        return new ExceptionChain(wrapping.concat(this.exceptions.filter(exception => exception.exceptionDepth < this.maxDepth)), this.maxDepth)
    }
}

// The error and its causes until the given one share the exceptionId, from depth 0
function newExceptions(error, exceptionId, startTime, until, maxDepth) {
    const exceptions = []
    let current = error
    while (current && current !== until && exceptions.length < maxDepth) {
        exceptions.push(new ExceptionBuilder(current)
            .setExceptionId(exceptionId)
            .setDepth(exceptions.length)
            .setStartTime(startTime)
            .build())
        current = current.cause
    }
    return exceptions
}

module.exports = {
    ExceptionChain
}
