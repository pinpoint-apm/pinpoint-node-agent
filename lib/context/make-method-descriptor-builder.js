/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const MethodDescriptorBuilder = require('./method-descriptor-builder')
const makeMethodDescriptorBuilder = (moduleName, index, handlerIndex) => {
    const callstack = {}
    Error.captureStackTrace(callstack, makeMethodDescriptorBuilder)

    const builder = MethodDescriptorBuilder.make(moduleName, captureNamedGroup(stringStackOfCallStack(callstack, index)))

    if (builder && typeof handlerIndex === 'number') {
        const location = locationFileNameLineNumber(stringStackOfCallStack(callstack, handlerIndex))
        if (location && location.groups) {
            const locationGroup = location.groups
            builder.setFileName(locationGroup.fileName)

            if (typeof locationGroup.location === 'string') {
                builder.setLocation(`${locationGroup.location}${locationGroup.fileName}`)
            } else {
                builder.setLocation(`${locationGroup.fileName}`)
            }

            const lineNumber = MethodDescriptorBuilder.makeLineNumber(locationGroup)
            if (lineNumber) {
                builder.setLineNumber(lineNumber)
            }
        }
    }
    return builder
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

    const locationMatches = [locationFileNameLineNumber, fileNameOfStack]
    for (const match of locationMatches) {
        var locationGroup = match(stack)
        if (locationGroup && locationGroup.groups) {
            break
        }
    }

    if (!group || !group.groups || !locationGroup || !locationGroup.groups) {
        return
    }
    return Object.assign(group.groups, locationGroup.groups)
}

const typeFunctionNameMethodName = (stack) => {
    return stack.match(/at (?<type>\w+(?=\.))?\.?(?<functionName>[^\s]+)(?: \[as (?<methodName>\w+)\])? \((?<location>.+\/)(?<fileName>[^:/]+):(?<lineNumber>[0-9]+):(?<columnNumber>[0-9]+)\)$/)
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

const locationFileNameLineNumber = (stack) => {
    return stack.match(/ \((?<location>.+\/)(?<fileName>[^:/]+):(?<lineNumber>[0-9]+):(?<columnNumber>[0-9]+)\)$/)
}

const fileNameOfStack = (stack) => {
    return stack.match(/ \((?<fileName><anonymous>)\)$/)
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
