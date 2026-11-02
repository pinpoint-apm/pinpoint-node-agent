/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const activeRequestRepository = require('../../lib/metric/active-request-repository')
const TraceRoot = require('../../lib/context/trace/trace-root')

test('An active trace records its response time when it is removed', (t) => {
    activeRequestRepository.collectResponseTime()
    const traceRoot = new TraceRoot('agentId', 1000, 'active-trace')
    activeRequestRepository.register(traceRoot)

    activeRequestRepository.remove(traceRoot, 1030)

    t.deepEqual(activeRequestRepository.collectResponseTime(), { avg: 30, max: 30 }, 'response time is 30 ms')
    t.end()
})

test('A trace removed twice records its response time once', (t) => {
    activeRequestRepository.collectResponseTime()
    const traceRoot = new TraceRoot('agentId', 1000, 'removed-twice')
    activeRequestRepository.register(traceRoot)

    activeRequestRepository.remove(traceRoot, 1010)
    activeRequestRepository.remove(traceRoot, 1050)

    t.deepEqual(activeRequestRepository.collectResponseTime(), { avg: 10, max: 10 }, 'only the first remove records 10 ms')
    t.end()
})

test('A trace that was never active records no response time', (t) => {
    activeRequestRepository.collectResponseTime()
    const traceRoot = new TraceRoot('agentId', 1000, 'never-active')

    activeRequestRepository.remove(traceRoot, 1020)

    t.deepEqual(activeRequestRepository.collectResponseTime(), { avg: 0, max: 0 }, 'no response time')
    t.end()
})
