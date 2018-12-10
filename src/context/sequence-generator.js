'use strict'

class SequenceGenerator{
  constructor () {
    this.sequence = -1
  }

  get next () {
    return ++this.sequence
  }

  // for test
  reset () {
    this.sequence = -1
  }
}

module.exports = new SequenceGenerator()
