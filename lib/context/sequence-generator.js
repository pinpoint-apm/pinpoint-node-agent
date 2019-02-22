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
  asyncIdGenerator: new SequenceGenerator(),
  asyncSequenceGenerator: new SequenceGenerator(),
  stringMetaCacheKeyGenerator: new SequenceGenerator(1),
  apiMetaCacheKeyGenerator: new SequenceGenerator(1),
  samplingCountGenerator: new SequenceGenerator(),
  pingIdGenerator: new SequenceGenerator(),
  dummyIdGenerator: new SequenceGenerator(),
}
