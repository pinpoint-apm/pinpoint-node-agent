'use strict'

const sequenceGenerator = require('./sequence-generator').asyncSequenceGenerator

class AsyncId {
  constructor (asyncId) {
    this.asyncId = asyncId
  }

  get nextAsyncSequence () {
    return sequenceGenerator.next
  }

}

module.exports = AsyncId
