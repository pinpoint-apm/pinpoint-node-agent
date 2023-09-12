/**
 * Pinpoint Node.js Agent
 * Copyright 2023-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const callSite = (callbackIndex) => {
    const callStack = {}
    Error.captureStackTrace(callStack, callSite)

    const stack = stringStackOfCallStack(callStack, callbackIndex)
    const namedGroup = captureNamedGroup(stack)

    const returnedValue = {}
    if (namedGroup) {
        returnedValue.fileName = namedGroup.fileName

        if (typeof namedGroup.location === 'string') {
            returnedValue.location = `${namedGroup.location}${namedGroup.fileName}`
        } else {
            returnedValue.location = `${namedGroup.fileName}`
        }

        const lineNumber = makeLineNumber(namedGroup)
        if (typeof lineNumber === 'number') {
            returnedValue.lineNumber = lineNumber
        }
    }
    return returnedValue
}

const captureNamedGroup = (stack) => {
    const locationMatches = [locationFileNameLineNumber, fileNameOfStack]
    for (const match of locationMatches) {
        var locationGroup = match(stack)
        if (locationGroup && locationGroup.groups) {
            break
        }
    }

    if (!locationGroup || !locationGroup.groups) {
        return
    }
    return locationGroup.groups
}

const locationFileNameLineNumber = (stack) => {
    return stack.match(/ \((?<location>.+\/)(?<fileName>[^:/]+):(?<lineNumber>[0-9]+):(?<columnNumber>[0-9]+)\)$/)
}

const fileNameOfStack = (stack) => {
    return stack.match(/ \((?<fileName><anonymous>)\)$/)
}

const stringStackOfCallStack = (callstack, index) => {
    const stacks = callstack.stack.split(/\n */)

    if (typeof index !== 'number' || stacks.length < index + 1) {
        return
    }

    return stacks[index]
}

const makeLineNumber = (namedGroups) => {
    if (!namedGroups.lineNumber || typeof namedGroups.lineNumber !== 'string') {
        return
    }
    return parseInt(namedGroups.lineNumber)
}

module.exports = {
    callSite
}