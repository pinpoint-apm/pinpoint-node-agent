/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const LongIdGenerator = require('./long-id-generator')

// DECREMENT_CYCLE in AtomicIdGenerator.java
const decrementCycle = 5

// INITIAL_TRANSACTION_ID
const transactionId = new LongIdGenerator(1)
// INITIAL_CONTINUED_TRANSACTION_ID
const continuedTransactionId = new LongIdGenerator(-1001)
// INITIAL_DISABLED_ID in AtomicIdGenerator.java
const disabledId = new LongIdGenerator(-1002)
// INITIAL_CONTINUED_DISABLED_ID in AtomicIdGenerator.java
const continueDisabledId = new LongIdGenerator(-1003)
// INITIAL_EXCEPTION_ID
const exceptionId = new LongIdGenerator(1)

module.exports = {
    decrementCycle,
    nextTransactionId: function () {
        return transactionId.next(1)
    },
    nextContinuedTransactionId: function () {
        return continuedTransactionId.next(-decrementCycle)
    },
    nextDisabledId: function () {
        return disabledId.next(-decrementCycle)
    },
    nextContinuedDisabledId: function () {
        return continueDisabledId.next(-decrementCycle)
    },
    getTransactionId: function () {
        return transactionId
    },
    getContinuedTransactionId: function () {
        return continuedTransactionId
    },
    getDisabledId: function () {
        return disabledId
    },
    getContinuedDisabledId: function () {
        return continueDisabledId
    },
    nextExceptionId: function () {
        return exceptionId.numberOfNext(1)
    }
}