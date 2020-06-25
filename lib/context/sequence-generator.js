'use strict'

class SequenceGenerator{
  constructor (initValue = 0, maxValue = Number.MAX_SAFE_INTEGER) {
    this.initValue = initValue
    this.maxValue = maxValue
    this.sequence = initValue
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
  asyncIdGenerator: new SequenceGenerator(1),
  stringMetaCacheKeyGenerator: new SequenceGenerator(1),
  apiMetaCacheKeyGenerator: new SequenceGenerator(1),
  pingIdGenerator: new SequenceGenerator(),
  dummyIdGenerator: new SequenceGenerator(),
}
