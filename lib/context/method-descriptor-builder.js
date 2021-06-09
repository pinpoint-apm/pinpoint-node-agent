/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const MethodDescriptor = require('./method-descriptor')

class MethodDescriptorBuilder {
    build() {
        return new MethodDescriptor()
    }
}

module.exports = MethodDescriptorBuilder