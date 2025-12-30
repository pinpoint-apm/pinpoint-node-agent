/**
 * Pinpoint Node.js Agent
 * Copyright 2025-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const { Writable } = require('node:stream')
const loglevel = require('loglevel')
const logger = require('../../lib/utils/log/logger')
const GrpcWritableStreamBuilder = require('../../lib/client/grpc-writable-stream-builder')

// dummy writable stream used by the builder
class DummyWritable extends Writable {
    constructor() {
        super({ objectMode: true })
        this._ended = false
    }

    _write(_chunk, _enc, cb) {
        cb()
    }

    end() {
        this._ended = true
        super.end()
    }
}

test('grpc writable stream logs collector INTERNAL error via default logger', (t) => {
    t.plan(2)

    const warnMessages = []
    const originalWarn = loglevel.warn
    loglevel.warn = function () { warnMessages.push(Array.from(arguments).join(' ')) }

    const builder = new GrpcWritableStreamBuilder((options, callback) => {
        const writable = new DummyWritable()
        setImmediate(() => callback({ code: 13 }))
        return writable
    })

    logger.getLogger()

    const stream = builder.build()

    setImmediate(() => {
        t.equal(warnMessages.length, 1, 'default logger.warn should be called once for INTERNAL error')
        t.ok(warnMessages[0].includes('Collector returned 13 INTERNAL error'), 'warn message should mention collector INTERNAL error')

        stream.end()
        loglevel.warn = originalWarn
        t.end()
    })
})
