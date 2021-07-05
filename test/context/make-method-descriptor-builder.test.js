/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const { makeMethodDescriptorBuilderByFileName } = require('../../lib/context/make-method-descriptor-builder')

test('makeMethodDescriptorBuilderByFileName', (t) => {
    const actual = makeMethodDescriptorBuilderByFileName(1)
    t.end()
})