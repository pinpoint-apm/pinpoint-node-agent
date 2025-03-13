/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { logError } = require('./grpc-errors')
const ExponentialBackoffRetryBuilder = require('./exponential-backoff-retry-builder')

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
        if (this.ended) {
            return
        }

        try {
            const options = this.deadlineOptionsBuilder?.build() ?? {}
            const writableStream = this.makeWritableStream(options, (error, response) => {
                // } else if ((state[kState] & kFinished) !== 0) {
                //     err = new ERR_STREAM_ALREADY_FINISHED('end');
                // } else if ((state[kState] & kDestroyed) !== 0) {
                //     err = new ERR_STREAM_DESTROYED('end');
                // }
                // If writableStream is ended, it will throw an error.
                if (!writableStream.writableEnded) {
                    writableStream.end()
                }

                if (typeof this.callback === 'function') {
                    this.callback(error, response)
                }

                if (error) {
                    logError('clientService callback in GrpcWritableStreamBuilder', error)
                    this.backoffRetry.retry()
                }
            })
            writableStream.on('error', (error) => {
                logError('writable.on("error") in GrpcWritableStreamBuilder', error)
                // https://nodejs.org/api/stream.html#errors-while-writing
                // If a Readable stream pipes into a Writable stream when Writable emits an error, the Readable stream will be unpiped.
                this.backoffRetry.retry()
            })

            if (this.writableStream?.writableEnded === false) {
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

    on(event, listener) {
        this.writableStream.on(event, listener)
    }

    end() {
        this.ended = true
        if (!this.writableStream.writableEnded) {
            this.writableStream.end()
        }
        this.backoffRetry.stop()
    }

    get writableEnded() {
        return this.writableStream?.writableEnded === true
    }

    availableRetry() {
        return this.backoffRetry.availableRetry()
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

    build(writableReturnCallback) {
        const writableStream = new GrpcWritableStream(this.makeWritableStream)
        writableStream.deadlineOptionsBuilder = this.deadlineOptionsBuilder
        writableStream.callback = this.callback
        writableStream.writableReturnCallback = writableReturnCallback
        writableStream.connect()
        return writableStream
    }
}

module.exports = GrpcWritableStreamBuilder