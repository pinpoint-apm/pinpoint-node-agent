/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')

const MethodDescriptorBuilder = require('../../lib/context/method-descriptor-builder')
test('express callstack', (t) => {
    const regex = /at (?<type>\w+(?=\.))?\.?(?<functionName>[^\s]+)(?: \[as (?<methodName>\w+)\])? \(.+\/(?<fileName>[^:/]+):(?<lineNumber>[0-9]+):(?<columnNumber>[0-9]+)\)$/

    let stack = 'at Function.app.<computed> [as get] (/Users/feelform/workspace/pinpoint/pinpoint-node-agent/node_modules/express/lib/application.js:481:30)'
    let captureGroups = stack.match(regex)
    if (!captureGroups || !captureGroups.groups) {
        return
    }
    let actual = MethodDescriptorBuilder.make('express', captureGroups.groups)
    t.equal(actual.methodName, 'get', 'methodName')
    t.equal(actual.functionName, 'app.get', 'functionName')
    t.equal(actual.className, 'Function', 'className')
    t.equal(actual.lineNumber, 481, 'lineNumber')
    t.equal(actual.getCacheId(), 'express.app.get():481:application.js', `cache ID check`)

    let actualMethodDescriptor = actual.build()
    t.equal(actualMethodDescriptor.getModuleName(), 'express', 'MethodDescriptor moduleName')
    t.equal(actualMethodDescriptor.getFunctionName(), 'app.get', 'MethodDescriptor functionName')
    t.equal(actualMethodDescriptor.getMethodName(), 'get', 'MethodDescriptor methodName')
    t.equal(actualMethodDescriptor.getClassName(), 'Function', 'MethodDescriptor methodName')
    t.equal(actualMethodDescriptor.getLineNumber(), 481, 'MethodDescriptor lineNumber')

    stack = 'at Test.<anonymous> (/Users/feelform/workspace/pinpoint/pinpoint-node-agent/test/instrumentation/module/express.test.js:42:7)'
    captureGroups = stack.match(regex)
    actual = MethodDescriptorBuilder.make('express', captureGroups.groups)
    t.equal(actual.methodName, '<anonymous>', 'methodName')
    t.equal(actual.functionName, '<anonymous>', 'functionName')
    t.equal(actual.getFunctionName(), '<anonymous>', 'functionName')
    t.equal(actual.className, 'Test', 'className')
    t.equal(actual.getClassName(), 'Test', 'className')
    t.equal(actual.lineNumber, 42, 'lineNumber')

    stack = 'at Test.bound [as _cb] (/Users/feelform/workspace/pinpoint/pinpoint-node-agent/node_modules/tape/lib/test.js:80:32)'
    captureGroups = stack.match(regex)
    actual = MethodDescriptorBuilder.make('express', captureGroups.groups)
    t.equal(actual.methodName, '_cb', 'methodName')
    t.equal(actual.functionName, 'bound', 'functionName')
    t.equal(actual.className, 'Test', 'className')
    t.equal(actual.lineNumber, 80, 'lineNumber')

    t.end()
})