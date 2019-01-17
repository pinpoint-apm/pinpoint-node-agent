'use strict'

const AnnotationKey = require('../context/annotation-key')

const DefaultAnnotationKey = {
  API: new AnnotationKey(12, "API"),
  API_METADATA: new AnnotationKey(13, "API-METADATA"),
}

module.exports = {
  DefaultAnnotationKey,
}
