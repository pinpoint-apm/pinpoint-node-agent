'use strict'

const SequenceGenerator = require('../context/sequence-generator')

let samplingCountGenerator = null

const getIsSampling = (sampling, sampleRate) => () => {
  if (sampling) {
    if (sampleRate === 1) {
      return true
    }
    if (sampleRate > 1) {
      if (!samplingCountGenerator) {
        samplingCountGenerator = new SequenceGenerator(0, sampleRate * 100000000)
      }
      return samplingCountGenerator.next % sampleRate === 0
    }
  }
  return false
}

module.exports = {
 getIsSampling
}
