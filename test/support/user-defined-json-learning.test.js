/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const path = require('path')

test('ConfigBuilder pathForRequireFunction Learning Test', (t) => {
  let actual = {}.main
  t.true(actual === undefined, '{}.main return value is undefined')

  actual = { main: {} }.main.filename
  t.true(actual === undefined, 'getMainModulePath({ main: {} }) return value is undefined')

  actual = path.dirname({ main: { filename: '/test' } }.main.filename)
  t.equal(actual, '/', 'getMainModulePath({ main: { filename: \' / test\' } }) return value is /')

  actual = path.dirname({ main: { filename: '/test/test1' } }.main.filename)
  t.equal(actual, '/test', 'getMainModulePath({ main: { filename: \' / test\' } }) return value is /')

  t.end()
})
