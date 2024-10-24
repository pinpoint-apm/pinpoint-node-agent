/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const LongIdGenerator = require('./long-id-generator')

// INITIAL_TRANSACTION_ID
const transactionId = new LongIdGenerator(1)
// INITIAL_CONTINUED_TRANSACTION_ID
const continuedTransactionId = new LongIdGenerator(-1001)
// INITIAL_DISABLED_ID in AtomicIdGenerator.java
const disabledId = new LongIdGenerator(-1002)
// INITIAL_CONTINUED_DISABLED_ID in AtomicIdGenerator.java
const continueDisabledId = new LongIdGenerator(-1003)

module.exports = {
    nextTransactionId: function () {
        return transactionId.next(1)
    },
    nextContinuedTransactionId: function () {
        return continuedTransactionId.next(-5)
    },
    nextDisabledId: function () {
        return disabledId.next(-5)
    },
    nextContinuedDisabledId: function () {
        return continueDisabledId.next(-5)
    }
}