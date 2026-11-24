/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const { ExceptionRecorder } = require('../../../lib/context/trace/exception-recorder')
const SpanEventBuilder = require('../../../lib/context/trace/span-event-builder')
const TraceIdBuilder = require('../../../lib/context/trace/trace-id-builder')
const RemoteTraceRootBuilder = require('../../../lib/context/remote-trace-root-builder')
const annotationKey = require('../../../lib/constant/annotation-key')
const RecordingDataSender = require('../../support/recording-data-sender')

const agentStartTime = Date.now()
const traceRoot = new RemoteTraceRootBuilder('agentId', agentStartTime, 1).setTraceId(new TraceIdBuilder('agentId', agentStartTime, 1).build()).build()

test('the same error recorded on two span events of a trace is one exception chain', (t) => {
    const dataSender = new RecordingDataSender()
    const exceptionRecorder = new ExceptionRecorder(traceRoot, dataSender, 10)
    const error = new Error('query failed')
    const callbackSpanEvent = SpanEventBuilder.make()
    const errorHandlerSpanEvent = SpanEventBuilder.make()

    exceptionRecorder.recordException(callbackSpanEvent, error)
    exceptionRecorder.recordException(errorHandlerSpanEvent, error)
    exceptionRecorder.close()

    const pExceptions = sentPExceptions(dataSender)
    t.equal(pExceptions.length, 1, 'one exception for the error')
    t.equal(pExceptions[0].getExceptionmessage(), 'query failed', 'the exception is the error')
    t.equal(exceptionChainId(callbackSpanEvent), pExceptions[0].getExceptionid(), 'the first span event points to the exception chain')
    t.equal(exceptionChainId(errorHandlerSpanEvent), pExceptions[0].getExceptionid(), 'the second span event points to the same exception chain')
    t.end()
})

test('two different errors of a trace are two exception chains', (t) => {
    const dataSender = new RecordingDataSender()
    const exceptionRecorder = new ExceptionRecorder(traceRoot, dataSender, 10)
    const firstSpanEvent = SpanEventBuilder.make()
    const secondSpanEvent = SpanEventBuilder.make()

    exceptionRecorder.recordException(firstSpanEvent, new Error('first query failed'))
    exceptionRecorder.recordException(secondSpanEvent, new Error('second query failed'))
    exceptionRecorder.close()

    const pExceptions = sentPExceptions(dataSender)
    t.deepEqual(pExceptions.map(pException => pException.getExceptionmessage()), ['first query failed', 'second query failed'], 'one exception for each error')
    t.notEqual(pExceptions[0].getExceptionid(), pExceptions[1].getExceptionid(), 'each error has its own exception chain')
    t.equal(exceptionChainId(firstSpanEvent), pExceptions[0].getExceptionid(), 'the first span event points to the first exception chain')
    t.equal(exceptionChainId(secondSpanEvent), pExceptions[1].getExceptionid(), 'the second span event points to the second exception chain')
    t.end()
})

test('an error that wraps the recorded error as its cause continues the same exception chain from the wrapping error', (t) => {
    const dataSender = new RecordingDataSender()
    const exceptionRecorder = new ExceptionRecorder(traceRoot, dataSender, 10)
    const error = new Error('query failed')
    const wrappingError = new Error('request failed', { cause: error })
    const querySpanEvent = SpanEventBuilder.make()
    const routeSpanEvent = SpanEventBuilder.make()

    exceptionRecorder.recordException(querySpanEvent, error)
    exceptionRecorder.recordException(routeSpanEvent, wrappingError)
    exceptionRecorder.close()

    const pExceptions = sentPExceptions(dataSender)
    t.deepEqual(pExceptions.map(pException => [pException.getExceptionmessage(), pException.getExceptiondepth()]), [['request failed', 0], ['query failed', 1]], 'the chain starts from the wrapping error and goes down to its cause')
    t.equal(pExceptions[0].getExceptionid(), pExceptions[1].getExceptionid(), 'both errors are in one exception chain')
    t.equal(exceptionChainId(querySpanEvent), pExceptions[0].getExceptionid(), 'the query span event points to the exception chain')
    t.equal(exceptionChainId(routeSpanEvent), pExceptions[0].getExceptionid(), 'the route span event points to the same exception chain')
    t.end()
})

test('an error wrapped twice is one exception chain from the outermost error', (t) => {
    const dataSender = new RecordingDataSender()
    const exceptionRecorder = new ExceptionRecorder(traceRoot, dataSender, 10)
    const error = new Error('query failed')
    const serviceError = new Error('service failed', { cause: error })
    const requestError = new Error('request failed', { cause: serviceError })

    exceptionRecorder.recordException(SpanEventBuilder.make(), error)
    exceptionRecorder.recordException(SpanEventBuilder.make(), serviceError)
    exceptionRecorder.recordException(SpanEventBuilder.make(), requestError)
    exceptionRecorder.close()

    const pExceptions = sentPExceptions(dataSender)
    t.deepEqual(pExceptions.map(pException => [pException.getExceptionmessage(), pException.getExceptiondepth()]), [['request failed', 0], ['service failed', 1], ['query failed', 2]], 'the chain starts from the outermost error')
    t.end()
})

test('each exception has the start time of the span event the error was recorded on', (t) => {
    const dataSender = new RecordingDataSender()
    const exceptionRecorder = new ExceptionRecorder(traceRoot, dataSender, 10)
    const querySpanEvent = SpanEventBuilder.make()
    querySpanEvent.startTime = 1000

    exceptionRecorder.recordException(querySpanEvent, new Error('query failed', { cause: new Error('socket hang up') }))
    exceptionRecorder.close()

    const pExceptions = sentPExceptions(dataSender)
    t.deepEqual(pExceptions.map(pException => pException.getStarttime()), [1000, 1000], 'the error and its cause have the start time of the query span event')
    t.end()
})

test('the recorded error keeps its start time when an error that wraps it is recorded later', (t) => {
    const dataSender = new RecordingDataSender()
    const exceptionRecorder = new ExceptionRecorder(traceRoot, dataSender, 10)
    const error = new Error('query failed')
    const querySpanEvent = SpanEventBuilder.make()
    querySpanEvent.startTime = 1000
    const routeSpanEvent = SpanEventBuilder.make()
    routeSpanEvent.startTime = 2000

    exceptionRecorder.recordException(querySpanEvent, error)
    exceptionRecorder.recordException(routeSpanEvent, new Error('request failed', { cause: error }))
    exceptionRecorder.close()

    const pExceptions = sentPExceptions(dataSender)
    t.deepEqual(pExceptions.map(pException => [pException.getExceptionmessage(), pException.getStarttime()]), [['request failed', 2000], ['query failed', 1000]], 'each error has the start time of the span event it was recorded on')
    t.end()
})

test('the deepest exceptions are dropped when an error that wraps the recorded error goes past maxDepth', (t) => {
    const dataSender = new RecordingDataSender()
    const exceptionRecorder = new ExceptionRecorder(traceRoot, dataSender, 2)
    const error = new Error('query failed', { cause: new Error('socket hang up') })

    exceptionRecorder.recordException(SpanEventBuilder.make(), error)
    exceptionRecorder.recordException(SpanEventBuilder.make(), new Error('request failed', { cause: error }))
    exceptionRecorder.close()

    t.deepEqual(exceptionTree(sentPExceptions(dataSender)), [
        'A Error: request failed',
        'A   Error: query failed',
    ], 'the chain stops at maxDepth 2 from the wrapping error')
    t.end()
})

test('close without a recorded error sends nothing', (t) => {
    const dataSender = new RecordingDataSender()
    const exceptionRecorder = new ExceptionRecorder(traceRoot, dataSender, 10)

    exceptionRecorder.close()

    t.equal(dataSender.actualExceptionMetaData().length, 0, 'no ExceptionMetaData')
    t.end()
})

test('close sends the recorded exceptions once as the ExceptionMetaData of the trace', (t) => {
    const dataSender = new RecordingDataSender()
    const exceptionRecorder = new ExceptionRecorder(traceRoot, dataSender, 10)

    exceptionRecorder.recordException(SpanEventBuilder.make(), new Error('query failed'))
    exceptionRecorder.close()
    exceptionRecorder.close()

    const actualExceptionMetaData = dataSender.actualExceptionMetaData()
    t.equal(actualExceptionMetaData.length, 1, 'the second close sends nothing')
    t.equal(actualExceptionMetaData[0].traceRoot, traceRoot, 'the ExceptionMetaData has the trace root of the trace')
    t.end()
})

test('an error recorded again after another error continues its own exception chain', (t) => {
    const dataSender = new RecordingDataSender()
    const exceptionRecorder = new ExceptionRecorder(traceRoot, dataSender, 10)
    const error = new Error('query failed')
    const querySpanEvent = SpanEventBuilder.make()
    const otherSpanEvent = SpanEventBuilder.make()
    const errorHandlerSpanEvent = SpanEventBuilder.make()

    exceptionRecorder.recordException(querySpanEvent, error)
    exceptionRecorder.recordException(otherSpanEvent, new Error('cache failed'))
    exceptionRecorder.recordException(errorHandlerSpanEvent, error)
    exceptionRecorder.close()

    const pExceptions = sentPExceptions(dataSender)
    t.deepEqual(pExceptions.map(pException => pException.getExceptionmessage()), ['query failed', 'cache failed'], 'the error recorded again is sent once')
    t.equal(exceptionChainId(errorHandlerSpanEvent), exceptionChainId(querySpanEvent), 'the third span event points to the exception chain of the first')
    t.end()
})

test('ExceptionRecorder should walk error.cause chain', (t) => {
    const topError = new Error('top error', {
        cause: new TypeError('middle error', {
            cause: new RangeError('root cause'),
        }),
    })

    const dataSender = new RecordingDataSender()
    const exceptionRecorder = new ExceptionRecorder(traceRoot, dataSender, 10)
    exceptionRecorder.recordException(SpanEventBuilder.make(), topError)
    exceptionRecorder.close()

    t.deepEqual(exceptionTree(sentPExceptions(dataSender)), [
        'A Error: top error',
        'A   TypeError: middle error',
        'A     RangeError: root cause',
    ], 'the causes share the exceptionId of the top error, one depth deeper each')
    t.end()
})

test('ExceptionRecorder should respect maxDepth', (t) => {
    const topError = new Error('top', {
        cause: new Error('cause1', {
            cause: new Error('cause2'),
        }),
    })

    const dataSender = new RecordingDataSender()
    const exceptionRecorder = new ExceptionRecorder(traceRoot, dataSender, 2)
    exceptionRecorder.recordException(SpanEventBuilder.make(), topError)
    exceptionRecorder.close()

    t.deepEqual(exceptionTree(sentPExceptions(dataSender)), [
        'A Error: top',
        'A   Error: cause1',
    ], 'the chain stops at maxDepth 2')
    t.end()
})

test('ExceptionRecorder should send each error in AggregateError.errors as its own exception chain', (t) => {
    const aggregateError = new AggregateError([
        new Error('connect ECONNREFUSED ::1:3000'),
        new Error('connect ECONNREFUSED 127.0.0.1:3000'),
    ])

    const dataSender = new RecordingDataSender()
    const exceptionRecorder = new ExceptionRecorder(traceRoot, dataSender, 10)
    exceptionRecorder.recordException(SpanEventBuilder.make(), aggregateError)
    exceptionRecorder.close()

    t.deepEqual(exceptionTree(sentPExceptions(dataSender)), [
        'A AggregateError: ',
        'B Error: connect ECONNREFUSED ::1:3000',
        'C Error: connect ECONNREFUSED 127.0.0.1:3000',
    ], 'each error in AggregateError.errors starts its own chain at depth 0')
    t.end()
})

test('ExceptionRecorder should give the exceptionId of the span event to the error chain and a new exceptionId to each error in AggregateError.errors', (t) => {
    const fetchError = new TypeError('fetch failed', {
        cause: new AggregateError([
            new Error('connect ECONNREFUSED ::1:3000'),
        ]),
    })
    const dataSender = new RecordingDataSender()
    const exceptionRecorder = new ExceptionRecorder(traceRoot, dataSender, 10)
    const fetchSpanEvent = SpanEventBuilder.make()

    exceptionRecorder.recordException(fetchSpanEvent, fetchError)
    exceptionRecorder.close()

    const pExceptions = sentPExceptions(dataSender)
    t.equal(pExceptions[0].getExceptionid(), exceptionChainId(fetchSpanEvent), 'the TypeError has the exceptionId of the span event')
    t.equal(pExceptions[1].getExceptionid(), exceptionChainId(fetchSpanEvent), 'its AggregateError cause has the same exceptionId')
    t.notEqual(pExceptions[2].getExceptionid(), exceptionChainId(fetchSpanEvent), 'the error in AggregateError.errors has a new exceptionId')
    t.end()
})

test('ExceptionRecorder should send the errors of an AggregateError found in the cause chain', (t) => {
    const fetchError = new TypeError('fetch failed', {
        cause: new AggregateError([
            new Error('connect ECONNREFUSED ::1:3000'),
            new Error('connect ECONNREFUSED 127.0.0.1:3000'),
        ]),
    })

    const dataSender = new RecordingDataSender()
    const exceptionRecorder = new ExceptionRecorder(traceRoot, dataSender, 10)
    exceptionRecorder.recordException(SpanEventBuilder.make(), fetchError)
    exceptionRecorder.close()

    t.deepEqual(exceptionTree(sentPExceptions(dataSender)), [
        'A TypeError: fetch failed',
        'A   AggregateError: ',
        'B Error: connect ECONNREFUSED ::1:3000',
        'C Error: connect ECONNREFUSED 127.0.0.1:3000',
    ], 'the errors of the AggregateError cause follow the TypeError chain')
    t.end()
})

test('ExceptionRecorder should add only the AggregateError.errors of the part that an error wrapping the recorded error adds', (t) => {
    const fetchError = new AggregateError([
        new Error('connect ECONNREFUSED ::1:3000'),
    ])
    const retryError = new AggregateError([
        new Error('connect ECONNREFUSED ::1:4000'),
    ], 'retry failed', { cause: fetchError })

    const dataSender = new RecordingDataSender()
    const exceptionRecorder = new ExceptionRecorder(traceRoot, dataSender, 10)
    exceptionRecorder.recordException(SpanEventBuilder.make(), fetchError)
    exceptionRecorder.recordException(SpanEventBuilder.make(), retryError)
    exceptionRecorder.close()

    t.deepEqual(exceptionTree(sentPExceptions(dataSender)), [
        'A AggregateError: retry failed',
        'A   AggregateError: ',
        'B Error: connect ECONNREFUSED ::1:3000',
        'C Error: connect ECONNREFUSED ::1:4000',
    ], 'the errors of the recorded AggregateError are sent once and the wrapping AggregateError adds its own')
    t.end()
})

test('ExceptionRecorder should walk the cause chain of an error in AggregateError.errors', (t) => {
    const aggregateError = new AggregateError([
        new Error('request failed', {
            cause: new Error('socket hang up'),
        }),
    ])

    const dataSender = new RecordingDataSender()
    const exceptionRecorder = new ExceptionRecorder(traceRoot, dataSender, 10)
    exceptionRecorder.recordException(SpanEventBuilder.make(), aggregateError)
    exceptionRecorder.close()

    t.deepEqual(exceptionTree(sentPExceptions(dataSender)), [
        'A AggregateError: ',
        'B Error: request failed',
        'B   Error: socket hang up',
    ], 'the cause of errors[0] shares its exceptionId at depth 1')
    t.end()
})

test('ExceptionRecorder should send the errors of an AggregateError nested in AggregateError.errors', (t) => {
    const anyError = new AggregateError([
        new AggregateError([
            new Error('connect ECONNREFUSED ::1:3000'),
            new Error('connect ECONNREFUSED 127.0.0.1:3000'),
        ]),
        new AggregateError([
            new Error('connect ECONNREFUSED ::1:4000'),
            new Error('connect ECONNREFUSED 127.0.0.1:4000'),
        ]),
    ], 'All promises were rejected')

    const dataSender = new RecordingDataSender()
    const exceptionRecorder = new ExceptionRecorder(traceRoot, dataSender, 10)
    exceptionRecorder.recordException(SpanEventBuilder.make(), anyError)
    exceptionRecorder.close()

    t.deepEqual(exceptionTree(sentPExceptions(dataSender)), [
        'A AggregateError: All promises were rejected',
        'B AggregateError: ',
        'C AggregateError: ',
        'D Error: connect ECONNREFUSED ::1:3000',
        'E Error: connect ECONNREFUSED 127.0.0.1:3000',
        'F Error: connect ECONNREFUSED ::1:4000',
        'G Error: connect ECONNREFUSED 127.0.0.1:4000',
    ], 'the outer array errors come before the nested array errors')
    t.end()
})

test('ExceptionRecorder should send at most 10 errors from AggregateError.errors whatever maxDepth is', (t) => {
    const errors = Array.from({ length: 12 }, (_, index) => new Error(`request ${index} failed`))
    const aggregateError = new AggregateError(errors)

    const dataSender = new RecordingDataSender()
    const exceptionRecorder = new ExceptionRecorder(traceRoot, dataSender, 2)
    exceptionRecorder.recordException(SpanEventBuilder.make(), aggregateError)
    exceptionRecorder.close()

    const pExceptions = sentPExceptions(dataSender)
    t.equal(pExceptions.length, 11, 'the AggregateError and the first 10 errors')
    t.equal(pExceptions[10].getExceptionmessage(), 'request 9 failed', 'the last one is errors[9]')
    t.end()
})

test('ExceptionRecorder should not send the errors array of an error that is not an AggregateError', (t) => {
    const validationError = new Error('invalid request')
    validationError.name = 'ValidationError'
    validationError.errors = ['id is required', 'name is required']

    const dataSender = new RecordingDataSender()
    const exceptionRecorder = new ExceptionRecorder(traceRoot, dataSender, 10)
    exceptionRecorder.recordException(SpanEventBuilder.make(), validationError)
    exceptionRecorder.close()

    t.deepEqual(exceptionTree(sentPExceptions(dataSender)), [
        'A ValidationError: invalid request',
    ], 'only the ValidationError itself')
    t.end()
})

test('ExceptionRecorder should skip the values in AggregateError.errors that are not errors', (t) => {
    const aggregateError = new AggregateError([
        undefined,
        'timeout',
        new Error('connect ECONNREFUSED 127.0.0.1:3000'),
    ])

    const dataSender = new RecordingDataSender()
    const exceptionRecorder = new ExceptionRecorder(traceRoot, dataSender, 10)
    exceptionRecorder.recordException(SpanEventBuilder.make(), aggregateError)
    exceptionRecorder.close()

    t.deepEqual(exceptionTree(sentPExceptions(dataSender)), [
        'A AggregateError: ',
        'B Error: connect ECONNREFUSED 127.0.0.1:3000',
    ], 'only the AggregateError and its Error')
    t.end()
})

test('ExceptionRecorder should send the first 10 errors without throwing when AggregateError.errors is huge', (t) => {
    const errors = Array.from({ length: 200000 }, (_, index) => new Error(`request ${index} failed`))
    const aggregateError = new AggregateError(errors)

    const dataSender = new RecordingDataSender()
    const exceptionRecorder = new ExceptionRecorder(traceRoot, dataSender, 10)
    exceptionRecorder.recordException(SpanEventBuilder.make(), aggregateError)
    exceptionRecorder.close()

    const pExceptions = sentPExceptions(dataSender)
    t.equal(pExceptions.length, 11, 'the AggregateError and the first 10 errors')
    t.equal(pExceptions[10].getExceptionmessage(), 'request 9 failed', 'the last one is errors[9]')
    t.end()
})

function sentPExceptions(dataSender) {
    return dataSender.actualExceptionMetaData().flatMap(exceptionMetaData => exceptionMetaData.valueOfProtocolBuffer().getExceptionsList())
}

function exceptionChainId(spanEventBuilder) {
    return spanEventBuilder.annotations.find(annotation => annotation.getKey() === annotationKey.EXCEPTION_CHAIN_ID.getCode()).getValue()
}

function exceptionTree(pExceptions) {
    const labels = new Map()
    return pExceptions.map(pException => {
        const exceptionId = pException.getExceptionid()
        if (!labels.has(exceptionId)) {
            labels.set(exceptionId, String.fromCharCode(65 + labels.size))
        }
        return `${labels.get(exceptionId)} ${'  '.repeat(pException.getExceptiondepth())}${pException.getExceptionclassname()}: ${pException.getExceptionmessage()}`
    })
}
