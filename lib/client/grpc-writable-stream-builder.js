/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { logError } = require('./grpc-errors')
const ExponentialBackoffRetryBuilder = require('./exponential-backoff-retry-builder')
const log = require('../utils/logger')

class GrpcWritableStream {
    constructor(makeWritableStream) {
        this.makeWritableStream = makeWritableStream
        this.backoffRetry = new ExponentialBackoffRetryBuilder({
            maxAttempts: 3,
            initialBackoff: 1000,
            backoffMultiplier: 2,
            maxBackoff: 10000
        }).setRetryCallback(() => {
            this.connect()
        }).build()
    }

    connect() {
        try {
            const options = this.deadlineOptionsBuilder?.build() ?? {}
            const writableStream = this.makeWritableStream(options, (error, response) => {
                // } else if ((state[kState] & kFinished) !== 0) {
                //     err = new ERR_STREAM_ALREADY_FINISHED('end');
                // } else if ((state[kState] & kDestroyed) !== 0) {
                //     err = new ERR_STREAM_DESTROYED('end');
                // }
                // If writableStream is ended, it will throw an error.
                if (!this.ended(writableStream)) {
                    writableStream.end()
                }

                if (typeof this.callback === 'function') {
                    this.callback(error, response)
                }

                if (error) {
                    if (error.code === 13) {
                        log.warn('Warning: Collector returned 13 INTERNAL error. Too much Span data may be sent. Try increasing PINPOINT_SAMPLING_RATE to reduce traffic. https://github.com/pinpoint-apm/pinpoint-node-agent/issues/317')
                    }
                    logError('clientService callback in GrpcWritableStreamBuilder', error)
                    this.backoffRetry.retry()
                }
            })
            writableStream.on('error', (error) => {
                logError('writable.on("error") in GrpcWritableStreamBuilder', error)
                // https://nodejs.org/api/stream.html#errors-while-writing
                // If a Readable stream pipes into a Writable stream when Writable emits an error, the Readable stream will be unpiped.
                if (!this.ended(writableStream)) {
                    writableStream.end()
                }

                this.backoffRetry.retry()
            })

            if (this.shouldEndPreviousStream()) {
                this.writableStream.end()
            }
            this.writableStream = writableStream

            if (typeof this.writableReturnCallback === 'function') {
                this.writableReturnCallback(writableStream)
            }
            return writableStream
        } catch (error) {
            logError('try catch error in GrpcWritableStreamBuilder', error)
        }
    }

    ended(writableStream) {
        if (typeof this.writableAndEnded?.ended === 'function') {
            return this.writableAndEnded.ended(writableStream)
        }

        return writableStream.writableEnded === true
    }

    get writableEnded() {
        return this.ended(this.writableStream)
    }

    end() {
        if (!this.ended(this.writableStream)) {
            this.writableStream.end()
        }
        this.backoffRetry.stop()
    }

    shouldEndPreviousStream() {
        if (this.writableStream === undefined) {
            return false
        }

        return this.ended(this.writableStream) === false
    }

    on(event, listener) {
        this.writableStream.on(event, listener)
    }

    shouldCreateNewStream() {
        return this.backoffRetry.availableRetry()
    }

    get writable() {
        if (typeof this.writableAndEnded?.writable === 'function') {
            return this.writableAndEnded.writable(this.writableStream)
        }

        return this.writableStream?.writable === true
    }
}

class GrpcWritableStreamBuilder {
    constructor(makeWritableStream) {
        this.makeWritableStream = makeWritableStream
    }

    setDeadlineOptionsBuilder(deadlineOptionsBuilder) {
        this.deadlineOptionsBuilder = deadlineOptionsBuilder
        return this
    }

    setCallCallback(callback) {
        this.callback = callback
        return this
    }

    setWritableAndEnded(writableAndEnded) {
        if (!writableAndEnded) {
            return this
        }

        this.writableAndEnded = writableAndEnded
        return this
    }

    build(writableReturnCallback) {
        const writableStream = new GrpcWritableStream(this.makeWritableStream)
        writableStream.deadlineOptionsBuilder = this.deadlineOptionsBuilder
        writableStream.callback = this.callback
        writableStream.writableReturnCallback = writableReturnCallback
        writableStream.writableAndEnded = this.writableAndEnded
        writableStream.connect()
        return writableStream
    }
}

module.exports = GrpcWritableStreamBuilder