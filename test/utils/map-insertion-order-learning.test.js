/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')

test('map insertion order learning test', (t) => {
    const map1 = new Map()

    map1.set('0', 'foo')
    map1.set(1, 'bar')

    let iterator1 = map1[Symbol.iterator]()

    let index = 0
    for (const item of iterator1) {
        if (index == 0) {
            t.equal(item[0], '0', 'key match')
            t.equal(item[1], 'foo', 'value match')
        }
        if (index == 1) {
            t.equal(item[0], 1, 'key match')
            t.equal(item[1], 'bar', 'value match')
        }
        index++
    }

    map1.set('0', 'foo')
    map1.set(1, 'bar')
    map1.delete('0')
    map1.set('0', 'foo2')
    iterator1 = map1[Symbol.iterator]()
    index = 0
    for (const item of iterator1) {
        if (index == 0) {
            t.equal(item[0], 1, 'key match')
            t.equal(item[1], 'bar', 'value match')
        }
        if (index == 1) {
            t.equal(item[0], '0', 'key match')
            t.equal(item[1], 'foo2', 'value match')
        }
        index++
    }

    // get order
    const cache = Array.from(map1)
    t.deepEqual(cache[0], [1, 'bar'], 'key match')
    t.deepEqual(cache[1], ['0', 'foo2'], 'key match')

    // remove low hit count
    map1.delete(1)
    t.equal(map1.size, 1)

    iterator1 = map1[Symbol.iterator]()
    index = 0
    for (const item of iterator1) {
        if (index == 0) {
            t.equal(item[0], '0', 'key match')
            t.equal(item[1], 'foo2', 'value match')
        }
        index++
    }

    t.end()
})
