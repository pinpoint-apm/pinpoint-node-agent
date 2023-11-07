/**
 * Pinpoint Node.js Agent
 * Copyright 2023-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const { makeCloneBuilder } = require('../../lib/instrumentation/call-stack')
const MethodDescriptorBuilder = require('../../lib/context/method-descriptor-builder')
test('express callSite', (t) => {
    let stack = 'at Function.app.<computed> [as get] (/Users/workspace/pinpoint/pinpoint-node-agent/node_modules/express/lib/application.js:481:30)'
    const expected = MethodDescriptorBuilder.makeRuntimeDetectionMethodDescriptorBuilder()
                        .setFileNameIndex(0)
                        .setMethodIndex(0)
    let actual = makeCloneBuilder([stack], expected)
    t.equal(actual.methodName, 'get', 'methodName')
    t.equal(actual.functionName, 'app.<computed>', 'functionName')
    t.equal(actual.className, 'Function', 'className')
    t.equal(actual.lineNumber, 481, 'lineNumber')
    t.equal(actual.getCacheId(), 'Function.app.get:application.js:481', `cache ID check`)

    let actualMethodDescriptor = actual.build()
    t.equal(actualMethodDescriptor.getMethodName(), 'get', 'MethodDescriptor methodName')
    t.equal(actualMethodDescriptor.getClassName(), 'Function', 'MethodDescriptor methodName')
    t.equal(actualMethodDescriptor.getLineNumber(), 481, 'MethodDescriptor lineNumber')

    stack = 'at Test.<anonymous> (/Users/feelform/workspace/pinpoint/pinpoint-node-agent/test/instrumentation/module/express.test.js:42:7)'
    actual = makeCloneBuilder([stack], expected)
    t.equal(actual.methodName, undefined, 'methodName')
    t.equal(actual.functionName, '<anonymous>', 'functionName')
    t.equal(actual.className, 'Test', 'className')
    t.equal(actual.lineNumber, 42, 'lineNumber')

    stack = 'at Test.bound [as _cb] (/Users/workspace/pinpoint/pinpoint-node-agent/node_modules/tape/lib/test.js:80:32)'
    actual = makeCloneBuilder([stack], expected)
    t.equal(actual.methodName, '_cb', 'methodName')
    t.equal(actual.functionName, 'bound', 'functionName')
    t.equal(actual.className, 'Test', 'className')
    t.equal(actual.lineNumber, 80, 'lineNumber')

    t.end()
})