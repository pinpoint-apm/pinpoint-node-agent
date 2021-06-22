/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const MethodDescriptor = require('./method-descriptor')

const MethodType = require('../constant/method-type').MethodType

class MethodDescriptorBuilder {
    constructor(moduleName, namedGroup) {
        this.moduleName = moduleName
        this.objectPath = this.makeFunctionName(namedGroup)
        this.functionName = this.makeFunctionName(namedGroup)
        this.methodName = this.makeMethodName(namedGroup)
        this.type = MethodType.DEFAULT
        this.apiDescriptor = this.getDescriptor()
        this.apiId = 0
        this.lineNumber = this.makeLineNumber(namedGroup)
        this.className = namedGroup.type
        this.fileName = namedGroup.fileName
    }

    makeFunctionName(namedGroup) {
        const functionName = namedGroup.functionName
        if (!functionName) {
            return
        }

        if (typeof functionName !== 'string') {
            return
        }

        const computedGroups = functionName.match(/(?<functionName>.+)(?<=\.)<computed>$/)
        if (computedGroups && computedGroups.length > 0 && namedGroup.methodName) {
            return computedGroups.groups.functionName + namedGroup.methodName
        }
        return namedGroup.functionName
    }

    makeMethodName(namedGroups) {
        if (namedGroups.functionName == '<anonymous>' && !namedGroups.methodName && namedGroups.type) {
            return namedGroups.functionName
        }
        return namedGroups.methodName || namedGroups.functionName
    }

    makeLineNumber(namedGroups) {
        if (!namedGroups.lineNumber || typeof namedGroups.lineNumber !== 'string') {
            return
        }
        return parseInt(namedGroups.lineNumber)
    }

    setType(type) {
        this.type = type
        return this
    }

    setAPIDescriptor(apiDescriptor) {
        this.apiDescriptor = apiDescriptor
        return this
    }

    setApiId(apiId) {
        this.apiId = apiId
        return this
    }

    setFullName(fullName) {
        this.fullName = fullName
        return this
    }

    getFullName() {
        return this.fullName
    }

    setLineNumber(lineNumber) {
        this.lineNumber = lineNumber
        return this
    }

    build() {
        return new MethodDescriptor(this.moduleName, this.objectPath, this.methodName, this.type, this.apiDescriptor, this.apiId, this.fullName, this.lineNumber)
    }

    getDescriptor() {
        return [this.moduleName, this.objectPath, this.methodName]
            .filter(v => v)
            .join('.')
    }

    getFunctionName() {
        return this.functionName
    }

    getClassName() {
        return this.className
    }
}

module.exports = MethodDescriptorBuilder