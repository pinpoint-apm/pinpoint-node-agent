/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const { UID_BASE64_LENGTH, newUuidV7, encodeUid, newAgentId } = require('../../lib/utils/agent-uid')

const uuidBytes = (uuid) => Buffer.from(uuid.replace(/-/g, ''), 'hex')

// Java Base64Utils.encode(UUID) golden vectors, shared with pinpoint-go-agent uid_test.go
const goldenVectors = [
    ['00000000-0000-0000-0000-000000000000', 'AAAAAAAAAAAAAAAAAAAAAA'],
    ['ffffffff-ffff-ffff-ffff-ffffffffffff', '_____________________w'],
    ['12345678-90ab-cdef-1234-567890abcdef', 'EjRWeJCrze8SNFZ4kKvN7w'],
    ['00112233-4455-6677-8899-aabbccddeeff', 'ABEiM0RVZneImaq7zN3u_w'],
    ['0192f1a0-7e8b-7c3d-9f2e-1a2b3c4d5e6f', 'AZLxoH6LfD2fLhorPE1ebw'],
    ['deadbeef-dead-beef-dead-beefdeadbeef', '3q2-796tvu_erb7v3q2-7w'],
]

test('encodeUid matches Java Base64Utils.encode(UUID) golden vectors', (t) => {
    for (const [uuid, base64] of goldenVectors) {
        const actual = encodeUid(uuidBytes(uuid))
        t.equal(actual, base64, `encode ${uuid}`)
        t.equal(actual.length, UID_BASE64_LENGTH, `length of ${uuid}`)
        t.deepEqual(Buffer.from(actual, 'base64url'), uuidBytes(uuid), `decode ${base64}`)
    }
    t.end()
})

test('newUuidV7 sets RFC 9562 version 7, variant and timestamp', (t) => {
    const now = 0x0192f1a07e8b
    const bytes = newUuidV7(now)
    t.equal(bytes.length, 16, '16 bytes')
    t.equal(bytes.readUIntBE(0, 6), now, '48-bit big-endian Unix epoch milliseconds prefix')
    t.equal(bytes[6] >> 4, 7, 'version nibble is 7')
    t.equal(bytes[8] >> 6, 0b10, 'variant bits are 10')
    t.end()
})

test('newAgentId generates unique 22-char URL-safe base64 UUIDv7 ids', (t) => {
    const ids = new Set()
    for (let i = 0; i < 1000; i++) {
        const id = newAgentId()
        ids.add(id)
        const bytes = Buffer.from(id, 'base64url')
        if (id.length !== UID_BASE64_LENGTH || !/^[A-Za-z0-9_-]+$/.test(id) || encodeUid(bytes) !== id) {
            t.fail(`invalid id ${id}`)
        }
        if (bytes[6] >> 4 !== 7 || bytes[8] >> 6 !== 0b10) {
            t.fail(`not a UUIDv7 ${id}`)
        }
    }
    t.equal(ids.size, 1000, 'all ids are unique')
    t.end()
})

test('newUuidV7 ids are time-ordered', (t) => {
    const earlier = newUuidV7(1_700_000_000_000)
    const later = newUuidV7(1_700_000_000_001)
    t.ok(Buffer.compare(earlier.subarray(0, 6), later.subarray(0, 6)) < 0, 'timestamp prefix sorts by time')
    t.end()
})
