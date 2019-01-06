'use strict'

const transactionIdGenerator = require('context/sequence-generator').transactionIdGenerator

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
    if (!str) return null

    const tokens = str.split(DELIMETER)
    if (tokens.length !== 3 || isNaN(tokens[1]) || isNaN(tokens[2])) {
      return null
    }
    return new TransactionId(tokens[0], Number(tokens[1]), Number(tokens[2]))
  }
}

module.exports = TransactionId
