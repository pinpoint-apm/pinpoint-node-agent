/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const { captureNamedGroup } = require('../fixture')

const actualCallStack = `Error
at patchLayer (/Users/test/workspace/pinpoint/pinpoint-node-agent/lib/instrumentation/module/express.js:83:65)
at Function.route (/Users/test/workspace/pinpoint/pinpoint-node-agent/lib/instrumentation/module/express.js:73:9)
at Function.app.<computed> [as get] (/Users/test/workspace/pinpoint/pinpoint-node-agent/node_modules/express/lib/application.js:481:30)
at /Users/test/workspace/pinpoint/pinpoint-node-agent/test/utils/ant-path-matcher.test.js:206:13
at new Promise (<anonymous>)
at outgoingRequest (/Users/test/workspace/pinpoint/pinpoint-node-agent/test/utils/ant-path-matcher.test.js:194:12)
at Test.<anonymous> (/Users/test/workspace/pinpoint/pinpoint-node-agent/test/utils/ant-path-matcher.test.js:181:11)
at Test.bound [as _cb] (/Users/test/workspace/pinpoint/pinpoint-node-agent/node_modules/tape/lib/test.js:80:32)
at Test.run (/Users/test/workspace/pinpoint/pinpoint-node-agent/node_modules/tape/lib/test.js:96:10)
at Test.bound [as run] (/Users/test/workspace/pinpoint/pinpoint-node-agent/node_modules/tape/lib/test.js:80:32)
at Immediate.next [as _onImmediate] (/Users/test/workspace/pinpoint/pinpoint-node-agent/node_modules/tape/lib/results.js:83:19)
at processImmediate (internal/timers.js:456:21)`

test('express makeMethodDescriptorBuilder', (t) => {
    let actual = captureNamedGroup('at new functionName (internal/modules/cjs/loader.js:699:10)')
    t.equal(actual.type, undefined, 'className')
    t.equal(actual.fileName, 'loader.js', 'fileName')
    t.equal(actual.functionName, 'FunctionName')
    t.equal(actual.lineNumber, 699, 'lineNumber')
    t.equal(actual.location, 'internal/modules/cjs/loader.js')

    // let actualMethodDescriptor = MethodDescriptorBuilder.make(undefined, actual).build()
    // t.equal(actualMethodDescriptor.getApiDescriptor(), 'FunctionName()')

    actual = captureNamedGroup('at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)')
    t.equal(actual.type, 'Object', 'className')
    t.equal(actual.fileName, 'loader.js', 'fileName')
    t.equal(actual.functionName, 'Module._extensions..js')
    t.equal(actual.lineNumber, 699, 'lineNumber')
    t.equal(actual.location, 'internal/modules/cjs/loader.js')

    // actualMethodDescriptor = MethodDescriptorBuilder.make(undefined, actual).build()
    // t.equal(actualMethodDescriptor.getApiDescriptor(), 'Object.Module._extensions..js()')

    actual = captureNamedGroup('at async functionName (internal/modules/cjs/loader.js:699:10)')
    t.equal(actual.type, undefined, 'className')
    t.equal(actual.fileName, 'loader.js', 'fileName')
    t.equal(actual.functionName, 'FunctionName')
    t.equal(actual.lineNumber, 699, 'lineNumber')
    t.equal(actual.location, 'internal/modules/cjs/loader.js')

    // actualMethodDescriptor = MethodDescriptorBuilder.make(undefined, actual).build()
    // t.equal(actualMethodDescriptor.getApiDescriptor(), 'FunctionName()')

    const stacks = actualCallStack.split(/\r?\n/)
    actual = captureNamedGroup(stacks[3]) //at Function.app.<computed> [as get] (/Users/test/workspace/pinpoint/pinpoint-node-agent/node_modules/express/lib/application.js:481:30)
    t.equal(actual.type, 'Function', 'className')
    t.equal(actual.fileName, 'application.js', 'fileName')
    t.equal(actual.functionName, 'app.<computed>', 'functionName')
    t.equal(actual.lineNumber, 481, 'lineNumber')
    t.true(actual.location.endsWith('express/lib/application.js'), 'location')
    t.equal(actual.methodName, 'get', 'methodName')

    t.end()
})

test('express makeMethodDescriptorBuilder exception case', (t) => {
    const stacks = actualCallStack.split(/\r?\n/)
    let actual = captureNamedGroup(stacks[5]) //at new Promise (<anonymous>)
    t.equal(actual.type, undefined, 'className')
    t.equal(actual.fileName, '<anonymous>', 'fileName')
    t.equal(actual.functionName, 'Promise')
    t.equal(actual.lineNumber, undefined, 'lineNumber')
    t.equal(actual.location, '<anonymous>', 'location')
    t.equal(actual.functionName, 'Promise', 'fullname')

    // let actualMethodDescriptor = MethodDescriptorBuilder.make(undefined, actual).build()
    // t.equal(actualMethodDescriptor.getLineNumber(), undefined, 'lineNumber actualMethodDescriptor')
    // t.equal(actualMethodDescriptor.getLocation(), '<anonymous>', 'location actualMethodDescriptor')
    t.end()
})

const actualKoaCallStack = `Error
at Router.register (/Users/test/workspace/pinpoint/pinpoint-node-agent/lib/instrumentation/module/koa-router.js:44:55)
at Router.<computed> [as get] (/Users/test/workspace/pinpoint/pinpoint-node-agent/node_modules/koa-router/lib/router.js:202:10)
at Test.<anonymous> (/Users/test/workspace/pinpoint/pinpoint-node-agent/test/instrumentation/module/koa.test.js:31:10)
at Test.bound [as _cb] (/Users/test/workspace/pinpoint/pinpoint-node-agent/node_modules/tape/lib/test.js:80:32)
at Test.run (/Users/test/workspace/pinpoint/pinpoint-node-agent/node_modules/tape/lib/test.js:96:10)
at Test.bound [as run] (/Users/test/workspace/pinpoint/pinpoint-node-agent/node_modules/tape/lib/test.js:80:32)
at Immediate.next [as _onImmediate] (/Users/test/workspace/pinpoint/pinpoint-node-agent/node_modules/tape/lib/results.js:83:19)
at processImmediate (internal/timers.js:464:21)
at process.callbackTrampoline (internal/async_hooks.js:130:17)`

test('koa makeMethodDescriptorBuilder', (t) => {
    const stacks = actualKoaCallStack.split(/\r?\n/)
    let actual = captureNamedGroup(stacks[2]) //at Router.<computed> [as get] (/Users/test/workspace/pinpoint/pinpoint-node-agent/node_modules/koa-router/lib/router.js:202:10)
    t.equal(actual.type, 'Router', 'className')
    t.equal(actual.fileName, 'router.js', 'fileName')
    t.equal(actual.functionName, '<computed>', 'functionName')
    t.equal(actual.lineNumber, 202, 'lineNumber')
    t.true(actual.location.endsWith('koa-router/lib/router.js'), 'location')
    t.equal(actual.methodName, 'get', 'methodName')

    t.end()
})