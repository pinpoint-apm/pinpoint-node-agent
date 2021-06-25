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
    const stacks = callstack.stack.split(/\n */)

    if (typeof index !== 'number' || stacks.length < index + 1) {
        return
    }

    const stack = stacks[index]
    const captureGroups = stack.match(/at (?<type>\w+(?=\.))?\.?(?<functionName>[^\s]+)(?: \[as (?<methodName>\w+)\])? \(.+\/(?<fileName>[^:/]+):(?<lineNumber>[0-9]+):(?<columnNumber>[0-9]+)\)$/)
    if (!captureGroups || !captureGroups.groups) {
        return
    }
    return MethodDescriptorBuilder.make(moduleName, captureGroups.groups)
}
module.exports = {
    makeMethodDescriptorBuilder
}
