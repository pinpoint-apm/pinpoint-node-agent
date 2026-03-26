/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { ExceptionBuilder } = require('./exception-builder')

class ExceptionEnricher {
    constructor(config) {
        this.config = config
    }

    recordException(spanEventBuilder, error) {
        const exceptions = new ExceptionBuilder(error, this.config.getMaxDepth()).build()
        spanEventBuilder.setException(exceptions)
        if (exceptions.length > 0) {
            spanEventBuilder.addAnnotation(exceptions[0].exceptionIdAnnotation())
        }
    }
}

const exceptionEnricherNullObject = Object.freeze({
    recordException() {}
})

module.exports = {
    ExceptionEnricher,
    exceptionEnricherNullObject
}
