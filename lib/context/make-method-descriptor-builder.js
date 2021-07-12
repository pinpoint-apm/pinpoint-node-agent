/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const MethodDescriptorBuilder = require('./method-descriptor-builder')
const makeMethodDescriptorBuilder = (moduleName, index) => {
    const callstack = {}
    Error.captureStackTrace(callstack, makeMethodDescriptorBuilder)
    return methodDescriptorBuilder(moduleName, stringStackOfCallStack(callstack, index))
}

const stringStackOfCallStack = (callstack, index) => {
    const stacks = callstack.stack.split(/\n */)

    if (typeof index !== 'number' || stacks.length < index + 1) {
        return
    }

    return stacks[index]
}

const methodDescriptorBuilder = (moduleName, stack) => {
    const captureGroups = stack.match(/at (?<type>\w+(?=\.))?\.?(?<functionName>[^\s]+)(?: \[as (?<methodName>\w+)\])? \((?<location>.+\/)(?<fileName>[^:/]+):(?<lineNumber>[0-9]+):(?<columnNumber>[0-9]+)\)$/)
    if (!captureGroups || !captureGroups.groups) {
        return
    }
    return MethodDescriptorBuilder.make(moduleName, captureGroups.groups)
}

const typeFunctionNamedCaptureGroup = (stack) => {
    let found = stack.match(/at new (?<functionName>[^\s]+) /)
    if (!found) {
        found = stack.match(/at (?<type>\w+(?=\.))?\.?(?<functionName>[^\s]+)(?: \[as (?<methodName>\w+)\])? /)
        return found && found.groups
    }
    return found && found.groups
}

const makeMethodDescriptorBuilderByFileName = (index) => {
    const callstack = {}
    Error.captureStackTrace(callstack, makeMethodDescriptorBuilderByFileName)
    return methodDescriptorBuilder(undefined, stringStackOfCallStack(callstack, index))
}

module.exports = {
    makeMethodDescriptorBuilder,
    makeMethodDescriptorBuilderByFileName,
    methodDescriptorBuilder,
}