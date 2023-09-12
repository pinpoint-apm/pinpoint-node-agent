/**
 * Pinpoint Node.js Agent
 * Copyright 2023-present NAVER Corp.
 * Apache License v2.0
 */

const MethodDescriptor2 = require('../instrumentation/method-descriptor2')
const MethodType = require('../constant/method-type')

// https://v8.dev/docs/stack-trace-api#appendix%3A-stack-trace-format
class MethodDescriptorBuilder2 {
    constructor(functionName) {
        this.type = MethodType.DEFAULT
        this.apiId = 0
        this.parameterVariableNames = []
        this.functionName = functionName
    }

    setType(type) {
        this.type = type
        return this
    }

    setClassName(className) {
        this.className = className
        return this
    }

    setLineNumber(lineNumber) {
        this.lineNumber = lineNumber
        return this
    }

    setLocation(location) {
        this.location = location
        return this
    }

    getFileName() {
        return this.fileName
    }

    setFileName(fileName) {
        this.fileName = fileName
        return this
    }

    setParameterVariableNames(names) {
        this.parameterVariableNames = names
        return this
    }

    setFunctionName(functionName) {
        this.functionName = functionName
        return this
    }

    setMethodName(methodName) {
        this.methodName = methodName
        return this
    }

    setApiId(apiId) {
        this.apiId = apiId
        return this
    }

    setApiDescriptor(apiDescriptor) {
        this.apiDescriptor = apiDescriptor
        return this
    }

    getCacheId() {
        if (this.apiDescriptor) {
            return this.apiDescriptor
        }
        
        const cacheId = [this.formattedStringOfCall()]

        if (typeof this.fileName === 'string') {
            cacheId.push(this.fileName)
        }

        if (typeof this.lineNumber === 'number') {
            cacheId.push(this.lineNumber)
        }
        return cacheId.join(':')
    }

    toggleConstruct() {
        this.construct = true
        delete this.async
        delete this.type
        return this
    }

    toggleAsync() {
        this.async = true
        delete this.construct
        delete this.type
        return this
    }

    // https://v8.dev/docs/stack-trace-api#appendix%3A-stack-trace-format
    formattedStringOfCall() {
        if (this.needsMethodAndFunctionName() || (this.needsFunctionNameWhenConstructOrAsync())) {
            return `<anonymous>`
        }

        if (this.construct) {
            return `new ${this.functionName}`
        } else if (this.async) {
            return `async ${this.functionName}`
        }

        const formatted = []
        if (typeof this.className === 'string') {
            formatted.push(`${this.className}.`)
        }

        if (typeof this.functionName === 'string') {
            formatted.push(this.functionName)
        }

        if (typeof this.methodName === 'string' && typeof this.functionName === 'string' && this.functionName !== this.methodName) {
            formatted.push(` [as ${this.methodName}]`)
        } else if (typeof this.methodName === 'string' && typeof this.functionName !== 'string') {
            formatted.push(this.methodName)
        }

        return formatted.join('')
    }

    needsMethodAndFunctionName() {
        return !this.functionName && !this.methodName
    }

    needsFunctionNameWhenConstructOrAsync() {
        return (this.construct || this.async) && !this.functionName
    }

    build() {
        const value = new MethodDescriptor2()
        value.methodName = this.methodName
        value.type = this.type
        value.parameterVariableNames = this.parameterVariableNames
        value.lineNumber = this.lineNumber
        value.fullName = this.fullName
        value.apiId = this.apiId
        value.apiDescriptor = this.apiDescriptor || this.formattedStringOfCall()
        value.location = this.location
        value.className = this.className
        return value
    }
}

module.exports = MethodDescriptorBuilder2