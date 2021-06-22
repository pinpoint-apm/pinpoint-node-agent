/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { makeMethodDescriptorBuilder } = require('./make-method-descriptor-builder')

class ExpressMethodDescriptorBuilder {
    static make(builder) {
        const functionName = builder.getFunctionName()
        if (!functionName) {
            const value = builder.setAPIDescriptor(`${builder.getModuleName()}.<anonymous>`)
                .setFullName(`${builder.getModuleName()}.<anonymous>`)
            return value
        }
        return builder
            .setAPIDescriptor(`${functionName}(path, callback)`)
            .setFullName(`${builder.getModuleName()}.${functionName}(path, callback)`)
    }
}

module.exports = ExpressMethodDescriptorBuilder