const HistogramSchema = {
  FAST_SCHEMA: {
    typeCode: 1,
    fast: 100,
    normal: 300,
    slow: 500,
  },
  NORMAL_SCHEMA: {
    typeCode: 2,
    fast: 1000,
    normal: 3000,
    slow: 5000,
  }
}

module.exports = HistogramSchema
