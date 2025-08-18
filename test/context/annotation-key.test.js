/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const annotationConstant = require('../../lib/constant/annotation')
const AnnotationKeyProperty = annotationConstant.AnnotationKeyProperty

const AnnotationKey = require('../../lib/context/annotation-key')

test('Should create AnnotationKey with properties', function (t) {
  t.plan(2)

  const annotationKey = new AnnotationKey(123, 'express.get', AnnotationKeyProperty.ERROR_API_METADATA)

  t.equal(annotationKey.errorApiMetadata, true)
  t.equal(annotationKey.viewInRecordSet, false)
})
