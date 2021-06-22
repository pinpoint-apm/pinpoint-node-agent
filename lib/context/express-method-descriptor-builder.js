/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class ExpressMethodDescriptorBuilder {
    static make(builder) {
        const functionName = builder.getFunctionName()
        if (!functionName) {
            return builder.setAPIDescriptor(`${builder.getModuleName()}.<anonymous>`)
                .setFullName(`${builder.getModuleName()}.<anonymous>`)
        }
        return builder
            .setAPIDescriptor(`${functionName}(path, callback)`)
            .setFullName(`${builder.getModuleName()}.${functionName}(path, callback)`)
    }
}

module.exports = ExpressMethodDescriptorBuilder