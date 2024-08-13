const SequenceGenerator = require('./sequence-generator')

module.exports = {
    transactionIdGenerator: new SequenceGenerator(),
    asyncIdGenerator: new SequenceGenerator(1),
    stringMetaCacheKeyGenerator: new SequenceGenerator(1),
    apiMetaCacheKeyGenerator: new SequenceGenerator(1),
    sqlMetaDataCacheKeyGenerator: new SequenceGenerator(1),
    dummyIdGenerator: new SequenceGenerator(),
  }
  