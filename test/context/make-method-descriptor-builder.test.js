/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const { captureNamedGroup } = require('../../lib/context/make-method-descriptor-builder')
const MethodDescriptorBuilder = require('../../lib/context/method-descriptor-builder')

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