'use strict'

class SequenceGenerator{
  constructor (initValue) {
    this.initValue = initValue
    this.sequence = initValue || 0
  }

  get next () {
    if (this.sequence > Number.MAX_SAFE_INTEGER) {
      this.sequence = this.initValue
    }
    return this.sequence++
  }

  // for test
  reset () {
    this.sequence = 0
  }
}

module.exports = {
  transactionIdGenerator: new SequenceGenerator(),
  cacheKeyGenerator: new SequenceGenerator(),
  samplingCountGenerator: new SequenceGenerator()
}
