/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const TransactionCounter = require('./transaction-counter')

// TransactionMetric.java
// Each snapshot is the count of transactions since the previous snapshot
class TransactionMetric {
    constructor() {
        this.counter = new TransactionCounter()
        this.previous = this.currentCounts()
    }

    snapshot() {
        const current = this.currentCounts()
        const previous = this.previous
        this.previous = current
        return {
            sampledNewCount: current.sampledNewCount - previous.sampledNewCount,
            sampledContinuationCount: current.sampledContinuationCount - previous.sampledContinuationCount,
            unsampledNewCount: current.unsampledNewCount - previous.unsampledNewCount,
            unsampledContinuationCount: current.unsampledContinuationCount - previous.unsampledContinuationCount,
            // The Node.js agent has no throughput sampler that skips transactions
            skippedNewCount: 0,
            skippedContinuationCount: 0,
        }
    }

    currentCounts() {
        return {
            sampledNewCount: this.counter.getSampledNewCount(),
            sampledContinuationCount: this.counter.getSampledContinuationCount(),
            unsampledNewCount: this.counter.getUnsampledNewCount(),
            unsampledContinuationCount: this.counter.getUnsampledContinuationCount(),
        }
    }
}

module.exports = TransactionMetric
