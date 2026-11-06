/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const { HttpStatusCodeErrorsBuilder } = require('../../../lib/instrumentation/http/http-status-code-errors-builder')

test('HTTP Status Code Errors 5xx,401,403', (t) => {
    const httpErrors = new HttpStatusCodeErrorsBuilder('5xx,401,403').build()
    t.equal(httpErrors.isErrorCode(200), false, 'default: 200 is not error code')
    t.equal(httpErrors.isErrorCode(500), true, 'default: 500 is error code')
    t.equal(httpErrors.isErrorCode(401), true, 'default: 401 is error code')
    t.equal(httpErrors.isErrorCode(403), true, 'default: 403 is error code')
    t.equal(httpErrors.isErrorCode(404), false, 'default: 404 is not error code')
    t.end()
})

test('HTTP Status Code Errors 400,401,403,404', (t) => {
    const httpErrors = new HttpStatusCodeErrorsBuilder('400,401,403,404').build()
    t.equal(httpErrors.isErrorCode(400), true, 'json config: 400 is error code')
    t.equal(httpErrors.isErrorCode(401), true, 'json config: 401 is error code')
    t.equal(httpErrors.isErrorCode(403), true, 'json config: 403 is error code')
    t.equal(httpErrors.isErrorCode(404), true, 'json config: 404 is error code')
    t.equal(httpErrors.isErrorCode(500), false, 'json config: 500 is not error code')
    t.end()
})
