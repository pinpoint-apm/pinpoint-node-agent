const SequenceGenerator = require('./sequence-generator')

module.exports = {
    transactionIdGenerator: new SequenceGenerator(),
    asyncIdGenerator: new SequenceGenerator(1),
    stringMetaCacheKeyGenerator: new SequenceGenerator(1),
    apiMetaCacheKeyGenerator: new SequenceGenerator(1),
    pingIdGenerator: new SequenceGenerator(),
    dummyIdGenerator: new SequenceGenerator(),
  }
  