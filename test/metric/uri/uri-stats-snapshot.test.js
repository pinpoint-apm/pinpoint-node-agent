/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const { UriStatsRepository } = require('../../../lib/metric/uri/uri-stats-repository')
const { UriStatsInfo } = require('../../../lib/metric/uri/uri-stats-info-builder')
const DateNow = require('../../../lib/support/date-now')

test('UriStatsSnapshot histogram logic', (t) => {
    const config = { isUriStatsEnabled: () => true }
    const repository = new UriStatsRepository(1000, 30000, config)
    DateNow.setOffset(0)

    const uri = '/histogram-test'
    // Success cases
    repository.store(new UriStatsInfo(uri, true, 0, 50))   // Bucket 0
    repository.store(new UriStatsInfo(uri, true, 0, 150))  // Bucket 1
    repository.store(new UriStatsInfo(uri, true, 0, 9000)) // Bucket 7

    // Failed case
    repository.store(new UriStatsInfo(uri, false, 0, 400)) // Bucket 2, Failed

    const baseTimestamp = repository.calculateBaseTimestamp(DateNow.now())
    const snapshot = repository.snapshotManager.getCurrent(baseTimestamp)
    const entry = snapshot.dataMap.get(uri)

    t.equal(entry.totalHistogram.count, 4, 'Total count 4')
    t.equal(entry.totalHistogram.sum, 50 + 150 + 9000 + 400, 'Total sum correct')
    t.equal(entry.totalHistogram.max, 9000, 'Max elapsed correct')

    // Check Buckets
    t.equal(entry.totalHistogram.buckets[0], 1, 'Bucket[0] count 1')
    t.equal(entry.totalHistogram.buckets[1], 1, 'Bucket[1] count 1')
    t.equal(entry.totalHistogram.buckets[2], 1, 'Bucket[2] count 1')
    t.equal(entry.totalHistogram.buckets[7], 1, 'Bucket[7] count 1')

    // Check Failed Histogram
    t.equal(entry.failedHistogram.count, 1, 'Failed count 1')
    t.equal(entry.failedHistogram.buckets[2], 1, 'Failed Bucket[2] count 1')

    t.end()
})

test.onFinish(() => {
    DateNow.setOffset(0)
})
