/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const MethodDescriptor = require('./method-descriptor')

const MethodType = require('../constant/method-type').MethodType

class MethodDescriptorBuilder {
    constructor(moduleName, objectPath, methodName) {
        this.moduleName = moduleName
        this.objectPath = objectPath
        this.methodName = methodName
        this.type = MethodType.DEFAULT
        this.parameterDescriptor = '()'
        this.apiId = 0
        this.apiDescriptor = this.makeApiDescriptor(moduleName, objectPath)
        this.fullName = this.makeFullName(moduleName, objectPath)
    }

    static make(moduleName, namedGroup) {
        const functionName = makeFunctionName(namedGroup)
        const builder = new MethodDescriptorBuilder(moduleName, functionName, makeMethodName(namedGroup))
            .setFunctionName(functionName)
            .setLineNumber(makeLineNumber(namedGroup))
            .setClassName(namedGroup.type)
            .setFileName(namedGroup.fileName)
        return builder
    }

    static makeWithNameGroup(namedGroup) {
        return MethodDescriptorBuilder.make(undefined, namedGroup)
    }

    getModuleName() {
        return this.moduleName
    }

    setType(type) {
        this.type = type
        return this
    }

    setApiDescriptor(apiDescriptor) {
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
        return new MethodDescriptor(this.moduleName, this.objectPath, this.methodName, this.type, this.apiDescriptor, this.apiId, this.fullName, this.className, this.lineNumber, this.fileName)
    }

    makeApiDescriptor(moduleName, objectPath) {
        if (moduleName && !objectPath) {
            return `${moduleName}.<anonymous>`
        }
        return this.getDescriptor()
    }

    getDescriptor() {
        let parameterDescriptor = this.parameterDescriptor
        if (!parameterDescriptor || typeof parameterDescriptor !== 'string') {
            parameterDescriptor = '()'
        }
        if (!this.moduleName && this.className && this.objectPath) {
            return `${this.className}.${this.objectPath}${parameterDescriptor}`
        }
        return [this.objectPath, parameterDescriptor]
            .filter(v => v)
            .join('')
    }

    makeFullName(moduleName, objectPath) {
        if (moduleName && !objectPath) {
            return `${moduleName}.<anonymous>`
        }

        if (moduleName) {
            return `${moduleName}.${this.makeApiDescriptor(moduleName, objectPath)}`
        } else {
            return `${this.makeApiDescriptor(moduleName, objectPath)}`
        }
    }

    getFunctionName() {
        return this.functionName
    }

    setFunctionName(functionName) {
        this.functionName = functionName
        return this
    }

    getClassName() {
        return this.className
    }

    setClassName(className) {
        this.className = className
        return this
    }

    setFileName(fileName) {
        this.fileName = fileName
        return this
    }

    setParameterDescriptor(parameterDescriptor) {
        this.parameterDescriptor = parameterDescriptor
        return this
    }
}

function makeFunctionName(namedGroup) {
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

function makeMethodName(namedGroups) {
    if (namedGroups.functionName == '<anonymous>' && !namedGroups.methodName && namedGroups.type) {
        return namedGroups.functionName
    }
    return namedGroups.methodName || namedGroups.functionName
}

function makeLineNumber(namedGroups) {
    if (!namedGroups.lineNumber || typeof namedGroups.lineNumber !== 'string') {
        return
    }
    return parseInt(namedGroups.lineNumber)
}

module.exports = MethodDescriptorBuilder