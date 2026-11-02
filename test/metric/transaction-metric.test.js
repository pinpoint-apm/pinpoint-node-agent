/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const agent = require('../support/agent-singleton-mock')
const TransactionMetric = require('../../lib/metric/transaction-metric')
const TraceIdBuilder = require('../../lib/context/trace/trace-id-builder')

test('A sampled new transaction counts as sampledNewCount', (t) => {
    agent.bindHttp()
    const transactionMetric = new TransactionMetric()

    agent.traceContext.newTraceObject('/sampled')

    t.deepEqual(transactionMetric.snapshot(), transactionCounts({ sampledNewCount: 1 }), 'sampledNewCount is 1')
    t.end()
})

test('A new transaction not sampled counts as unsampledNewCount', (t) => {
    agent.bindHttp({ sampling: { enable: false } })
    const transactionMetric = new TransactionMetric()

    agent.traceContext.newTraceObject('/not-sampled')

    t.deepEqual(transactionMetric.snapshot(), transactionCounts({ unsampledNewCount: 1 }), 'unsampledNewCount is 1')
    t.end()
})

test('A continued transaction counts as sampledContinuationCount', (t) => {
    agent.bindHttp()
    const transactionMetric = new TransactionMetric()

    agent.traceContext.continueTraceObject(new TraceIdBuilder(agent.getConfig().getAgentId(), agent.agentStartTime, '9').build())

    t.deepEqual(transactionMetric.snapshot(), transactionCounts({ sampledContinuationCount: 1 }), 'sampledContinuationCount is 1')
    t.end()
})

test('A continued transaction with sampling disabled counts as unsampledContinuationCount', (t) => {
    agent.bindHttp()
    const transactionMetric = new TransactionMetric()

    agent.traceContext.disableSampling()

    t.deepEqual(transactionMetric.snapshot(), transactionCounts({ unsampledContinuationCount: 1 }), 'unsampledContinuationCount is 1')
    t.end()
})

test('A snapshot counts only the transactions since the previous snapshot', (t) => {
    agent.bindHttp()
    const transactionMetric = new TransactionMetric()

    agent.traceContext.newTraceObject('/first')
    agent.traceContext.newTraceObject('/second')
    t.deepEqual(transactionMetric.snapshot(), transactionCounts({ sampledNewCount: 2 }), 'first snapshot has sampledNewCount 2')

    t.deepEqual(transactionMetric.snapshot(), transactionCounts({}), 'second snapshot with no transactions between has all counts 0')
    t.end()
})

function transactionCounts(counts) {
    return Object.assign({
        sampledNewCount: 0,
        sampledContinuationCount: 0,
        unsampledNewCount: 0,
        unsampledContinuationCount: 0,
        skippedNewCount: 0,
        skippedContinuationCount: 0,
    }, counts)
}
