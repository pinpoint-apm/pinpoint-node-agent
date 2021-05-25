/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

// https://github.com/pinpoint-apm/pinpoint/blob/b6a3f3e8aed8111264bedc77b110e0ffd5aa4852/commons/src/main/java/com/navercorp/pinpoint/common/trace/AnnotationKey.java#L144
const AnnotationKey = require('../context/annotation-key')

const DefaultAnnotationKey = {
  API: new AnnotationKey(12, "API"),
  API_METADATA: new AnnotationKey(13, "API-METADATA"),
  HTTP_URL: new AnnotationKey(40, "http.url"),
  HTTP_PARAM: new AnnotationKey(41, "http.param"),
  HTTP_STATUS_CODE: new AnnotationKey(46, "http.status.code")
}

const EventAnnotationKey = {
  MONGO_JSON_DATA: new AnnotationKey(150, "MONGO-JSON-Data")
}

module.exports = {
  DefaultAnnotationKey,
  EventAnnotationKey,
}
