/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const v8 = require('v8')
const fs = require('fs')
const { constants } = require('perf_hooks')
const ResourceStatsCollector = require('../../lib/metric/resource-stats-collector')

test('collect heap used, the V8 heap limit as heap max and external memory as non-heap used', (t) => {
    const collector = new ResourceStatsCollector()
    t.teardown(() => collector.shutdown())

    const memory = collector.getMemoryStats()

    t.true(memory.heapUsed > 0, 'heapUsed is collected')
    t.equal(memory.heapMax, v8.getHeapStatistics().heap_size_limit, 'heapMax is the V8 heap size limit')
    t.true(memory.nonHeapUsed > 0, 'nonHeapUsed is process.memoryUsage().external')
    t.end()
})

test('collect process user cpu and system cpu', async (t) => {
    const collector = new ResourceStatsCollector()
    t.teardown(() => collector.shutdown())

    const cpuStats = collector.getCpuStats()
    busyFor(500)
    const cpu = await cpuStats

    t.true(cpu.user > 0, `process user cpu ${cpu.user} is collected`)
    t.true(cpu.system > 0 && cpu.system <= 1, `system cpu ${cpu.system} is between 0 and 1`)
    t.end()
})

test('count minor GCs as new GC', async (t) => {
    const collector = new ResourceStatsCollector({ gcStats: true })
    t.teardown(() => collector.shutdown())

    allocateShortLivedObjects()
    await new Promise(resolve => setTimeout(resolve, 100))
    const gc = collector.getGcStats()

    t.true(gc.newCount > 0, `new GC count ${gc.newCount} increases after short-lived allocations`)
    t.true(gc.newTime >= 0, 'new GC time is collected')
    t.true(Number.isInteger(gc.newTime), 'new GC time is milliseconds as an integer')
    t.end()
})

test('count a major GC as old GC', (t) => {
    const collector = new ResourceStatsCollector({ gcStats: true })
    t.teardown(() => collector.shutdown())

    collector.recordGc({ detail: { kind: constants.NODE_PERFORMANCE_GC_MAJOR }, duration: 5 })

    t.equal(collector.getGcStats().oldCount, 1, 'old GC count is 1')
    t.equal(collector.getGcStats().oldTime, 5, 'old GC time is 5 ms')
    t.end()
})

test('add incremental marking time to old GC time without counting a GC', (t) => {
    const collector = new ResourceStatsCollector({ gcStats: true })
    t.teardown(() => collector.shutdown())

    collector.recordGc({ detail: { kind: constants.NODE_PERFORMANCE_GC_INCREMENTAL }, duration: 3 })

    t.equal(collector.getGcStats().oldCount, 0, 'old GC count stays 0')
    t.equal(collector.getGcStats().oldTime, 3, 'old GC time is 3 ms')
    t.end()
})

test('count a minor mark-sweep GC from --minor-ms as new GC', (t) => {
    const minorMarkSweep = 2
    const collector = new ResourceStatsCollector({ gcStats: true })
    t.teardown(() => collector.shutdown())

    collector.recordGc({ detail: { kind: minorMarkSweep }, duration: 2 })

    t.equal(collector.getGcStats().newCount, 1, 'new GC count is 1')
    t.equal(collector.getGcStats().newTime, 2, 'new GC time is 2 ms')
    t.end()
})

test('do not count weak callback processing as a GC', (t) => {
    const collector = new ResourceStatsCollector({ gcStats: true })
    t.teardown(() => collector.shutdown())

    collector.recordGc({ detail: { kind: constants.NODE_PERFORMANCE_GC_WEAKCB }, duration: 1 })

    t.deepEqual(collector.getGcStats(), { oldCount: 0, oldTime: 0, newCount: 0, newTime: 0 }, 'GC stats stay 0')
    t.end()
})

test('do not collect GC stats when gcStats is disabled', (t) => {
    const collector = new ResourceStatsCollector({ gcStats: false })
    t.teardown(() => collector.shutdown())

    t.equal(collector.getGcStats(), undefined, 'GC stats are not collected')
    t.end()
})

test('collect open file descriptor count on Linux', { skip: process.platform !== 'linux' }, async (t) => {
    const collector = new ResourceStatsCollector({ fileDescriptorStats: true })
    t.teardown(() => collector.shutdown())

    t.true(await collector.getOpenFileDescriptorCount() > 0, 'open file descriptor count is collected')
    t.end()
})

test('open file descriptor count does not include the fd that reads /proc/self/fd', { skip: process.platform !== 'linux' }, async (t) => {
    const collector = new ResourceStatsCollector({ fileDescriptorStats: true })
    t.teardown(() => collector.shutdown())

    const openFileDescriptorCount = await collector.getOpenFileDescriptorCount()
    const openFds = fs.readdirSync('/proc/self/fd').filter(fd => isOpen(`/proc/self/fd/${fd}`)).length

    t.equal(openFileDescriptorCount, openFds, 'open file descriptor count excludes the closed readdir() fd')
    t.end()
})

test('do not collect open file descriptor count when fileDescriptorStats is disabled', async (t) => {
    const collector = new ResourceStatsCollector({ fileDescriptorStats: false })
    t.teardown(() => collector.shutdown())

    t.equal(await collector.getOpenFileDescriptorCount(), undefined, 'open file descriptor count is not collected')
    t.end()
})

test('do not collect open file descriptor count outside Linux', { skip: process.platform === 'linux' }, async (t) => {
    const collector = new ResourceStatsCollector({ fileDescriptorStats: true })
    t.teardown(() => collector.shutdown())

    t.equal(await collector.getOpenFileDescriptorCount(), undefined, 'open file descriptor count is not collected')
    t.end()
})

function isOpen(fdPath) {
    try {
        fs.readlinkSync(fdPath)
        return true
    } catch {
        return false
    }
}

function busyFor(millis) {
    const end = Date.now() + millis
    while (Date.now() < end) {
        Math.sqrt(Math.random())
    }
}

function allocateShortLivedObjects() {
    for (let i = 0; i < 1000000; i++) {
        ({ index: i, value: 'x'.repeat(10) })
    }
}
