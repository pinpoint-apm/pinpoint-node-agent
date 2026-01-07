/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const CallStack = require('../../../lib/context/trace/call-stack')
const TraceRoot = require('../../../lib/context/trace/trace-root')

// Ensure NullObjectSQLMetadataService is used by null span event recorders and acts as a no-op
// without mutating the call stack.
test('CallStack null span event recorder uses NullObjectSQLMetadataService', (t) => {
    const traceRoot = new TraceRoot('agentId', Date.now(), 'transactionId')
    const callStack = new CallStack(traceRoot)

    const nullRecorder = callStack.makeNullSpanEventRecorder()

    t.ok(nullRecorder.sqlMetadataService, 'null recorder has a sqlMetadataService')
    t.equal(nullRecorder.sqlMetadataService.constructor.name, 'NullObjectSQLMetadataService', 'null recorder uses NullObjectSQLMetadataService')
    t.doesNotThrow(() => nullRecorder.recordSqlInfo('SELECT 1'), 'recordSqlInfo is a safe no-op on null recorder')
    t.equal(callStack.stack.length, 0, 'null recorder does not push onto call stack')
    t.end()
})
