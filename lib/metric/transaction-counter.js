/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { getTransactionId, getContinuedTransactionId, getDisabledId, getContinuedDisabledId } = require('../context/trace/id-generator')

// DECREMENT_CYCLE in AtomicIdGenerator.java
const DECREMENT_CYCLE = 5

// DefaultTransactionCounter.java
// Counts how far each id generator moved from its initial value
class TransactionCounter {
    getSampledNewCount() {
        const generator = getTransactionId()
        return generator.sequence - generator.initValue
    }

    getSampledContinuationCount() {
        return decrementedCount(getContinuedTransactionId())
    }

    getUnsampledNewCount() {
        return decrementedCount(getDisabledId())
    }

    getUnsampledContinuationCount() {
        return decrementedCount(getContinuedDisabledId())
    }
}

function decrementedCount(generator) {
    return Math.abs(generator.sequence - generator.initValue) / DECREMENT_CYCLE
}

module.exports = TransactionCounter
