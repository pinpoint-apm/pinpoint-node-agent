/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const ResourceStatsCollector = require('../../lib/metric/resource-stats-collector')

test('collect memory stats from process.memoryUsage', (t) => {
    const collector = new ResourceStatsCollector()

    const memory = collector.collect().memory

    t.true(memory.heapUsed > 0, 'heapUsed is collected')
    t.true(memory.heapTotal >= memory.heapUsed, 'heapTotal is at least heapUsed')
    t.end()
})

test('collect cpu stats after the check interval', async (t) => {
    const collector = new ResourceStatsCollector()

    const cpu = await collector.collect().cpu

    t.true(cpu.user >= 0, 'user cpu usage is collected')
    t.equal(cpu.system, 0, 'system cpu usage is not collected yet')
    t.end()
})
