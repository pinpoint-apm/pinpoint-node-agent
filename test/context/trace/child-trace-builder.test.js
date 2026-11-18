/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const { ProcessAgentBuilder } = require('../../support/process-agent-builder')
const RecordingDataSender = require('../../support/recording-data-sender')

test('ChildTraceBuilder close sends the ExceptionMetaData of its exceptions once', function (t) {
    const dataSender = new RecordingDataSender()
    const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()
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

    const actualExceptionMetaData = dataSender.actualExceptionMetaData()
    t.equal(actualExceptionMetaData.length, 1, 'close() sends one ExceptionMetaData')
    t.equal(actualExceptionMetaData[0].traceRoot, trace.getTraceRoot(), 'ExceptionMetaData has the trace root of the child trace')
    const actualException = actualExceptionMetaData[0].valueOfProtocolBuffer().getExceptionsList()[0]
    t.equal(actualException.getExceptionmessage(), 'child trace error', 'ExceptionMetaData has the child trace exception')

    const afterCloseRecorder = childTraceBuilder.traceBlockBegin()
    childTraceBuilder.traceBlockEnd(afterCloseRecorder)
    const actualExceptionMetaDataAfterSpanEvent = dataSender.actualExceptionMetaData()
    t.equal(actualExceptionMetaDataAfterSpanEvent.length, 1, 'a span event ended on the closed child trace does not send the exception again')

    const afterCloseExceptionRecorder = childTraceBuilder.traceBlockBegin()
    afterCloseExceptionRecorder.recordException(new Error('after close error'))
    childTraceBuilder.traceBlockEnd(afterCloseExceptionRecorder)
    const actualExceptionMetaDataAfterCloseException = dataSender.actualExceptionMetaData()
    t.equal(actualExceptionMetaDataAfterCloseException.length, 2, 'an exception recorded on the closed child trace is sent')
    const actualAfterCloseException = actualExceptionMetaDataAfterCloseException[1].valueOfProtocolBuffer().getExceptionsList()[0]
    t.equal(actualAfterCloseException.getExceptionmessage(), 'after close error', 'ExceptionMetaData has the exception recorded after close')

    traceContext.completeTraceObject(trace)
    const actualExceptionMetaDataAfterRootClose = dataSender.actualExceptionMetaData()
    t.equal(actualExceptionMetaDataAfterRootClose.length, 2, 'closing the root trace does not send the child trace exceptions')
    t.end()
})
