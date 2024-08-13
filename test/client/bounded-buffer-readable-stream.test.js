/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const BoundedBufferReadableStream = require('../../lib/client/bounded-buffer-readable-stream')
const { Writable } = require('node:stream')
const semver = require('semver')

test('no piped readable stream', (t) => {
    const readable = new BoundedBufferReadableStream()
    readable.push('test1')
    readable.push('test2')
    readable.push(null)

    t.equal(readable.readableStream.readable, true, 'no writable stream piped readable stream not started')
    t.equal(readable.buffer.length, 3, 'no writable stream piped readable stream buffer is not empty')
    t.end()
})

test('piped readable stream', (t) => {
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
            t.equal(readable.readableStream.readable, false, 'piped readable stream finished')
            t.equal(readable.buffer.length, 0, 'piped readable stream buffer is empty')

            t.equal(actualSteams.length, 2, 'piped readable stream')
            t.equal(actualSteams[0], 'test1', 'piped readable stream test1')
            t.equal(actualSteams[1], 'test2', 'piped readable stream test2')

            t.end()
        })
        return writable
    })
})

test('reconnect writable stream on piped readable stream', (t) => {
    t.plan(10)
    const readable = new BoundedBufferReadableStream({ encoding: 'utf8' })
    readable.push('test1')
    readable.push('test2')

    readable.readableStream.on('error', () => {
        t.fail('piped readable stream error event is not called')
    })

    readable.readableStream.on('end', () => {
        t.fail('piped readable stream end event is not called')
    })

    readable.readableStream.on('close', () => {
        t.fail('piped readable stream close event is not called')
    })

    readable.readableStream.on('unpipe', () => {
        t.fail('piped readable stream unpipe event is not called')
    })

    readable.pipe(() => {
        let count = 0
        const actualSteams = []
        const writableStream = new Writable({
            write(chunk, encoding, callback) {
                actualSteams.push(chunk.toString())
                callback()
                count++

                if (count === 2) {
                    // Writable.prototype.pipe is only public method for errorOrDestroy
                    // Writable.prototype.pipe = function() {
                    //     errorOrDestroy(this, new ERR_STREAM_CANNOT_PIPE());
                    // };
                    writableStream.pipe()
                }
            }
        })
        writableStream.on('error', (error) => {
            t.equal(error.message, 'Cannot pipe, not readable', 'piped writable stream error')
            t.equal(readable.readableStream.readable, true, 'piped readable stream is readable on close event')
            t.equal(readable.buffer.length, 0, 'piped readable stream buffer is empty')

            t.equal(actualSteams.length, 2, 'piped readable stream')
            t.equal(actualSteams[0], 'test1', 'piped readable stream test1')
            t.equal(actualSteams[1], 'test2', 'piped readable stream test2')

            t.false(readable.readable, 'piped readable stream is unpiped, so is not readable')
        })

        writableStream.on('finish', () => {
            t.fail('piped writable stream finish event is not called')
        })

        writableStream.on('close', () => {
            t.equal(readable.readableStream.readable, true, 'piped readable stream is no readable on close event')
            t.equal(writableStream.destroyed, true, 'piped writable stream is destroyed on close event')
        })

        writableStream.on('unpipe', () => {
            t.true(true, 'piped readable stream unpipe event is not called')
        })

        return writableStream
    })
})

test('If the Readable stream emits an error during processing, the writable destination is not closed automatically. If an error occurs, Close each streams, ', async (t) => {
    if (semver.satisfies(process.versions.node, '<17.0')) {
        t.plan(15)
    } else {
        t.plan(18)
    }

    const readable = new BoundedBufferReadableStream()
    readable.push('test1')
    readable.push('test2')
    readable.readableStream.on('error', (error) => {
        if (semver.satisfies(process.versions.node, '<19.0')) {
            t.equal(error.message, 'The "chunk" argument must be of type string or an instance of Buffer or Uint8Array. Received type number (1)', 'readable stream error message check')
        } else {
            t.equal(error.message, 'The "chunk" argument must be of type string or an instance of Buffer, TypedArray, or DataView. Received type number (1)', 'readable stream error message check')
        }
        t.equal(readable.buffer.length, 0, 'readable stream buffer is empty')
        t.equal(readable.readableStream.readable, false, 'the readable of readable stream is false on error event')
        if (semver.satisfies(process.versions.node, '>17.0')) {
            t.true(readable.readableStream.closed, 'closed property is true on error event of readable stream')
        }
        t.true(readable.readableStream.destroyed, 'destroyed property is true on error event of readable stream')
    })
    readable.readableStream.on('end', () => {
        t.fail('readable stream end event is not called')
    })
    readable.readableStream.on('close', function () {
        t.false(this.readable, 'readable property is false on close event of readable stream')
        if (semver.satisfies(process.versions.node, '>17.0')) {
            t.true(this.closed, 'closed property is true on close event of readable stream')
        }
        t.true(this.destroyed, 'destroyed property is true on close event of readable stream')

        // recovery readable stream
        // t.true(readable.readableStream.readable, 'readable property is true on close event of recovery readable stream after error')
    })

    t.equal(readable.buffer[0], 'test1', 'buffer[0] is test1')

    readable.pipe(() => {
        const actualSteams = []
        const writableStream = new Writable({
            write(chunk, encoding, callback) {
                actualSteams.push(chunk.toString())
                callback()
            }
        })

        writableStream.on('error', () => {
            t.fail('If readable stream occur an error, piped writable stream error event is not called')
        })

        writableStream.on('finish', function () {
            t.comment('If readable stream occur an error, piped writable stream is manually must be close')
            t.false(this.closed, 'closed property is false on the finish event of writable stream')
            t.false(this.destroyed, 'destroyed property is false on the finish event of writable stream')
            t.false(this.writable, 'writable property is false on the finish event of writable stream')
        })

        writableStream.on('close', function () {
            if (semver.satisfies(process.versions.node, '>17.0')) {
                t.true(this.closed, 'closed property is true on the close event of writable stream')
            }
            t.true(this.destroyed, 'destroyed property is true on the close event of writable stream')
            t.false(this.writable, 'writable property is false on the close event of writable stream')
        })

        writableStream.on('unpipe', function () {
            t.comment('If readable stream occur an error, piped writable stream unpipe event is must be called')
            t.false(this.closed, 'closed property is false on the unpipe event of writable stream')
            t.false(this.destroyed, 'destroyed property is false on the unpipe event of writable stream')
            t.false(this.writable, 'writable property is false on the unpipe event of writable stream')
        })

        return writableStream
    })
    process.nextTick(() => {
        const originalReadStart = readable.readStart
        // NODE 17+
        // readable stream has only errorOrDestroy method on _read method
        // try {
        //     this._read(state.highWaterMark);
        // } catch (err) {
        //     errorOrDestroy(this, err);
        // }
        readable.readStart = () => {
            process.nextTick(() => {
                readable.readStart = originalReadStart
            })
            return readable.readableStream.push(1)
        }

        readable.readableStream.push('test3')
    })
})

test('Max buffer size', (t) => {
    const dut = new BoundedBufferReadableStream({ maxBuffer: 2 })
    dut.push('test1')
    dut.push('test2')
    t.true(dut.buffer.length === 2, 'buffer size is 2')

    dut.push('test3')
    t.true(dut.buffer.length === 2, 'buffer size is 2')
    t.equal(dut.buffer[0], 'test1', 'buffer[0] is test1')
    t.equal(dut.buffer[1], 'test2', 'buffer[1] is test2')

    t.end()
})