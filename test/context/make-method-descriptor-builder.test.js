/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const { captureNamedGroup, methodDescriptorBuilder } = require('../../lib/context/make-method-descriptor-builder')
const MethodDescriptorBuilder = require('../../lib/context/method-descriptor-builder')

test('makeMethodDescriptorBuilderByFileName', (t) => {
    let actual = captureNamedGroup('at new functionName (internal/modules/cjs/loader.js:699:10)')
    t.equal(actual.className, undefined, 'className')
    t.equal(actual.fileName, 'loader.js', 'fileName')
    t.equal(actual.functionName, 'FunctionName')
    t.equal(actual.lineNumber, '699', 'lineNumber')
    t.equal(actual.location, 'internal/modules/cjs/')

    let actualMethodDescriptor = MethodDescriptorBuilder.make(undefined, actual).build()
    t.equal(actualMethodDescriptor.getAPIInfo(), 'FunctionName (internal/modules/cjs/loader.js)')

    actual = methodDescriptorBuilder(undefined, 'at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)')
    t.equal(actual.className, 'Object', 'className')
    t.equal(actual.fileName, 'loader.js', 'fileName')
    t.equal(actual.functionName, 'Module._extensions..js')
    t.equal(actual.lineNumber, 699, 'lineNumber')
    t.equal(actual.location, 'internal/modules/cjs/')

    actualMethodDescriptor = actual.build()
    t.equal(actualMethodDescriptor.getAPIInfo(), 'Object.Module._extensions..js (internal/modules/cjs/loader.js)')

    t.end()
})