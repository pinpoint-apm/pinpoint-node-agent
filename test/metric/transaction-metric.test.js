/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const TransactionMetric = require('../../lib/metric/transaction-metric')
const TraceIdBuilder = require('../../lib/context/trace/trace-id-builder')
const { nullDataSenderAgent } = require('../support/process-agent-builder')

test('A sampled new transaction counts as sampledNewCount', (t) => {
    const agent = nullDataSenderAgent()
    const transactionMetric = new TransactionMetric()

    const trace = agent.getTraceContext().newTraceObject('/sampled')

    t.deepEqual(transactionMetric.snapshot(), transactionCounts({ sampledNewCount: 1 }), 'sampledNewCount is 1')
    agent.getTraceContext().completeTraceObject(trace)
    t.end()
})

test('A new transaction not sampled counts as unsampledNewCount', (t) => {
    const agent = nullDataSenderAgent({ sampling: { enable: false } })
    const transactionMetric = new TransactionMetric()

    const trace = agent.getTraceContext().newTraceObject('/not-sampled')

    t.deepEqual(transactionMetric.snapshot(), transactionCounts({ unsampledNewCount: 1 }), 'unsampledNewCount is 1')
    agent.getTraceContext().completeTraceObject(trace)
    t.end()
})

test('A continued transaction counts as sampledContinuationCount', (t) => {
    const agent = nullDataSenderAgent()
    const transactionMetric = new TransactionMetric()

    const trace = agent.getTraceContext().continueTraceObject(new TraceIdBuilder(agent.getConfig().getAgentId(), agent.agentStartTime, '9').build())

    t.deepEqual(transactionMetric.snapshot(), transactionCounts({ sampledContinuationCount: 1 }), 'sampledContinuationCount is 1')
    agent.getTraceContext().completeTraceObject(trace)
    t.end()
})

test('A continued transaction with sampling disabled counts as unsampledContinuationCount', (t) => {
    const agent = nullDataSenderAgent()
    const transactionMetric = new TransactionMetric()

    const trace = agent.getTraceContext().disableSampling()

    t.deepEqual(transactionMetric.snapshot(), transactionCounts({ unsampledContinuationCount: 1 }), 'unsampledContinuationCount is 1')
    agent.getTraceContext().completeTraceObject(trace)
    t.end()
})

test('A snapshot counts only the transactions since the previous snapshot', (t) => {
    const agent = nullDataSenderAgent()
    const transactionMetric = new TransactionMetric()

    const first = agent.getTraceContext().newTraceObject('/first')
    const second = agent.getTraceContext().newTraceObject('/second')
    t.deepEqual(transactionMetric.snapshot(), transactionCounts({ sampledNewCount: 2 }), 'first snapshot has sampledNewCount 2')

    t.deepEqual(transactionMetric.snapshot(), transactionCounts({}), 'second snapshot with no transactions between has all counts 0')
    agent.getTraceContext().completeTraceObject(first)
    agent.getTraceContext().completeTraceObject(second)
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
