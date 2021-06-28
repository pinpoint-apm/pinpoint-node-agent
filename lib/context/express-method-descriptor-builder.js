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

        const functionName = builder.getFunctionName()
        if (!functionName) {
            return builder.setApiDescriptor(`${builder.getModuleName()}.<anonymous>`)
                .setFullName(`${builder.getModuleName()}.<anonymous>`)
        }
        return builder
            .setParameterDescriptor('(path, callback)')
    }
}

module.exports = ExpressMethodDescriptorBuilder