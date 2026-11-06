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
const AsyncSpanChunkBuilder = require('../../lib/context/trace/async-span-chunk-builder')
const AsyncId = require('../../lib/context/async-id')
const { ExceptionMetaDataBuilder } = require('../../lib/context/trace/exception-meta-data-builder')

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

test('RecordingDataSender finds the async span chunk by its local async id', (t) => {
    const dataSender = new RecordingDataSender()
    const traceRoot = new TraceRootBuilder('agentId', 1).build()
    const localAsyncId = new AsyncId(7, 1)
    const asyncSpanChunk = new AsyncSpanChunkBuilder(traceRoot, localAsyncId).build([])

    dataSender.send(new SpanChunkBuilder(traceRoot).build([]))
    dataSender.send(new AsyncSpanChunkBuilder(traceRoot, new AsyncId(8, 1)).build([]))
    dataSender.send(asyncSpanChunk)

    t.equal(dataSender.findSpanChunk(new AsyncId(7, 1)), asyncSpanChunk, 'the span chunk with the same async id')
    t.end()
})

test('RecordingDataSender finds the exception metadata of a trace by its trace root', (t) => {
    const dataSender = new RecordingDataSender()
    const traceRoot = new TraceRootBuilder('agentId', 1).build()
    const exceptionMetaData = new ExceptionMetaDataBuilder(traceRoot).build()

    dataSender.send(new ExceptionMetaDataBuilder(new TraceRootBuilder('agentId', 2).build()).build())
    dataSender.send(exceptionMetaData)

    t.equal(dataSender.findExceptionMetaData(traceRoot), exceptionMetaData, 'the exception metadata of the trace')
    t.end()
})

test('RecordingDataSender records, then forwards to the data sender it wraps', (t) => {
    const forwarded = []
    const dataSender = new RecordingDataSender({
        send: (data) => forwarded.push(['send', data]),
        sendStat: (stats) => forwarded.push(['sendStat', stats]),
        sendPing: () => forwarded.push(['sendPing']),
        sendSupportedServicesCommand: () => forwarded.push(['sendSupportedServicesCommand']),
        close: () => forwarded.push(['close']),
    })
    const traceRoot = new TraceRootBuilder('agentId', 1).build()
    const span = new SpanBuilder(traceRoot).build()
    const stats = {}

    dataSender.send(span)
    dataSender.sendStat(stats)
    dataSender.sendPing()
    dataSender.sendSupportedServicesCommand()
    dataSender.close()

    t.equal(dataSender.findSpan(traceRoot), span, 'the span is recorded')
    t.deepEqual(forwarded, [['send', span], ['sendStat', stats], ['sendPing'], ['sendSupportedServicesCommand'], ['close']], 'every call is forwarded')
    t.end()
})

test('RecordingDataSender without a wrapped data sender accepts the calls the agent makes', (t) => {
    const dataSender = new RecordingDataSender()

    dataSender.sendStat({})
    dataSender.sendPing()
    dataSender.sendSupportedServicesCommand()
    dataSender.close()

    t.pass('no call throws')
    t.end()
})

test('RecordingDataSender does not record or forward after it is closed', (t) => {
    const forwarded = []
    const dataSender = new RecordingDataSender({ send: (data) => forwarded.push(data), close: () => {} })
    const traceRoot = new TraceRootBuilder('agentId', 1).build()

    dataSender.close()
    dataSender.send(new SpanBuilder(traceRoot).build())

    t.equal(dataSender.findSpan(traceRoot), undefined, 'the span is not recorded')
    t.deepEqual(forwarded, [], 'the span is not forwarded')
    t.end()
})
