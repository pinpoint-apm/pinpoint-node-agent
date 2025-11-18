/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const callSite = (builder, constructorOpt) => {
    if (!builder || typeof builder.setLocation !== 'function' || typeof builder.setFileName !== 'function' || typeof builder.setLineNumber !== 'function' || typeof builder.methodIndex !== 'number') {
        return
    }

    const stackTrace = {}
    const constructorOption = constructorOpt || callSite
    Error.captureStackTrace(stackTrace, constructorOption)
    const callSites = arrayOfStackTrace(stackTrace)

    return makeCloneBuilder(callSites, builder)
}

function makeCloneBuilder(callSites, builder) {
    let namedGroup = namedGroupLocationFileName(callSites, builder.locationFileNameIndex)
    if (builder.isRuntimeDetection()) {
        namedGroup = Object.assign(namedGroup, namedGroupTypeMethod(callSites, builder.methodIndex))
    }

    let newBuilder
    if (builder.isRuntimeDetection() && namedGroup.functionName) {
        newBuilder = builder.makeCloneOf(namedGroup.functionName)
        newBuilder.setClassName(namedGroup.type)
        newBuilder.setMethodName(namedGroup.methodName)
    } else {
        newBuilder = builder.makeCloneOf()
    }
    newBuilder.setLocation(namedGroup.location)
    newBuilder.setFileName(namedGroup.fileName)
    newBuilder.setLineNumber(namedGroup.lineNumber)
    return newBuilder
}

function arrayOfStackTrace(stackTrace) {
    return stackTrace.stack.split(/\n */)
}

function namedGroupLocationFileName(callSites, index) {
    const callSite = callSiteOf(callSites, index)
    return namedGroupLocationFileNameCallSite(callSite)
}

function namedGroupLocationFileNameCallSite(callSite) {
    const namedGroup = captureLocationFileNameNamedGroup(callSite)
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

function callSiteOf(callSites, index) {
    if (typeof index !== 'number' || callSites.length < index + 1) {
        return
    }
    return callSites[index]
}

const captureLocationFileNameNamedGroup = (stack) => {
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
    return stack.match(/ \(?(?<location>[^\s]+\/)(?<fileName>[^:/]+):(?<lineNumber>[0-9]+):(?<columnNumber>[0-9]+)\)?$/)
}

const fileNameOfStack = (stack) => {
    return stack.match(/ \((?<fileName><anonymous>)\)$/)
}

const makeLineNumber = (namedGroups) => {
    if (!namedGroups.lineNumber || typeof namedGroups.lineNumber !== 'string') {
        return
    }
    return parseInt(namedGroups.lineNumber)
}

function namedGroupTypeMethod(callSites, index) {
    const callSite = callSiteOf(callSites, index)
    return namedGroupTypeMethodCallSite(callSite)
}

function namedGroupTypeMethodCallSite(callSite) {
    const functionNameMatches = [newFunctionName, asyncFunctionName, typeFunctionNameMethodName]
    let group
    for (const match of functionNameMatches) {
        group = match(callSite)
        if (group && group.groups) {
            break
        }
    }

    if (!group || !group.groups) {
        return {}
    }

    const result = {}
    const { type, functionName, methodName } = group.groups
    if (type !== undefined) result.type = type
    if (functionName !== undefined) result.functionName = functionName
    if (methodName !== undefined) result.methodName = methodName

    return result
}

const typeFunctionNameMethodName = (callSite) => {
    return callSite.match(/at (?<type>\w+(?=\.))?\.?(?<functionName>[^:/\s(]+)(?: \[as (?<methodName>\w+)\])?/)
}

const newFunctionName = (callSite) => {
    const group = callSite.match(/at new (?<functionName>[^\s]+) /)
    if (!group || !group.groups || !group.groups.functionName) {
        return
    }

    const functionName = toUpperCaseOfFirstCharacter(group)
    return { 'groups': { 'functionName': functionName } }
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

const asyncFunctionName = (callSite) => {
    const group = callSite.match(/at async (?<functionName>[^\s]+) /)
    if (!group || !group.groups || !group.groups.functionName) {
        return
    }

    const functionName = toUpperCaseOfFirstCharacter(group)
    return { 'groups': { 'functionName': functionName } }
}

function namedGroupCallSite(callSite) {
    const namedGroupLocation = namedGroupLocationFileNameCallSite(callSite)
    const namedGroupTypeMethod = namedGroupTypeMethodCallSite(callSite)
    return { ...namedGroupLocation, ...namedGroupTypeMethod }
}

module.exports = {
    callSite,
    namedGroupLocationFileName,
    namedGroupTypeMethod,
    makeCloneBuilder,
    namedGroupCallSite
}