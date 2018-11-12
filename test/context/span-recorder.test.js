const test = require('tape')

const SpanRecorder = require('context/span-recorder')
const fixture = require('../fixture/fixture')

const serviceTypeConstant = require('constant/service-type')
const ServiceTypeProperty = serviceTypeConstant.ServiceTypeProperty

const ServiceType = require('context/service-type')
const MethodDescriptor = require('context/method-descriptor')

test('Should start ...', function (t) {
  t.plan(1)

  const serviceType = new ServiceType(123, ServiceTypeProperty.TERMINAL, ServiceTypeProperty.RECORD_STATISTICS)
  const methodDescriptor = new MethodDescriptor('express.get', 0)


  const spanRecorder = new SpanRecorder()
  spanRecorder.start(fixture.getTraceId())
  spanRecorder.recordServiceType(serviceType)
  spanRecorder.recordApi(methodDescriptor)
  spanRecorder.recordRpc('/test/url')

  console.log('spanRecorder.span : ', spanRecorder.span)

  t.ok(spanRecorder.span)
})
