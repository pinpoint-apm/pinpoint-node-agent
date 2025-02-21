/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { Transform } = require('node:stream')
const log = require('../utils/logger')

const maxAttempts = 3
const initialBackoff = 1000
// Java Agent queue size private static final int DEFAULT_AGENT_SENDER_EXECUTOR_QUEUE_SIZE = 1000;
class GrpcReadableStream {
    constructor(makeCall, options = { minutes: 10 }) {
        this.makeCall = makeCall
        this.options = options
        this.readableStream = this.makeReadableStream()
        this.pipeWritableStream()
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

        if (isNaN(this.deadline)) {
            return
        }
        const now = Date.now()
        if (now - this.deadline > this.grpcStreamDeadline) {
            this.end()
        }
    }

    readStop() {
        this.readable = false
    }

    pipeWritableStream(callCount = 1) {
        if (typeof this.makeCall !== 'function') {
            return
        }

        if (this.retryMakingWritableStream) {
            return
        }
        this.retryMakingWritableStream = true

        try {
            const writableStream = this.makeCall()
            writableStream.on('error', (error) => {
                if (!isCallCanceledError(error)) {
                    log.error('writable steam error in GrpcReadableStream', error)
                }

                if (!this.readableStream.readable) {
                    return
                }
                // https://nodejs.org/api/stream.html#errors-while-writing
                // If a Readable stream pipes into a Writable stream when Writable emits an error, the Readable stream will be unpiped.
                process.nextTick(() => {
                    this.lazyPipeWritableStream(callCount)
                })
            })

            this.readableStream.pipe(writableStream)
            this.writableStream = writableStream
            callCount = 1
            this.deadline = Date.now()
        } catch (error) {
            if(error?.message !== 'Channel has been shut down') {
                log.error('error in pipeWritableStream', error)
            }
            if (callCount <= maxAttempts) {
                setTimeout(() => {
                    this.pipeWritableStream(callCount + 1)
                }, initialBackoff * callCount)
            }
        } finally {
            this.retryMakingWritableStream = false
        }
    }

    lazyPipeWritableStream(callCount = 1) {
        setTimeout(() => {
            this.pipeWritableStream(callCount)
        }, initialBackoff * callCount)
    }

    end() {
        this.readableStream.end()
        this.writableStream.end()
    }

    get grpcStreamDeadline() {
        return this.deadlineOfConfig ?? 10 * 60 * 1000
    }

    setDeadlineMinutes(deadline) {
        if (typeof deadline === 'number') {
            this.deadlineOfConfig = deadline * 60 * 1000
        }
    }
}

module.exports = GrpcReadableStream

function isCallCanceledError(error) {
    return error?.code === 1
}
