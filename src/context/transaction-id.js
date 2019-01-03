'use strict'

const transactionIdGenerator = require('context/sequence-generator').transactionIdGenerator

const DELIMETER = '^'

class TransactionId {
  constructor (agentId, agentStartTime, sequence) {
    // agnetId + agentStartTime + sequenceNumber
    this.agentId = agentId
    this.agentStartTime = agentStartTime
    this.sequence = sequence || transactionIdGenerator.next
  }

  toString () {
    return [this.agentId, this.agentStartTime, this.sequence].join(DELIMETER)
  }
}

module.exports = TransactionId
