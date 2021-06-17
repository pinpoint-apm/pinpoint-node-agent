/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const MethodDescriptorBuilder = require('../context/method-descriptor-builder')
const makeMethodDescriptorBuilder = (moduleName, objectName, index) => {
    const callstack = {}
    Error.captureStackTrace(callstack, makeMethodDescriptorBuilder)
    const stacks = callstack.stack.split(/\n */)

    if (typeof index !== 'number' || stacks.length < index + 1) {
        return
    }

    const stack = stacks[index]
    const captureGroups = stack.match(/at (?<type>\w+(?=\.))?\.?(?<functionName>[^\s]+)(?: \[as (?<method>\w+)\])? \(.+\/(?<fileName>[^:/]+):(?<lineNumber>[0-9]+):(?<columnNumber>[0-9]+)\)$/)
    if (!captureGroups || !captureGroups.groups) {
        return
    }

    const namedGroups = captureGroups.groups

    let methodName
    if (namedGroups.functionName == '<anonymous>' && !namedGroups.methodName && namedGroups.type && namedGroups.type) {
        methodName = `${namedGroups.type}`
    } else {
        methodName = namedGroups.method || ''
    }
    const builder = new MethodDescriptorBuilder(moduleName, objectName, methodName)

    if (namedGroups.lineNumber && typeof namedGroups.lineNumber === 'string') {
        const lineNumber = parseInt(namedGroups.lineNumber)
        if (typeof lineNumber === 'number') {
            builder.setLineNumber(lineNumber)
        }
    }


    return builder
}
module.exports = {
    makeMethodDescriptorBuilder
}
