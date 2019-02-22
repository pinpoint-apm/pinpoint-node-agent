'use strict'

const transactionIdGenerator = require('./sequence-generator').transactionIdGenerator

const DELIMETER = '^'

class TransactionId {
  constructor (agentId, agentStartTime, sequence) {
    // agnetId + agentStartTime + sequenceNumber
    this.agentId = agentId
    this.agentStartTime = agentStartTime
    if (sequence === null || sequence === undefined) {
      this.sequence = transactionIdGenerator.next
    } else {
      this.sequence = sequence
    }
  }

  toString () {
    return [this.agentId, this.agentStartTime, this.sequence].join(DELIMETER)
  }

  static toTransactionId(str) {
    if (str !== null && str !== undefined) {
      const r = str.split(DELIMETER)
      return new TransactionId(r[0], Number(r[1]), Number(r[2]))
    }
    return null
  }
}

module.exports = TransactionId
