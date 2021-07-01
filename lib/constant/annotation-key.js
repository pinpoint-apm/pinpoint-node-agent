/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

// https://github.com/pinpoint-apm/pinpoint/blob/b6a3f3e8aed8111264bedc77b110e0ffd5aa4852/commons/src/main/java/com/navercorp/pinpoint/common/trace/AnnotationKey.java#L144
const AnnotationKey = require('../context/annotation-key')
const AnnotationKeyProperty = require('./annotation').AnnotationKeyProperty

const DefaultAnnotationKey = {
  API: new AnnotationKey(12, 'API'),
  API_METADATA: new AnnotationKey(13, 'API-METADATA'),
  HTTP_URL: new AnnotationKey(40, 'http.url'),
  HTTP_PARAM: new AnnotationKey(41, 'http.param', AnnotationKeyProperty.VIEW_IN_RECORD_SET),
  HTTP_STATUS_CODE: new AnnotationKey(46, 'http.status.code'),
  MAX_ARGS_SIZE: 10,
  ARGS0: new AnnotationKey(-1, 'args[0]'),
  ARGS1: new AnnotationKey(-2, 'args[1]'),
  ARGS2: new AnnotationKey(-3, 'args[2]'),
  ARGS3: new AnnotationKey(-4, 'args[3]'),
  ARGS4: new AnnotationKey(-5, 'args[4]'),
  ARGS5: new AnnotationKey(-6, 'args[5]'),
  ARGS6: new AnnotationKey(-7, 'args[6]'),
  ARGS7: new AnnotationKey(-8, 'args[7]'),
  ARGS8: new AnnotationKey(-9, 'args[8]'),
  ARGS9: new AnnotationKey(-10, 'args[9]'),
  ARGSN: new AnnotationKey(-11, 'args[N]'),
}

const EventAnnotationKey = {
  MONGO_JSON_DATA: new AnnotationKey(150, "MONGO-JSON-Data")
}

module.exports = {
  DefaultAnnotationKey,
  EventAnnotationKey,
}
