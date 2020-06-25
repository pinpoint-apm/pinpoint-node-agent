'use strict'

const SequenceGenerator = require('./sequence-generator').SequenceGenerator

class AsyncId {
  constructor(asyncId) {
    this.asyncId = asyncId
    this.sequenceGenerator = new SequenceGenerator()
  }

  get nextAsyncSequence() {
    return this.sequenceGenerator.next
  }

}

module.exports = AsyncId