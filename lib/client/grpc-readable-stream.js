/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { Transform } = require('node:stream')
const log = require('../utils/logger')

// Java Agent queue size private static final int DEFAULT_AGENT_SENDER_EXECUTOR_QUEUE_SIZE = 1000;
class GrpcReadableStream {
    constructor(makeCall, options = {}) {
        this.makeCall = makeCall
        this.readableStream = this.makeTransform(options)
        this._pipe()
    }

    makeTransform(options) {
        const readableStream = new Transform(Object.assign({
            readableObjectMode: true,
            transform(chunk, encoding, callback) {
                callback(null, chunk)
            }
        }, options))

        readableStream.on('error', () => {
            // https://nodejs.org/api/stream.html#readablepipedestination-options
            // `One important caveat is that if the Readable stream emits an error during processing, 
            // the Writable destination is not closed automatically. 
            // If an error occurs, it will be necessary to manually close each stream 
            // in order to prevent memory leaks.`
            // for readable steam error memory leak prevention
            if (this.writableSteam && typeof this.writableSteam.end === 'function') {
                this.writableSteam.end()
            }
        })

        return readableStream
    }

    push(data) {
        this.readableStream.push(data)
    }

    _pipe() {
        if (typeof this.makeCall !== 'function') {
            return
        }
        const writableStream = this.makeCall()
        writableStream.on('error', (error) => {
            if (error) {
                log.error('writable steam error', error)
            }
        })

        this.readableStream.pipe(writableStream)
        this.writableSteam = writableStream
    }

    end() {
        this.readableStream.end()
    }
}

module.exports = GrpcReadableStream