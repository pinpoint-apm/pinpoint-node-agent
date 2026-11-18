/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const agent = require('../../support/agent-singleton-mock')

test('ChildTraceBuilder close sends the ExceptionMetaData of its exceptions once', function (t) {
    agent.bindHttp()
    const traceContext = agent.getTraceContext()
    const trace = traceContext.newTraceObject('/child-exception')

    const spanEventRecorder = trace.traceBlockBegin()
    const asyncId = spanEventRecorder.getNextAsyncId()
    trace.traceBlockEnd(spanEventRecorder)

    const childTraceBuilder = traceContext.continueAsyncContextTraceObject(trace.getTraceRoot(), asyncId.nextLocalAsyncId2())
    const childRecorder = childTraceBuilder.traceBlockBegin()
    childRecorder.recordException(new Error('child trace error'))
    childTraceBuilder.traceBlockEnd(childRecorder)
    childTraceBuilder.close()

    const actualExceptionMetaData = agent.dataSender.dataSender.actualExceptionMetaData
    t.equal(actualExceptionMetaData.getTransactionid().getSequence(), trace.getTraceRoot().getTraceId().getTransactionId(), 'close() sends the ExceptionMetaData with the transaction id of the child trace')
    t.equal(actualExceptionMetaData.getExceptionsList()[0].getExceptionmessage(), 'child trace error', 'ExceptionMetaData has the child trace exception')

    const afterCloseRecorder = childTraceBuilder.traceBlockBegin()
    childTraceBuilder.traceBlockEnd(afterCloseRecorder)
    t.equal(agent.dataSender.dataSender.actualExceptionMetaData, actualExceptionMetaData, 'a span event ended on the closed child trace does not send the exception again')

    const afterCloseExceptionRecorder = childTraceBuilder.traceBlockBegin()
    afterCloseExceptionRecorder.recordException(new Error('after close error'))
    childTraceBuilder.traceBlockEnd(afterCloseExceptionRecorder)
    const actualAfterCloseExceptionMetaData = agent.dataSender.dataSender.actualExceptionMetaData
    t.equal(actualAfterCloseExceptionMetaData.getExceptionsList()[0].getExceptionmessage(), 'after close error', 'an exception recorded on the closed child trace is sent')

    traceContext.completeTraceObject(trace)
    t.equal(agent.dataSender.dataSender.actualExceptionMetaData, actualAfterCloseExceptionMetaData, 'closing the root trace does not send the child trace exceptions')
    t.end()
})
