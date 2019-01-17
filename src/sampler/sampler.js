'use strict'

const samplingCountGenerator = require('../context/sequence-generator').samplingCountGenerator

const getIsSampling = (sampling, sampleRate) => () => {
  if (sampling) {
    if (sampleRate === 1) {
      return true
    }
    if (sampleRate > 1) {
      return samplingCountGenerator.next % sampleRate === 0
    }
  }
  return false
}

module.exports = {
 getIsSampling
}
