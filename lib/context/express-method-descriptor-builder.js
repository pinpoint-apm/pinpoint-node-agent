/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class ExpressMethodDescriptorBuilder {
    static make(builder) {
        if (!builder) {
            return
        }
        return builder
            .setParameterDescriptor('(path, callback)')
    }
}

module.exports = ExpressMethodDescriptorBuilder