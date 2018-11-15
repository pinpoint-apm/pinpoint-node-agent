const test = require('tape')

const SpanEvent = require('context/span-event')
const SpanEventRecorder = require('context/span-event-recorder')

const ServiceTypeCode = require('constant/service-type').ServiceTypeCode

test('Should create span event recorder', function (t) {
  t.plan(1)

  const spanEvent = new SpanEvent()
  const spanEventRecorder = new SpanEventRecorder(spanEvent)
  spanEventRecorder.recordServiceType(ServiceTypeCode.express)
  spanEventRecorder.recordApi('express.get')

  t.equal(spanEventRecorder.spanEvent.sequence, -1)
})
