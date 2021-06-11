/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const MethodDescriptorBuilder = require('../../context/method-descriptor-builder')

class ExpressMethodDescriptorBuilder {
    constructor(moduleName, objectPath, methodName) {
        this.builder = new MethodDescriptorBuilder(moduleName, objectPath, methodName)
            .setAPIDescriptor('Express Method Descriptor')
            .setFullName(`${moduleName}.${objectPath}.${methodName}`)
    }

    setType(type) {
        this.builder.setType(type)
        return this
    }

    setApiId(apiId) {
        this.builder.setApiId(apiId)
        return this
    }

    setFullName(fullName) {
        this.builder.setFullName(fullName)
        return this
    }

    setLineNumber(lineNumber) {
        this.builder.setLineNumber(lineNumber)
        return this
    }

    build() {
        return this.builder.build()
    }
}

module.exports = ExpressMethodDescriptorBuilder