/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const { Writable } = require('node:stream')
const loglevel = require('loglevel')
const logger = require('../../lib/utils/log/logger')
const GrpcWritableStreamBuilder = require('../../lib/client/grpc-writable-stream-builder')

class DummyWritable extends Writable {
    constructor() {
        super({ objectMode: true })
    }

    _write(_chunk, _enc, cb) {
        cb()
    }
}

test('error code 13 INTERNAL should be logged via defaultLogger.warn, not grpcLogger', (t) => {
    t.plan(2)

    const warnMessages = []
    const originalWarn = loglevel.warn
    loglevel.warn = function () { warnMessages.push(Array.from(arguments).join(' ')) }

    t.teardown(() => {
        loglevel.warn = originalWarn
    })

    const builder = new GrpcWritableStreamBuilder((options, callback) => {
        const writable = new DummyWritable()
        setImmediate(() => callback({ code: 13 }))
        return writable
    })

    logger.getLogger()

    const stream = builder.build()

    setImmediate(() => {
        t.equal(warnMessages.length, 1, 'defaultLogger.warn should be called once for INTERNAL error')
        t.ok(warnMessages[0].includes('Collector returned 13 INTERNAL error'), 'message should mention collector INTERNAL error')

        stream.end()
        t.end()
    })
})
