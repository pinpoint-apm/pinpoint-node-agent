
class SequenceGenerator{
  constructor () {
    this.sequence = -1
  }

  get next () {
    return ++this.sequence
  }
}

module.exports = new SequenceGenerator()
