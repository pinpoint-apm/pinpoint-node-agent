/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const MethodDescriptorBuilder = require('./method-descriptor-builder')

class ExpressMethodDescriptorBuilder {
    static make(moduleName, objectPath, methodName) {
        const builder = new MethodDescriptorBuilder(moduleName, objectPath, methodName)
            .setAPIDescriptor('Express Method Descriptor')
            .setFullName(`${moduleName}.${objectPath}.${methodName}`)
        return builder
    }
}

module.exports = ExpressMethodDescriptorBuilder