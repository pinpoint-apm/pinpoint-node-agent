'use strict'

class SequenceGenerator{
  constructor (initValue, maxValue) {
    this.initValue = initValue
    this.maxValue = initValue || Number.MAX_SAFE_INTEGER
    this.sequence = initValue || 0
  }

  get next () {
    if (this.sequence > this.maxValue) {
      this.sequence = this.initValue
    }
    return this.sequence++
  }

  // for test
  reset () {
    this.sequence = this.initValue
  }
}

module.exports = {
  SequenceGenerator,
  transactionIdGenerator: new SequenceGenerator(),
  asyncIdGenerator: new SequenceGenerator(),
  asyncSequenceGenerator: new SequenceGenerator(),
  stringMetaCacheKeyGenerator: new SequenceGenerator(1),
  apiMetaCacheKeyGenerator: new SequenceGenerator(1),
  pingIdGenerator: new SequenceGenerator(),
  dummyIdGenerator: new SequenceGenerator(),
}
