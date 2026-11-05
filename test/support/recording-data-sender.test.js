/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const RecordingDataSender = require('./recording-data-sender')
const SpanBuilder = require('../../lib/context/span-builder')
const SpanChunkBuilder = require('../../lib/context/span-chunk-builder')
const TraceRootBuilder = require('../../lib/context/trace-root-builder')

test('RecordingDataSender finds the span and span chunks of a trace by its trace root', (t) => {
    const dataSender = new RecordingDataSender()
    const traceRoot = new TraceRootBuilder('agentId', 1).build()
    const otherTraceRoot = new TraceRootBuilder('agentId', 2).build()
    const span = new SpanBuilder(traceRoot).build()
    const spanChunk = new SpanChunkBuilder(traceRoot).build([])

    dataSender.send(new SpanBuilder(otherTraceRoot).build())
    dataSender.send(span)
    dataSender.send(new SpanChunkBuilder(otherTraceRoot).build([]))
    dataSender.send(spanChunk)

    t.equal(dataSender.findSpan(traceRoot), span, 'the span of the trace')
    t.deepEqual(dataSender.findSpanChunks(traceRoot), [spanChunk], 'only the span chunks of the trace')
    t.end()
})
