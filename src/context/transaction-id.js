'use strict'

const SequenceGenerator = require('context/sequence-generator')

const DELIMETER = '^'

class TransactionId {
  constructor (agentId, agentStartTime, sequence) {
    // agnetId + agentStartTime + sequenceNumber
    this.agentId = agentId
    this.agentStartTime = agentStartTime
    this.sequence = sequence || SequenceGenerator.next
  }

  toString () {
    return [this.agentId, this.agentStartTime, this.sequence].join(DELIMETER)
  }
}

module.exports = TransactionId
