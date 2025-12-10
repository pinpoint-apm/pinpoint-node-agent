/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const { ExceptionBuilder } = require('../../lib/context/trace/exception-builder')

const actualCallStack = `Error: express case
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

const loaderStack = `Error: loader
at new functionName (internal/modules/cjs/loader.js:699:10)
at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)
at async functionName (internal/modules/cjs/loader.js:699:10)`

const actualKoaCallStack = `Error: koa case
at Router.register (/Users/test/workspace/pinpoint/pinpoint-node-agent/lib/instrumentation/module/koa-router.js:44:55)
at Router.<computed> [as get] (/Users/test/workspace/pinpoint/pinpoint-node-agent/node_modules/koa-router/lib/router.js:202:10)
at Test.<anonymous> (/Users/test/workspace/pinpoint/pinpoint-node-agent/test/instrumentation/module/koa.test.js:31:10)
at Test.bound [as _cb] (/Users/test/workspace/pinpoint/pinpoint-node-agent/node_modules/tape/lib/test.js:80:32)
at Test.run (/Users/test/workspace/pinpoint/pinpoint-node-agent/node_modules/tape/lib/test.js:96:10)
at Test.bound [as run] (/Users/test/workspace/pinpoint/pinpoint-node-agent/node_modules/tape/lib/test.js:80:32)
at Immediate.next [as _onImmediate] (/Users/test/workspace/pinpoint/pinpoint-node-agent/node_modules/tape/lib/results.js:83:19)
at processImmediate (internal/timers.js:464:21)
at process.callbackTrampoline (internal/async_hooks.js:130:17)`

const buildException = (stack) => {
    const err = new Error()
    const [firstLine, ...rest] = stack.split(/\r?\n/)
    err.message = firstLine.replace(/^Error:?\s*/, '')
    err.stack = [firstLine, ...rest].join('\n')
    return new ExceptionBuilder(err).build()
}

test('express makeMethodDescriptorBuilder with ExceptionBuilder', (t) => {
    const exception = buildException(loaderStack)

    t.equal(exception.errorClassName, 'Error')
    t.equal(exception.errorMessage, 'loader')
    t.equal(exception.frameStack.length, 3)

    let frame = exception.frameStack[0]
    t.equal(frame.className, '', 'className new')
    t.true(frame.fileName.endsWith('internal/modules/cjs/loader.js'), 'fileName new')
    t.equal(frame.methodName, 'FunctionName')
    t.equal(frame.lineNumber, 699)

    frame = exception.frameStack[1]
    t.equal(frame.className, 'Object', 'className object')
    t.true(frame.fileName.endsWith('internal/modules/cjs/loader.js'), 'fileName object')
    t.equal(frame.methodName, 'Module._extensions..js')
    t.equal(frame.lineNumber, 699)

    frame = exception.frameStack[2]
    t.equal(frame.className, '', 'className async')
    t.true(frame.fileName.endsWith('internal/modules/cjs/loader.js'), 'fileName async')
    t.equal(frame.methodName, 'FunctionName')
    t.equal(frame.lineNumber, 699)

    const expressException = buildException(actualCallStack)
    t.equal(expressException.errorClassName, 'Error')
    t.equal(expressException.errorMessage, 'express case')
    t.equal(expressException.frameStack.length, 12)

    const expressFrame = expressException.frameStack[2]
    t.equal(expressFrame.className, 'Function')
    t.true(expressFrame.fileName.endsWith('express/lib/application.js'))
    t.equal(expressFrame.methodName, 'app.<computed> [as get]')
    t.equal(expressFrame.lineNumber, 481)

    t.end()
})

test('express makeMethodDescriptorBuilder exception case with ExceptionBuilder', (t) => {
    const exception = buildException(actualCallStack)
    const promiseFrame = exception.frameStack[4]

    t.equal(exception.errorClassName, 'Error')
    t.equal(exception.errorMessage, 'express case')
    t.equal(exception.frameStack.length, 12)

    t.equal(promiseFrame.className, '', 'className promise')
    t.equal(promiseFrame.fileName, '<anonymous>')
    t.equal(promiseFrame.methodName, 'Promise')
    t.equal(promiseFrame.lineNumber, 0)

    t.end()
})

test('koa makeMethodDescriptorBuilder with ExceptionBuilder', (t) => {
    const exception = buildException(actualKoaCallStack)
    t.equal(exception.errorClassName, 'Error')
    t.equal(exception.errorMessage, 'koa case')
    t.equal(exception.frameStack.length, 9)
    const koaFrame = exception.frameStack[1]

    t.equal(koaFrame.className, 'Router', 'className koa')
    t.true(koaFrame.fileName.endsWith('koa-router/lib/router.js'), 'fileName koa')
    t.equal(koaFrame.methodName, '<computed> [as get]')
    t.equal(koaFrame.lineNumber, 202)

    t.end()
})