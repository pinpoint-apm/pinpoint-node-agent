/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const SpanBuilder = require('../../lib/context/span-builder')
const TraceIdBuilder = require('../../lib/context/trace/trace-id-builder')
const RemoteTraceRootBuilder = require('../../lib/context/remote-trace-root-builder')

test('Span.toProtocolBuffer() should include err', (t) => {
    // TraceRoot and TraceId
    const agentId = 'test-agent'
    const agentStartTime = Date.now()
    const agentInfo = {
        getAgentId: () => agentId,
        getAgentStartTime: () => agentStartTime
    }
    const transactionId = 999
    const traceId = new TraceIdBuilder(agentId, agentStartTime, transactionId).build()
    const traceRoot = new RemoteTraceRootBuilder(agentInfo, transactionId).setTraceId(traceId).build()

    traceRoot.getShared().maskErrorCode(1)

    const spanBuilder = new SpanBuilder(traceRoot)

    const span = spanBuilder.build()
    const pSpanMessage = span.toProtocolBuffer()
    const pSpan = pSpanMessage.getSpan()

    t.equal(pSpan.getErr(), 1, 'err should match')

    t.end()
})
