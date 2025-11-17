/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class Exceptions {
    constructor(traceRoot, span, exceptions) {
        this.traceRoot = traceRoot
        this.span = span
        this.exceptions = exceptions
    }
}

class ExceptionsBuilder {
    constructor(traceRoot) {
        this.traceRoot = traceRoot
        this.exceptions = []
    }

    setSpan(span) {
        this.span = span
        return this
    }

    addException(exception) {
        this.exceptions.push(exception)
        return this
    }

    build() {
        return new Exceptions(this.traceRoot, this.span, this.exceptions)
    }
}

module.exports = {
    Exceptions,
    ExceptionsBuilder
}