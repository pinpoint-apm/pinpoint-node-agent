/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { decrementCycle, getTransactionId, getContinuedTransactionId, getDisabledId, getContinuedDisabledId } = require('../context/trace/id-generator')

// DefaultTransactionCounter.java
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
    return Math.abs(generator.sequence - generator.initValue) / decrementCycle
}

module.exports = TransactionCounter
