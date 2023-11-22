/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class InstrumentMethodContext {
    constructor(methodDescriptorBuilder) {
        this.methodDescriptorBuilder = methodDescriptorBuilder
    }

    getMethodDescriptorBuilder() {
        return this.methodDescriptorBuilder
    }
}

module.exports = InstrumentMethodContext