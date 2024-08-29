/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const transactionIdGenerator = require('./sequence-generators').transactionIdGenerator

const delimiter = '^'

class TransactionId {
  constructor (agentId, agentStartTime, sequence) {
    // agnetId + agentStartTime + sequenceNumber
    this.agentId = agentId
    this.agentStartTime = agentStartTime
    if (sequence === null || sequence === undefined) {
      this.sequence = transactionIdGenerator.stringValueOfNext()
    } else {
      this.sequence = sequence
    }
  }

  toString () {
    return [this.agentId, this.agentStartTime, this.sequence].join(delimiter)
  }

  static toTransactionId(str) {
    if (str !== null && str !== undefined) {
      const r = str.split(delimiter)
      if (r.length === 3) {
        return new TransactionId(r[0], r[1], r[2])
      }
    }
    return null
  }
}

module.exports = TransactionId
