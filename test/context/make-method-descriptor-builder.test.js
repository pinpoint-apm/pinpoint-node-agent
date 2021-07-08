/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const { methodDescriptorBuilder } = require('../../lib/context/make-method-descriptor-builder')

test('makeMethodDescriptorBuilderByFileName', (t) => {
    const actual = methodDescriptorBuilder(undefined, 'at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)')
    t.equal(actual.className, 'Object', 'className')
    t.equal(actual.fileName, 'loader.js', 'fileName')
    t.equal(actual.functionName, 'Module._extensions..js')
    t.equal(actual.lineNumber, 699, 'lineNumber')
    t.equal(actual.location, 'internal/modules/cjs/')
    t.end()
})