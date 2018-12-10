const test = require('tape')
const { log, fixture, util } = require('../test-helper')

const annotationConstant = require('constant/annotation')
const AnnotationKeyProperty = annotationConstant.AnnotationKeyProperty

const AnnotationKey = require('context/annotation-key')

test('Should create AnnotationKey with properties', function (t) {
  t.plan(2)

  const annotationKey = new AnnotationKey(123, 'express.get', AnnotationKeyProperty.ERROR_API_METADATA)

  t.equal(annotationKey.errorApiMetadata, true)
  t.equal(annotationKey.viewInRecordSet, false)
})
