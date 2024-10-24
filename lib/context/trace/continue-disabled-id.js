/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const LongIdGenerator = require('./long-id-generator')

// INITIAL_CONTINUED_DISABLED_ID in AtomicIdGenerator.java
const continueDisabledId = new LongIdGenerator(-1003)
module.exports = {
    next: function () {
        return continueDisabledId.next(-5)
    }
}