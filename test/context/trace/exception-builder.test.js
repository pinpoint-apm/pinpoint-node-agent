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

    t.deepEqual(actual.frameStack[0], {
        location: '/Users/workspace/pinpoint/pinpoint-node-agent/test/instrumentation/module/express.test.js',
        fileName: 'express.test.js',
        lineNumber: 110,
    }, 'at /Users/workspace/pinpoint/pinpoint-node-agent/test/instrumentation/module/express.test.js:110:11')
    t.deepEqual(actual.frameStack[1], {
        location: '/Users/workspace/pinpoint/pinpoint-node-agent/node_modules/express/lib/router/layer.js',
        fileName: 'layer.js',
        lineNumber: 95,
        type: 'Layer',
        functionName: 'handle',
        methodName: 'handle_request'
    }, 'at Layer.handle [as handle_request] (/Users/workspace/pinpoint/pinpoint-node-agent/node_modules/express/lib/router/layer.js:95:5)')
    t.deepEqual(actual.frameStack[2], {
        location: '/Users/workspace/pinpoint/pinpoint-node-agent/node_modules/express/lib/router/route.js',
        fileName: 'route.js',
        lineNumber: 149,
        functionName: 'next'
    }, 'at next (/Users/workspace/pinpoint/pinpoint-node-agent/node_modules/express/lib/router/route.js:149:13)')
    t.deepEqual(actual.frameStack[3], {
        location: '/Users/workspace/pinpoint/pinpoint-node-agent/node_modules/express/lib/router/route.js',
        fileName: 'route.js',
        lineNumber: 119,
        type: 'Route',
        functionName: 'dispatch'
    }, 'at Route.dispatch (/Users/workspace/pinpoint/pinpoint-node-agent/node_modules/express/lib/router/route.js:119:3)')
    t.deepEqual(actual.frameStack[4], {
        location: '/Users/workspace/pinpoint/pinpoint-node-agent/lib/instrumentation/interceptor-runner.js',
        fileName: 'interceptor-runner.js',
        lineNumber: 59,
        type: 'InterceptorRunner',
        functionName: 'run'
    }, 'at InterceptorRunner.run (/Users/workspace/pinpoint/pinpoint-node-agent/lib/instrumentation/interceptor-runner.js:59:38)')
    t.deepEqual(actual.frameStack[5], {
        location: '/Users/workspace/pinpoint/pinpoint-node-agent/lib/instrumentation/module/express/express-layer-interceptor.js',
        fileName: 'express-layer-interceptor.js',
        lineNumber: 41,
        functionName: 'wrapped'
    }, 'at wrapped (/Users/workspace/pinpoint/pinpoint-node-agent/lib/instrumentation/module/express/express-layer-interceptor.js:41:87)')
    t.deepEqual(actual.frameStack[6], {
        location: '/Users/workspace/pinpoint/pinpoint-node-agent/node_modules/express/lib/router/layer.js',
        fileName: 'layer.js',
        lineNumber: 95,
        type: 'Layer',
        functionName: 'handle',
        methodName: 'handle_request'
    }, 'at Layer.handle [as handle_request] (/Users/workspace/pinpoint/pinpoint-node-agent/node_modules/express/lib/router/layer.js:95:5)')
    t.deepEqual(actual.frameStack[7], {
        location: '/Users/workspace/pinpoint/pinpoint-node-agent/node_modules/express/lib/router/index.js',
        fileName: 'index.js',
        lineNumber: 284,
    }, 'at /Users/workspace/pinpoint/pinpoint-node-agent/node_modules/express/lib/router/index.js:284:15')
    t.deepEqual(actual.frameStack[8], {
        location: '/Users/workspace/pinpoint/pinpoint-node-agent/node_modules/express/lib/router/index.js',
        fileName: 'index.js',
        lineNumber: 346,
        functionName: 'process_params',
        type: 'Function',
    }, 'at Function.process_params (/Users/workspace/pinpoint/pinpoint-node-agent/node_modules/express/lib/router/index.js:346:12)')
    t.deepEqual(actual.frameStack[9], {
        location: '/Users/workspace/pinpoint/pinpoint-node-agent/node_modules/express/lib/router/index.js',
        fileName: 'index.js',
        lineNumber: 280,
        functionName: 'next'
    }, 'at next (/Users/workspace/pinpoint/pinpoint-node-agent/node_modules/express/lib/router/index.js:280:10)')

})