const test = require('tap').test

const SpanEventRecorder = require('context/span-event-recorder')

test('Should initialize with sequence -1', function (t) {
  t.plan(1)

  const spanEventRecorder = new SpanEventRecorder()

  t.equal(spanEventRecorder.sequence, -1)
})
