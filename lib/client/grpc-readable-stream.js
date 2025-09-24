/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { Transform } = require('node:stream')
const log = require('../utils/log/logger')
const { logError } = require('./grpc-errors')
const { LogBuilder } = require('../utils/log/log-builder')

const maxAttempts = 3
const initialBackoff = 1000
// Java Agent queue size private static final int DEFAULT_AGENT_SENDER_EXECUTOR_QUEUE_SIZE = 1000;
class GrpcReadableStream {
    constructor(makeCall, options = { }) {
        this.makeCall = makeCall
        this.options = options
        this.readableStream = this.makeReadableStream()
        this.name = options.name ?? ''
        this.pipeWritableStream()
        this.logger = log.getLogger(LogBuilder.buildGrpcLog())
    }

    makeReadableStream() {
        const streamOptions = this.readableStreamObjectTransformOptions()
        const readableStream = new Transform(Object.assign({
            readableObjectMode: true,
            transform(chunk, encoding, callback) {
                callback(null, chunk)
            },
            // https://nodejs.org/api/stream.html#readablepushchunk-encoding
            read: () => {
                this.readStart()
            }
        }, streamOptions))

        readableStream.on('error', () => {
            // https://nodejs.org/api/stream.html#readablepipedestination-options
            // `One important caveat is that if the Readable stream emits an error during processing,
            // the Writable destination is not closed automatically.
            // If an error occurs, it will be necessary to manually close each stream
            // in order to prevent memory leaks.`
            // for readable steam error memory leak prevention
            if (this.writableStream && typeof this.writableStream.end === 'function') {
                this.writableStream.end()
            }
        })

        return readableStream
    }

    readableStreamObjectTransformOptions() {
        return Object.assign({}, this.options)
    }

    readStart() {
        this.readable = true
    }


    push(data) {
        if (this.readable === false) {
            return
        }

        if(!this.readableStream.push(data)) {
            this.readStop()
        }
    }

    readStop() {
        this.readable = false
    }

    pipeWritableStream(retryCount = 0) {
        if (typeof this.makeCall !== 'function') {
            return
        }

        try {
            const writableStream = this.makeCall()
            writableStream.on('error', (error) => {
                logError('writable steam error in GrpcReadableStream', error)

                if (this.ended) {
                    return
                }
                // https://nodejs.org/api/stream.html#errors-while-writing
                // If a Readable stream pipes into a Writable stream when Writable emits an error, the Readable stream will be unpiped.
                this.lazyPipeWritableStream(retryCount + 1)
            })

            this.readableStream.pipe(writableStream)
            this.writableStream = writableStream
        } catch (error) {
            if(error?.message !== 'Channel has been shut down') {
                this.logger.error('error in pipeWritableStream', error)
            }
            this.lazyPipeWritableStream(retryCount + 1)
        }
    }

    lazyPipeWritableStream(callCount = 1) {
        if (callCount > maxAttempts) {
            return
        }

        setTimeout(() => {
            this.pipeWritableStream(callCount)
        }, initialBackoff * callCount)
    }

    end() {
        this.ended = true
        // writableStream.end() is called by function onend() { dest.end() } in Readable.prototype.pipe()
        this.readableStream.end()
    }

    retryConnectionWritableStream() {
        this.readableStream.unpipe(this.writableStream)
        this.writableStream.end()
        this.pipeWritableStream()
    }
}

module.exports = GrpcReadableStream