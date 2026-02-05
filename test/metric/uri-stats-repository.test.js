const test = require('tape')
const { UriStatsRepository } = require('../../lib/metric/uri-stats-repository')
const { UriStatsInfo } = require('../../lib/metric/uri-stats-info-builder')
const DateNow = require('../../lib/support/date-now')

test('UriStatsRepository should store and rotate snapshots using DateNow', (t) => {
    // config mock
    const config = { isUriStatsEnabled: () => true }
    // 30s interval
    const repository = new UriStatsRepository(10, 30000, config)

    // Reset Time
    DateNow.setOffset(0)
    const now = DateNow.now()
    const baseTimestamp = repository.calculateBaseTimestamp(now)

    // 1. Store first data
    const info1 = new UriStatsInfo('/api/v1', true, now, now + 50)
    repository.store(info1)

    const currentSnapshot = repository.snapshotManager.getCurrent(baseTimestamp)
    t.ok(currentSnapshot, 'Current snapshot should exist')
    t.equal(currentSnapshot.dataMap.get('/api/v1').totalHistogram.count, 1, 'Should count 1 request')

    // 2. Advance time by 31 seconds to force rotation
    // (Current bucket base + 30000 < New time)
    DateNow.setOffset(31000)

    const later = DateNow.now()
    const info2 = new UriStatsInfo('/api/v1', true, later, later + 200)

    repository.store(info2)

    // Previous snapshot should be in queue
    t.equal(repository.completedSnapshotQueue.length, 1, 'Should have 1 completed snapshot in queue')

    // Check new snapshot
    const newBaseTimestamp = repository.calculateBaseTimestamp(later)
    const newSnapshot = repository.snapshotManager.getCurrent(newBaseTimestamp)
    t.ok(newSnapshot.dataMap.get('/api/v1'), 'New snapshot should have api/v1')

    // 3. Poll completed snapshot
    const completed = repository.poll()
    t.ok(completed, 'Should poll a snapshot')
    t.equal(completed.dataMap.get('/api/v1').totalHistogram.count, 1, 'Completed snapshot has correct data')

    // Reset offset for other tests
    DateNow.setOffset(0)
    t.end()
})

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

test('UriStatsRepository should limit capacity', (t) => {
    const config = { isUriStatsEnabled: () => true }
    const capacity = 2
    const repository = new UriStatsRepository(capacity, 30000, config)
    DateNow.setOffset(0)

    repository.store(new UriStatsInfo('/1', true, 0, 10))
    repository.store(new UriStatsInfo('/2', true, 0, 10))
    repository.store(new UriStatsInfo('/3', true, 0, 10)) // Should receive false internally or be ignored

    const baseTimestamp = repository.calculateBaseTimestamp(DateNow.now())
    const snapshot = repository.snapshotManager.getCurrent(baseTimestamp)

    t.equal(snapshot.dataMap.size, 2, 'Should not exceed capacity 2')
    t.ok(snapshot.dataMap.has('/1'))
    t.ok(snapshot.dataMap.has('/2'))
    t.notOk(snapshot.dataMap.has('/3'))

    t.end()
})

test('UriStatsRepository should correctly check for snapshot completed queue and snapshot bucket using URI pattern', (t) => {
    const config = { isUriStatsEnabled: () => true }
    // 30s interval
    const repository = new UriStatsRepository(10, 30000, config)
    DateNow.setOffset(0)

    const uriPattern = '/api/users/:id'
    const now = DateNow.now()

    // Bucket 0 ( < 100ms )
    repository.store(new UriStatsInfo(uriPattern, true, now, now + 50))
    // Bucket 1 ( 100ms ~ 300ms )
    repository.store(new UriStatsInfo(uriPattern, true, now, now + 150))
    // Bucket 7 ( > 8000ms )
    repository.store(new UriStatsInfo(uriPattern, true, now, now + 9000))

    // Advance time to force rotation (31 seconds)
    DateNow.setOffset(31000)

    // Store data for next snapshot to trigger flush
    const later = DateNow.now()
    repository.store(new UriStatsInfo(uriPattern, true, later, later + 50))

    // Check Queue
    t.equal(repository.completedSnapshotQueue.length, 1, 'Queue should have 1 snapshot')

    // Poll and Check Map & Buckets
    const completedSnapshot = repository.poll()
    t.ok(completedSnapshot, 'Should retrieve snapshot')

    const entry = completedSnapshot.dataMap.get(uriPattern)
    t.ok(entry, 'Should have entry for URI pattern')
    t.equal(entry.totalHistogram.count, 3, 'Total count 3')
    t.equal(entry.totalHistogram.buckets[0], 1, 'Bucket 0 count 1')
    t.equal(entry.totalHistogram.buckets[1], 1, 'Bucket 1 count 1')
    t.equal(entry.totalHistogram.buckets[7], 1, 'Bucket 7 count 1')

    t.end()
})

test.onFinish(() => {
    DateNow.setOffset(0)
})

