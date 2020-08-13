/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const SequenceGenerator = require('../context/sequence-generator').SequenceGenerator

const MAX_NORMALIZED_VALUE = 100000000

let samplingCountGenerator = null

const getIsSampling = (sampling, sampleRate) => () => {
  if (sampling) {
    if (sampleRate === 1) {
      return true
    }
    if (sampleRate > 1) {
      if (!samplingCountGenerator) {
        samplingCountGenerator = new SequenceGenerator(0, sampleRate * MAX_NORMALIZED_VALUE)
      }
      return samplingCountGenerator.next % sampleRate === 0
    }
  }
  return false
}

module.exports = {
 getIsSampling
}
