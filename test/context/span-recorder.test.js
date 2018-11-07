const test = require('tape')

const SpanRecorder = require('context/span-recorder')
const fixture = require('../fixture/fixture')

test('Should start ...', function (t) {
  t.plan(1)

  const spanRecorder = new SpanRecorder()
  spanRecorder.start(fixture.getTraceId())
  spanRecorder.recordServiceType()

  t.ok(spanRecorder.span)
})
