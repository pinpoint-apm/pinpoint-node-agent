'use strict'

class SequenceGenerator{
  constructor (initValue) {
    this.sequence = initValue || -1
  }

  get next () {
    return ++this.sequence
  }

  // for test
  reset () {
    this.sequence = -1
  }
}

module.exports = {
  transactionIdGenerator: new SequenceGenerator(),
  cacheKeyGenerator: new SequenceGenerator()
}
