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
    const actual = new ExceptionBuilder(error).build()
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

    const actual = new ExceptionBuilder(err).build()

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