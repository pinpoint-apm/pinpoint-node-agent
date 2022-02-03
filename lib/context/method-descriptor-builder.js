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
        this.computedApiDescriptor = this.makeApiDescriptor()
        this.computedFullName = this.makeFullName(moduleName, objectPath)
    }

    makeApiDescriptor() {
        const buffer = []
        const typeFunctionString = this.typeFunction()
        if (typeFunctionString && typeof typeFunctionString === 'string') {
            buffer.push(typeFunctionString)
        }
        if (this.parameterDescriptor && typeof this.parameterDescriptor === 'string') {
            buffer.push(this.parameterDescriptor)
        }
        return buffer.join('')
    }

    typeFunction() {
        const buffer = []
        if (this.moduleName && typeof this.moduleName === 'string') {
            buffer.push(this.moduleName)
        }
        if (this.className && typeof this.className === 'string') {
            buffer.push(this.className)
        }
        if (this.objectPath && typeof this.objectPath === 'string') {
            buffer.push(this.objectPath)
        }
        return buffer.join('.')
    }

    static make(moduleName, namedGroup) {
        if (!namedGroup || !namedGroup.functionName) {
            return
        }

        const functionName = makeFunctionName(namedGroup)
        const builder = new MethodDescriptorBuilder(moduleName, functionName, makeMethodName(namedGroup))
            .setFunctionName(functionName)
            .setLineNumber(makeLineNumber(namedGroup))
            .setClassName(namedGroup.type)
            .setFileName(namedGroup.fileName)

        if (typeof namedGroup.location === 'string') {
            builder.setLocation(`${namedGroup.location}${namedGroup.fileName}`)
        } else {
            builder.setLocation(`${namedGroup.fileName}`)
        }
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
        return this.fullName || this.computedFullName
    }

    setLineNumber(lineNumber) {
        this.lineNumber = lineNumber
        return this
    }

    getLineNumber() {
        return this.lineNumber
    }

    setLocation(location) {
        this.location = location
        return this
    }

    getLocation() {
        return this.location
    }

    setFileName(fileName) {
        this.fileName = fileName
        return this
    }

    getFileName() {
        return this.fileName
    }

    build() {
        const apiDescriptor = this.apiDescriptor || this.computedApiDescriptor
        const fullName = this.fullName || this.computedFullName
        return new MethodDescriptor(this.moduleName, this.objectPath, this.methodName, this.type, apiDescriptor, this.apiId, fullName, this.className, this.lineNumber, this.location)
    }

    makeFullNameWithApiDescriptor(moduleName, objectPath) {
        if (moduleName && !objectPath) {
            return `${moduleName}.<anonymous>`
        }
        return this.makeFullNameWithApiDescriptorAndParameterDescriptor()
    }

    makeFullNameWithApiDescriptorAndParameterDescriptor() {
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
            return `${moduleName}.${this.makeFullNameWithApiDescriptor(moduleName, objectPath)}`
        } else {
            return `${this.makeFullNameWithApiDescriptor(moduleName, objectPath)}`
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
        this.computedApiDescriptor = this.makeApiDescriptor()
        return this
    }

    setParameterDescriptor(parameterDescriptor) {
        this.parameterDescriptor = parameterDescriptor
        this.computedApiDescriptor = this.makeApiDescriptor()
        this.computedFullName = this.makeFullName(this.moduleName, this.objectPath)
        return this
    }

    getCacheId() {
        return `${this.getFullName()}:${this.lineNumber}:${this.fileName}`
    }

    static makeLineNumber(namedGroups) {
        return makeLineNumber(namedGroups)
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
    if (functionName === '<computed>' && typeof namedGroup.type === 'string' && typeof namedGroup.methodName === 'string') {
        return namedGroup.methodName
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