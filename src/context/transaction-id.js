const SequenceGenerator = require('context/sequence-generator')

class TransactionId {
  constructor (agentId, agentStartTime) {
    // agnetId + agentStartTime + sequenceNumber
    this.agentId = agentId
    this.agentStartTime = agentStartTime
    this.sequence = SequenceGenerator.next
  }
}

module.exports = TransactionId
