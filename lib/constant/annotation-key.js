'use strict'

const AnnotationKey = require('../context/annotation-key')

const DefaultAnnotationKey = {
  API: new AnnotationKey(12, "API"),
  API_METADATA: new AnnotationKey(13, "API-METADATA"),
  HTTP_STATUS_CODE: new AnnotationKey(46, "http.status.code")
}

const EventAnnotationKey= {
  MONGO_JSON_DATA: new AnnotationKey(150, "MONGO-JSON-Data")
}

module.exports = {
  DefaultAnnotationKey,
  EventAnnotationKey,
}
