/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

// https://v8.dev/docs/stack-trace-api#appendix%3A-stack-trace-format
class MethodDescriptor {
    constructor(functionName) {
        this.functionName = functionName
    }

    getMethodName() {
        return this.methodName
    }

    getClassName() {
        return this.className
    }

    getParameterTypes() {
        return
    }

    getParameterVariableName() {
        return this.parameterVariableNames
    }

    getLineNumber() {
        return this.lineNumber
    }

    getFullName() {
        return this.fullName
    }

    getApiId() {
        return this.apiId
    }

    getApiDescriptor() {
        return this.apiDescriptor
    }
    
    getType() {
        return this.type
    }

    getLocation() {
        return this.location
    }
}

module.exports = MethodDescriptor