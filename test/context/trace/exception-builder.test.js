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
    const topError = new Error('top error', {
        cause: new TypeError('middle error', {
            cause: new RangeError('root cause'),
        }),
    })

    const exceptions = new ExceptionBuilder(topError).build()

    t.deepEqual(exceptionTree(exceptions), [
        'A Error: top error',
        'A   TypeError: middle error',
        'A     RangeError: root cause',
    ], 'the causes share the exceptionId of the top error, one depth deeper each')
    t.end()
})

test('ExceptionBuilder should respect maxDepth', (t) => {
    const topError = new Error('top', {
        cause: new Error('cause1', {
            cause: new Error('cause2'),
        }),
    })

    const exceptions = new ExceptionBuilder(topError, 2).build()

    t.deepEqual(exceptionTree(exceptions), [
        'A Error: top',
        'A   Error: cause1',
    ], 'the chain stops at maxDepth 2')
    t.end()
})

test('ExceptionBuilder should take the class name from error.name when Node adds a code to the stack header', (t) => {
    let error
    try {
        Buffer.alloc(-1)
    } catch (e) {
        error = e
    }
    t.true(error.stack.startsWith('RangeError [ERR_OUT_OF_RANGE]: '), 'the stack header has the [ERR_OUT_OF_RANGE] code')

    const exceptions = new ExceptionBuilder(error).build()

    t.equal(exceptions[0].errorClassName, 'RangeError', 'the class name is RangeError')
    t.equal(exceptions[0].frameStack[0].fileName, 'node:buffer', 'the first frame is in node:buffer')
    t.true(exceptions[0].frameStack[0].lineNumber > 0, 'the first frame has its line number')
    t.end()
})

test('ExceptionBuilder should take the class name from error.name when the error has no message', (t) => {
    const error = new Error()
    t.equal(error.stack.split('\n')[0], 'Error', 'the stack header has no colon')

    const exceptions = new ExceptionBuilder(error).build()

    t.equal(exceptions[0].errorClassName, 'Error', 'the class name is Error')
    t.equal(exceptions[0].errorMessage, '', 'the message is empty')
    t.end()
})

test('ExceptionBuilder should record unknown as the class name when error.name is not a string', (t) => {
    const exceptions = new ExceptionBuilder({ stack: 'x' }).build()

    t.equal(exceptions[0].errorClassName, 'unknown', 'the class name is unknown')
    t.end()
})

test('ExceptionBuilder should keep the name and message of an error without a stack', (t) => {
    const exceptions = new ExceptionBuilder({ name: 'CustomError', message: 'x' }).build()

    t.equal(exceptions[0].errorClassName, 'CustomError', 'the class name is CustomError')
    t.equal(exceptions[0].errorMessage, 'x', 'the message is x')
    t.equal(exceptions[0].frameStack.length, 0, 'there are no frames')
    t.end()
})

test('ExceptionBuilder should take frames only from the call site lines when the message has several lines', (t) => {
    function readConfig() {
        return new Error('expected 1\nactual 2')
    }

    const exceptions = new ExceptionBuilder(readConfig()).build()

    t.equal(exceptions[0].errorMessage, 'expected 1\nactual 2', 'the message keeps both lines')
    t.equal(exceptions[0].frameStack[0].methodName, 'readConfig', 'the first frame is readConfig, not the second message line')
    t.end()
})

test('ExceptionBuilder should send each error in AggregateError.errors as its own exception chain', (t) => {
    const aggregateError = new AggregateError([
        new Error('connect ECONNREFUSED ::1:3000'),
        new Error('connect ECONNREFUSED 127.0.0.1:3000'),
    ])

    const exceptions = new ExceptionBuilder(aggregateError).build()

    t.deepEqual(exceptionTree(exceptions), [
        'A AggregateError: ',
        'B Error: connect ECONNREFUSED ::1:3000',
        'C Error: connect ECONNREFUSED 127.0.0.1:3000',
    ], 'each error in AggregateError.errors starts its own chain at depth 0')
    t.end()
})

test('ExceptionBuilder should send the errors of an AggregateError found in the cause chain', (t) => {
    const fetchError = new TypeError('fetch failed', {
        cause: new AggregateError([
            new Error('connect ECONNREFUSED ::1:3000'),
            new Error('connect ECONNREFUSED 127.0.0.1:3000'),
        ]),
    })

    const exceptions = new ExceptionBuilder(fetchError).build()

    t.deepEqual(exceptionTree(exceptions), [
        'A TypeError: fetch failed',
        'A   AggregateError: ',
        'B Error: connect ECONNREFUSED ::1:3000',
        'C Error: connect ECONNREFUSED 127.0.0.1:3000',
    ], 'the errors of the AggregateError cause follow the TypeError chain')
    t.end()
})

test('ExceptionBuilder should walk the cause chain of an error in AggregateError.errors', (t) => {
    const aggregateError = new AggregateError([
        new Error('request failed', {
            cause: new Error('socket hang up'),
        }),
    ])

    const exceptions = new ExceptionBuilder(aggregateError).build()

    t.deepEqual(exceptionTree(exceptions), [
        'A AggregateError: ',
        'B Error: request failed',
        'B   Error: socket hang up',
    ], 'the cause of errors[0] shares its exceptionId at depth 1')
    t.end()
})

test('ExceptionBuilder should send the errors of an AggregateError nested in AggregateError.errors', (t) => {
    const anyError = new AggregateError([
        new AggregateError([
            new Error('connect ECONNREFUSED ::1:3000'),
            new Error('connect ECONNREFUSED 127.0.0.1:3000'),
        ]),
        new AggregateError([
            new Error('connect ECONNREFUSED ::1:4000'),
            new Error('connect ECONNREFUSED 127.0.0.1:4000'),
        ]),
    ], 'All promises were rejected')

    const exceptions = new ExceptionBuilder(anyError).build()

    t.deepEqual(exceptionTree(exceptions), [
        'A AggregateError: All promises were rejected',
        'B AggregateError: ',
        'C AggregateError: ',
        'D Error: connect ECONNREFUSED ::1:3000',
        'E Error: connect ECONNREFUSED 127.0.0.1:3000',
        'F Error: connect ECONNREFUSED ::1:4000',
        'G Error: connect ECONNREFUSED 127.0.0.1:4000',
    ], 'the outer array errors come before the nested array errors')
    t.end()
})

test('ExceptionBuilder should send at most 10 errors from AggregateError.errors whatever maxDepth is', (t) => {
    const errors = Array.from({ length: 12 }, (_, index) => new Error(`request ${index} failed`))
    const aggregateError = new AggregateError(errors)

    const exceptions = new ExceptionBuilder(aggregateError, 2).build()

    t.equal(exceptions.length, 11, 'the AggregateError and the first 10 errors')
    t.equal(exceptions[10].errorMessage, 'request 9 failed', 'the last one is errors[9]')
    t.end()
})

test('ExceptionBuilder should not send the errors array of an error that is not an AggregateError', (t) => {
    const validationError = new Error('invalid request')
    validationError.name = 'ValidationError'
    validationError.errors = ['id is required', 'name is required']

    const exceptions = new ExceptionBuilder(validationError).build()

    t.deepEqual(exceptionTree(exceptions), [
        'A ValidationError: invalid request',
    ], 'only the ValidationError itself')
    t.end()
})

test('ExceptionBuilder should skip the values in AggregateError.errors that are not errors', (t) => {
    const aggregateError = new AggregateError([
        undefined,
        'timeout',
        new Error('connect ECONNREFUSED 127.0.0.1:3000'),
    ])

    const exceptions = new ExceptionBuilder(aggregateError).build()

    t.deepEqual(exceptionTree(exceptions), [
        'A AggregateError: ',
        'B Error: connect ECONNREFUSED 127.0.0.1:3000',
    ], 'only the AggregateError and its Error')
    t.end()
})

test('ExceptionBuilder should send the first 10 errors without throwing when AggregateError.errors is huge', (t) => {
    const errors = Array.from({ length: 200000 }, (_, index) => new Error(`request ${index} failed`))
    const aggregateError = new AggregateError(errors)

    const exceptions = new ExceptionBuilder(aggregateError).build()

    t.equal(exceptions.length, 11, 'the AggregateError and the first 10 errors')
    t.equal(exceptions[10].errorMessage, 'request 9 failed', 'the last one is errors[9]')
    t.end()
})

function exceptionTree(exceptions) {
    const labels = new Map()
    return exceptions.map(exception => {
        if (!labels.has(exception.exceptionId)) {
            labels.set(exception.exceptionId, String.fromCharCode(65 + labels.size))
        }
        return `${labels.get(exception.exceptionId)} ${'  '.repeat(exception.exceptionDepth)}${exception.errorClassName}: ${exception.errorMessage}`
    })
}

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
