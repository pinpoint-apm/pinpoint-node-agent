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
    return MethodDescriptorBuilder.make(moduleName, captureNamedGroup(stringStackOfCallStack(callstack, index)))
}

const stringStackOfCallStack = (callstack, index) => {
    const stacks = callstack.stack.split(/\n */)

    if (typeof index !== 'number' || stacks.length < index + 1) {
        return
    }

    return stacks[index]
}

const captureNamedGroup = (stack) => {
    const functionNameMatches = [typeFunctionNameMethodName, newFunctionName, ayncFunctionName]
    for (const match of functionNameMatches) {
        var group = match(stack)
        if (group && group.groups) {
            break
        }
    }
    var locationGroup = locationFileNameLineNumber(stack)

    if (!group || !group.groups || !locationGroup || !locationGroup.groups) {
        return
    }
    return Object.assign(group.groups, locationGroup.groups)
}

const typeFunctionNameMethodName = (stack) => {
    return stack.match(/at (?<type>\w+(?=\.))?\.?(?<functionName>[^\s]+)(?: \[as (?<methodName>\w+)\])? \((?<location>.+\/)(?<fileName>[^:/]+):(?<lineNumber>[0-9]+):(?<columnNumber>[0-9]+)\)$/)
}

const locationFileNameLineNumber = (stack) => {
    return stack.match(/ \((?<location>.+\/)(?<fileName>[^:/]+):(?<lineNumber>[0-9]+):(?<columnNumber>[0-9]+)\)$/)
}

const newFunctionName = (stack) => {
    const group = stack.match(/at new (?<functionName>[^\s]+) /)
    if (!group || !group.groups || !group.groups.functionName) {
        return
    }

    const functionName = toUpperCaseOfFirstCharacter(group)
    return { 'groups': { 'functionName': functionName } }
}

const ayncFunctionName = (stack) => {
    const group = stack.match(/at async (?<functionName>[^\s]+) /)
    if (!group || !group.groups || !group.groups.functionName) {
        return
    }

    const functionName = toUpperCaseOfFirstCharacter(group)
    return { 'groups': { 'functionName': functionName } }
}

module.exports = {
    makeMethodDescriptorBuilder,
    captureNamedGroup,
}

function toUpperCaseOfFirstCharacter(group) {
    return Array.from(group.groups.functionName)
        .map((element, index) => {
            if (index == 0 && typeof element === 'string') {
                return element.toUpperCase()
            }
            return element
        })
        .join('')
}
