/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const BoundedBufferReadableStream = require('../../lib/client/bounded-buffer-readable-stream')
const { Writable } = require('node:stream')

test('no piped readable steam', (t) => {
    const readable = new BoundedBufferReadableStream()
    readable.push('test1')
    readable.push('test2')
    readable.push(null)

    t.equal(readable.readableSteam.readable, true, 'no writable stream piped readable steam not started')
    t.equal(readable.buffer.length, 3, 'no writable stream piped readable steam buffer is not empty')
    t.end()
})

test('piped readable steam', (t) => {
    const readable = new BoundedBufferReadableStream({ encoding: 'utf8' })
    readable.push('test1')
    readable.push('test2')
    readable.push(null)

    readable.pipe(() => {
        const actualSteams = []
        const writable = new Writable({
            write(chunk, encoding, callback) {
                actualSteams.push(chunk.toString())
                callback()
            }
        })
        writable.on('finish', () => {
            t.equal(readable.readableSteam.readable, false, 'piped readable steam finished')
            t.equal(readable.buffer.length, 0, 'piped readable steam buffer is empty')

            t.equal(actualSteams.length, 2, 'piped readable steam')
            t.equal(actualSteams[0], 'test1', 'piped readable steam test1')
            t.equal(actualSteams[1], 'test2', 'piped readable steam test2')

            t.end()
        })
        return writable
    })
})

test('reconnect piped readable steam', (t) => {
    const readable = new BoundedBufferReadableStream({ encoding: 'utf8' })
    readable.push('test1')
    readable.push('test2')
    readable.push(null)

    const actualSteams = []
    readable.pipe(() => {
        return new Writable({
            write(chunk, encoding, callback) {
                actualSteams.push(chunk.toString())
                callback()
            }
        })
    })
    t.end()
})