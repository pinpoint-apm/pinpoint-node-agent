/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const ResponseTimeCollector = require('../../lib/metric/response-time-collector')

test('Response times of 10 ms and 30 ms collect as avg 20 and max 30', (t) => {
    const collector = new ResponseTimeCollector()

    collector.add(10)
    collector.add(30)

    t.deepEqual(collector.collect(), { avg: 20, max: 30 }, 'avg is 20, max is 30')
    t.end()
})

test('No response time collects as avg 0 and max 0', (t) => {
    const collector = new ResponseTimeCollector()

    t.deepEqual(collector.collect(), { avg: 0, max: 0 }, 'avg is 0, max is 0')
    t.end()
})

test('Collect starts the next interval from no response time', (t) => {
    const collector = new ResponseTimeCollector()
    collector.add(50)
    collector.collect()

    collector.add(10)

    t.deepEqual(collector.collect(), { avg: 10, max: 10 }, 'the next interval has only 10 ms')
    t.end()
})
