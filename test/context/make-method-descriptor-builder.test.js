/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const { captureNamedGroup } = require('../../lib/context/make-method-descriptor-builder')
const MethodDescriptorBuilder = require('../../lib/context/method-descriptor-builder')

const actualCallStack = `Error
at patchLayer (/Users/feelform/workspace/pinpoint/pinpoint-node-agent/lib/instrumentation/module/express.js:83:65)
at Function.route (/Users/feelform/workspace/pinpoint/pinpoint-node-agent/lib/instrumentation/module/express.js:73:9)
at Function.app.<computed> [as get] (/Users/feelform/workspace/pinpoint/pinpoint-node-agent/node_modules/express/lib/application.js:481:30)
at /Users/feelform/workspace/pinpoint/pinpoint-node-agent/test/utils/ant-path-matcher.test.js:206:13
at new Promise (<anonymous>)
at outgoingRequest (/Users/feelform/workspace/pinpoint/pinpoint-node-agent/test/utils/ant-path-matcher.test.js:194:12)
at Test.<anonymous> (/Users/feelform/workspace/pinpoint/pinpoint-node-agent/test/utils/ant-path-matcher.test.js:181:11)
at Test.bound [as _cb] (/Users/feelform/workspace/pinpoint/pinpoint-node-agent/node_modules/tape/lib/test.js:80:32)
at Test.run (/Users/feelform/workspace/pinpoint/pinpoint-node-agent/node_modules/tape/lib/test.js:96:10)
at Test.bound [as run] (/Users/feelform/workspace/pinpoint/pinpoint-node-agent/node_modules/tape/lib/test.js:80:32)
at Immediate.next [as _onImmediate] (/Users/feelform/workspace/pinpoint/pinpoint-node-agent/node_modules/tape/lib/results.js:83:19)
at processImmediate (internal/timers.js:456:21)`

test('makeMethodDescriptorBuilder', (t) => {
    let actual = captureNamedGroup('at new functionName (internal/modules/cjs/loader.js:699:10)')
    t.equal(actual.type, undefined, 'className')
    t.equal(actual.fileName, 'loader.js', 'fileName')
    t.equal(actual.functionName, 'FunctionName')
    t.equal(actual.lineNumber, '699', 'lineNumber')
    t.equal(actual.location, 'internal/modules/cjs/')

    let actualMethodDescriptor = MethodDescriptorBuilder.make(undefined, actual).build()
    t.equal(actualMethodDescriptor.getApiDescriptor(), 'FunctionName()')

    actual = captureNamedGroup('at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)')
    t.equal(actual.type, 'Object', 'className')
    t.equal(actual.fileName, 'loader.js', 'fileName')
    t.equal(actual.functionName, 'Module._extensions..js')
    t.equal(actual.lineNumber, '699', 'lineNumber')
    t.equal(actual.location, 'internal/modules/cjs/')

    actualMethodDescriptor = MethodDescriptorBuilder.make(undefined, actual).build()
    t.equal(actualMethodDescriptor.getApiDescriptor(), 'Object.Module._extensions..js()')

    actual = captureNamedGroup('at async functionName (internal/modules/cjs/loader.js:699:10)')
    t.equal(actual.type, undefined, 'className')
    t.equal(actual.fileName, 'loader.js', 'fileName')
    t.equal(actual.functionName, 'FunctionName')
    t.equal(actual.lineNumber, '699', 'lineNumber')
    t.equal(actual.location, 'internal/modules/cjs/')

    actualMethodDescriptor = MethodDescriptorBuilder.make(undefined, actual).build()
    t.equal(actualMethodDescriptor.getApiDescriptor(), 'FunctionName()')

    t.end()
})

test('makeMethodDescriptorBuilder exception case', (t) => {
    const stacks = actualCallStack.split(/\r?\n/)
    let actual = captureNamedGroup(stacks[5]) //at new Promise (<anonymous>)
    t.equal(actual.type, undefined, 'className')
    t.equal(actual.fileName, '<anonymous>', 'fileName')
    t.equal(actual.functionName, 'Promise')
    t.equal(actual.lineNumber, undefined, 'lineNumber')
    t.equal(actual.location, undefined, 'location')
    t.equal(actual.functionName, 'Promise', 'fullname')

    let actualMethodDescriptor = MethodDescriptorBuilder.make(undefined, actual).build()
    t.equal(actualMethodDescriptor.getLineNumber(), undefined, 'lineNumber actualMethodDescriptor')
    t.equal(actualMethodDescriptor.getLocation(), '<anonymous>', 'location actualMethodDescriptor')
    t.end()
})