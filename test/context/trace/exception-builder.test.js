/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const { ExceptionBuilder } = require('../../../lib/context/trace/exception-builder')

const error = new Error('error case')
error.stack = `Error: error case
    at /Users/workspace/pinpoint/pinpoint-node-agent/test/instrumentation/module/express.test.js:110:11
    at Layer.handle [as handle_request] (/Users/workspace/pinpoint/pinpoint-node-agent/node_modules/express/lib/router/layer.js:95:5)
    at next (/Users/workspace/pinpoint/pinpoint-node-agent/node_modules/express/lib/router/route.js:149:13)
    at Route.dispatch (/Users/workspace/pinpoint/pinpoint-node-agent/node_modules/express/lib/router/route.js:119:3)
    at InterceptorRunner.run (/Users/workspace/pinpoint/pinpoint-node-agent/lib/instrumentation/interceptor-runner.js:59:38)
    at wrapped (/Users/workspace/pinpoint/pinpoint-node-agent/lib/instrumentation/module/express/express-layer-interceptor.js:41:87)
    at Layer.handle [as handle_request] (/Users/workspace/pinpoint/pinpoint-node-agent/node_modules/express/lib/router/layer.js:95:5)
    at /Users/workspace/pinpoint/pinpoint-node-agent/node_modules/express/lib/router/index.js:284:15
    at Function.process_params (/Users/workspace/pinpoint/pinpoint-node-agent/node_modules/express/lib/router/index.js:346:12)
    at next (/Users/workspace/pinpoint/pinpoint-node-agent/node_modules/express/lib/router/index.js:280:10)`

test('ExceptionBuilder Test - snapshot-like multiline', (t) => {
    t.plan(13)
    const exceptions = new ExceptionBuilder(error).build()
    const actual = exceptions[0]
    t.equal(actual.errorClassName, 'Error', `Error class name is ${actual.errorClassName}`)
    t.equal(actual.errorMessage, 'error case', `Error message is ${actual.errorMessage}`)
    t.equal(actual.frameStack.length, 10, `Frame stack length is ${actual.frameStack.length}`)

    let actualFrame = actual.frameStack[0]
    t.deepEqual({ location: actualFrame.fileName, lineNumber: actualFrame.lineNumber }, {
        location: '/Users/workspace/pinpoint/pinpoint-node-agent/test/instrumentation/module/express.test.js',
        lineNumber: 110,
    }, 'at /Users/workspace/pinpoint/pinpoint-node-agent/test/instrumentation/module/express.test.js:110:11')

    actualFrame = actual.frameStack[1]
    t.deepEqual({ type: actualFrame.className, location: actualFrame.fileName, lineNumber: actualFrame.lineNumber, functionName: actualFrame.methodName }, {
        location: '/Users/workspace/pinpoint/pinpoint-node-agent/node_modules/express/lib/router/layer.js',
        lineNumber: 95,
        type: 'Layer',
        functionName: 'handle [as handle_request]',
    }, 'at Layer.handle [as handle_request] (/Users/workspace/pinpoint/pinpoint-node-agent/node_modules/express/lib/router/layer.js:95:5)')

    actualFrame = actual.frameStack[2]
    t.deepEqual({ location: actualFrame.fileName, lineNumber: actualFrame.lineNumber, functionName: actualFrame.methodName }, {
        location: '/Users/workspace/pinpoint/pinpoint-node-agent/node_modules/express/lib/router/route.js',
        lineNumber: 149,
        functionName: 'next'
    }, 'at next (/Users/workspace/pinpoint/pinpoint-node-agent/node_modules/express/lib/router/route.js:149:13)')

    actualFrame = actual.frameStack[3]
    t.deepEqual({ type: actualFrame.className, location: actualFrame.fileName, lineNumber: actualFrame.lineNumber, functionName: actualFrame.methodName }, {
        location: '/Users/workspace/pinpoint/pinpoint-node-agent/node_modules/express/lib/router/route.js',
        lineNumber: 119,
        type: 'Route',
        functionName: 'dispatch'
    }, 'at Route.dispatch (/Users/workspace/pinpoint/pinpoint-node-agent/node_modules/express/lib/router/route.js:119:3)')

    actualFrame = actual.frameStack[4]
    t.deepEqual({ type: actualFrame.className, location: actualFrame.fileName, lineNumber: actualFrame.lineNumber, functionName: actualFrame.methodName }, {
        location: '/Users/workspace/pinpoint/pinpoint-node-agent/lib/instrumentation/interceptor-runner.js',
        lineNumber: 59,
        type: 'InterceptorRunner',
        functionName: 'run'
    }, 'at InterceptorRunner.run (/Users/workspace/pinpoint/pinpoint-node-agent/lib/instrumentation/interceptor-runner.js:59:38)')

    actualFrame = actual.frameStack[5]
    t.deepEqual({ location: actualFrame.fileName, lineNumber: actualFrame.lineNumber, functionName: actualFrame.methodName }, {
        location: '/Users/workspace/pinpoint/pinpoint-node-agent/lib/instrumentation/module/express/express-layer-interceptor.js',
        lineNumber: 41,
        functionName: 'wrapped'
    }, 'at wrapped (/Users/workspace/pinpoint/pinpoint-node-agent/lib/instrumentation/module/express/express-layer-interceptor.js:41:87)')

    actualFrame = actual.frameStack[6]
    t.deepEqual({ type: actualFrame.className, location: actualFrame.fileName, lineNumber: actualFrame.lineNumber, functionName: actualFrame.methodName }, {
        location: '/Users/workspace/pinpoint/pinpoint-node-agent/node_modules/express/lib/router/layer.js',
        lineNumber: 95,
        type: 'Layer',
        functionName: 'handle [as handle_request]',
    }, 'at Layer.handle [as handle_request] (/Users/workspace/pinpoint/pinpoint-node-agent/node_modules/express/lib/router/layer.js:95:5)')

    actualFrame = actual.frameStack[7]
    t.deepEqual({ location: actualFrame.fileName, lineNumber: actualFrame.lineNumber}, {
        location: '/Users/workspace/pinpoint/pinpoint-node-agent/node_modules/express/lib/router/index.js',
        lineNumber: 284,
    }, 'at /Users/workspace/pinpoint/pinpoint-node-agent/node_modules/express/lib/router/index.js:284:15')

    actualFrame = actual.frameStack[8]
    t.deepEqual({ type: actualFrame.className, location: actualFrame.fileName, lineNumber: actualFrame.lineNumber, functionName: actualFrame.methodName }, {
        location: '/Users/workspace/pinpoint/pinpoint-node-agent/node_modules/express/lib/router/index.js',
        lineNumber: 346,
        functionName: 'process_params',
        type: 'Function',
    }, 'at Function.process_params (/Users/workspace/pinpoint/pinpoint-node-agent/node_modules/express/lib/router/index.js:346:12)')

    actualFrame = actual.frameStack[9]
    t.deepEqual({ location: actualFrame.fileName, lineNumber: actualFrame.lineNumber, functionName: actualFrame.methodName }, {
        location: '/Users/workspace/pinpoint/pinpoint-node-agent/node_modules/express/lib/router/index.js',
        lineNumber: 280,
        functionName: 'next'
    }, 'at next (/Users/workspace/pinpoint/pinpoint-node-agent/node_modules/express/lib/router/index.js:280:10)')
})

test('ExceptionBuilder should use fileName as className fallback and <anonymous> as methodName fallback', (t) => {
    const err = new Error('fallback test')
    err.stack = `Error: fallback test
    at /Users/app/index.js:10:5
    at Layer.handle [as handle_request] (/Users/app/node_modules/express/lib/router/layer.js:95:5)
    at next (/Users/app/node_modules/express/lib/router/route.js:149:13)`

    const actual = new ExceptionBuilder(err).build()[0]

    // Frame without type and functionName: className=fileName, methodName='<anonymous>'
    const frame0 = actual.frameStack[0]
    t.equal(frame0.className, 'index.js', 'className should fallback to fileName when type is undefined')
    t.equal(frame0.methodName, '<anonymous>', 'methodName should fallback to <anonymous> when functionName is undefined')

    // Frame with type and functionName: no fallback needed
    const frame1 = actual.frameStack[1]
    t.equal(frame1.className, 'Layer', 'className should be type when present')
    t.equal(frame1.methodName, 'handle [as handle_request]', 'methodName should be functionName when present')

    // Frame without type but with functionName: className=fileName, methodName=functionName
    const frame2 = actual.frameStack[2]
    t.equal(frame2.className, 'route.js', 'className should fallback to fileName when type is undefined')
    t.equal(frame2.methodName, 'next', 'methodName should be functionName when present')

    t.end()
})

test('ExceptionBuilder should walk error.cause chain', (t) => {
    const rootCause = new Error('root cause')
    rootCause.stack = 'RangeError: root cause\n    at Object.validate (/Users/app/validator.js:10:5)'

    const middleError = new Error('middle error', { cause: rootCause })
    middleError.stack = 'TypeError: middle error\n    at Object.parse (/Users/app/parser.js:20:5)'

    const topError = new Error('top error', { cause: middleError })
    topError.stack = 'Error: top error\n    at Object.handler (/Users/app/handler.js:30:5)'

    const exceptions = new ExceptionBuilder(topError).build()

    t.equal(exceptions.length, 3, 'should have 3 exceptions in chain')

    t.equal(exceptions[0].errorClassName, 'Error', 'depth 0: Error')
    t.equal(exceptions[0].errorMessage, 'top error', 'depth 0: top error')
    t.equal(exceptions[0].exceptionDepth, 0, 'depth 0')

    t.equal(exceptions[1].errorClassName, 'TypeError', 'depth 1: TypeError')
    t.equal(exceptions[1].errorMessage, 'middle error', 'depth 1: middle error')
    t.equal(exceptions[1].exceptionDepth, 1, 'depth 1')

    t.equal(exceptions[2].errorClassName, 'RangeError', 'depth 2: RangeError')
    t.equal(exceptions[2].errorMessage, 'root cause', 'depth 2: root cause')
    t.equal(exceptions[2].exceptionDepth, 2, 'depth 2')

    const sharedId = exceptions[0].exceptionId
    t.equal(exceptions[1].exceptionId, sharedId, 'all exceptions share same exceptionId')
    t.equal(exceptions[2].exceptionId, sharedId, 'all exceptions share same exceptionId')

    t.end()
})

test('ExceptionBuilder should respect maxDepth', (t) => {
    const cause2 = new Error('cause2')
    cause2.stack = 'Error: cause2\n    at c (/app.js:3:1)'
    const cause1 = new Error('cause1', { cause: cause2 })
    cause1.stack = 'Error: cause1\n    at b (/app.js:2:1)'
    const top = new Error('top', { cause: cause1 })
    top.stack = 'Error: top\n    at a (/app.js:1:1)'

    const exceptions = new ExceptionBuilder(top, 2).build()

    t.equal(exceptions.length, 2, 'should be limited to maxDepth=2')
    t.equal(exceptions[0].errorMessage, 'top', 'depth 0')
    t.equal(exceptions[1].errorMessage, 'cause1', 'depth 1')

    t.end()
})

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
    return new ExceptionBuilder(err).build()[0]
}

test('express stack: ensure computed method names and file/line are preserved in frames', (t) => {
    const exception = buildException(loaderStack)

    t.equal(exception.errorClassName, 'Error')
    t.equal(exception.errorMessage, 'loader')
    t.equal(exception.frameStack.length, 3)

    let frame = exception.frameStack[0]
    t.equal(frame.className, 'loader.js', 'className new: fallback to fileName')
    t.true(frame.fileName.endsWith('internal/modules/cjs/loader.js'), 'fileName new')
    t.equal(frame.methodName, 'FunctionName')
    t.equal(frame.lineNumber, 699)

    frame = exception.frameStack[1]
    t.equal(frame.className, 'Object', 'className object')
    t.true(frame.fileName.endsWith('internal/modules/cjs/loader.js'), 'fileName object')
    t.equal(frame.methodName, 'Module._extensions..js')
    t.equal(frame.lineNumber, 699)

    frame = exception.frameStack[2]
    t.equal(frame.className, 'loader.js', 'className async: fallback to fileName')
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

test('express stack with promise frame: ensure anonymous Promise frame is parsed', (t) => {
    const exception = buildException(actualCallStack)
    const promiseFrame = exception.frameStack[4]

    t.equal(exception.errorClassName, 'Error')
    t.equal(exception.errorMessage, 'express case')
    t.equal(exception.frameStack.length, 12)

    t.equal(promiseFrame.className, '<anonymous>', 'className promise: fallback to fileName')
    t.equal(promiseFrame.fileName, '<anonymous>')
    t.equal(promiseFrame.methodName, 'Promise')
    t.equal(promiseFrame.lineNumber, 0)

    t.end()
})

test('koa stack: ensure computed method names and file/line are preserved in frames', (t) => {
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
