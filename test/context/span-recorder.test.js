/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const SpanRecorder = require('../../lib/context/trace/span-recorder')
const SpanBuilder = require('../../lib/context/span-builder')
const TraceRootBuilder = require('../../lib/context/trace-root-builder')
const TraceIdBuilder = require('../../lib/context/trace/trace-id-builder')

test('SpanRecorder.recordException() should mask error code', (t) => {
    // Setup
    const agentId = 'test-agent'
    const agentStartTime = Date.now()
    const transactionId = 999
    const traceId = new TraceIdBuilder(agentId, agentStartTime, transactionId).build()
    const traceRoot = new TraceRootBuilder(agentId, traceId).build()
    const spanBuilder = new SpanBuilder(traceRoot)
    
    // Mock config
    const config = {
        getHttpStatusCodeErrors: () => ({ isErrorCode: () => false })
    }

    const spanRecorder = new SpanRecorder(spanBuilder, config)
    const error = new Error('Test Error')

    // Execute
    spanRecorder.recordException(error)

    // Verify Error Code masking
    t.equal(traceRoot.getShared().getErrorCode(), 1, 'errorCode should be masked to 1')

    t.end()
})

test('SpanRecorder.recordException() should not mask error code when markError is false', (t) => {
    // Setup
    const agentId = 'test-agent'
    const agentStartTime = Date.now()
    const transactionId = 999
    const traceId = new TraceIdBuilder(agentId, agentStartTime, transactionId).build()
    const traceRoot = new TraceRootBuilder(agentId, traceId).build()
    const spanBuilder = new SpanBuilder(traceRoot)
    
    const config = {
        getHttpStatusCodeErrors: () => ({ isErrorCode: () => false })
    }

    const spanRecorder = new SpanRecorder(spanBuilder, config)
    const error = new Error('Test Error')

    // Execute
    spanRecorder.recordException(error, false)

    // Verify Error Code masking (should clearly NOT be 1)
    t.notEqual(traceRoot.getShared().getErrorCode(), 1, 'errorCode should not be masked')

    t.end()
})
