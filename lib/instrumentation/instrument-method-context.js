/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class InstrumentMethodContext {
    constructor(methodDescriptorBuilder, traceContext) {
        this.methodDescriptorBuilder = methodDescriptorBuilder
        this.traceContext = traceContext
    }

    getMethodDescriptorBuilder() {
        return this.methodDescriptorBuilder
    }

    getTraceContext() {
        return this.traceContext
    }

    currentTraceObject() {
        return this.traceContext.currentTraceObject()
    }
}

module.exports = InstrumentMethodContext