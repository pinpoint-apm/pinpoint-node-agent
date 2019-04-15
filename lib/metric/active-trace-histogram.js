'use strict'

const HistogramSchema = require('./histogram-schema')

class ActiveTraceHistogram{
  constructor (schema) {
    this.schema = schema || HistogramSchema.NORMAL_SCHEMA
    this.typeCode = schema.typeCode
    this.fastCount = 0
    this.normalCount = 0
    this.slowCount = 0
    this.verySlowCount = 0
  }

  increase (elapsedTime) {
    if (!elapsedTime) {
      return
    }

    if (elapsedTime <= this.schema.fast) {
      this.fastCount++
    } else if (elapsedTime <= this.schema.normal) {
      this.normalCount++
    } else if (elapsedTime <= this.schema.slow) {
      this.slowCount++
    } else {
      this.verySlowCount++
    }
  }
}

module.exports = ActiveTraceHistogram

