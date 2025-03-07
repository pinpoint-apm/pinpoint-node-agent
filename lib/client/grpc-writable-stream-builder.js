/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { logError } = require('./grpc-errors')

class GrpcWritableStreamBuilder {
    constructor(makeWritableStream) {
        this.makeWritableStream = makeWritableStream
        this.maxAttempts = 3
        this.initialBackoff = 1000
        this.backoffMultiplier = 2
        this.maxBackoff = 10000
        this.nextRetryBackoffMilliSeconds = this.initialBackoff
        this.attempts = 0
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
        this.writableReturnCallback = writableReturnCallback
        this.connect()
    }

    connect() {
        try {
            const options = this.deadlineOptionsBuilder?.build() ?? {}
            const writableStream = this.makeWritableStream(options, (error, response) => {
                writableStream.end()

                if (error) {
                    logError('writableStream.on("error") in GrpcWritableStreamBuilder', error)
                    this.retryConnect()
                }

                if (typeof this.callback === 'function') {
                    this.callback(error, response)
                }
            })
            writableStream.on('error', (error) => {
                logError('writable.on("error") in GrpcWritableStreamBuilder', error)
                // https://nodejs.org/api/stream.html#errors-while-writing
                // If a Readable stream pipes into a Writable stream when Writable emits an error, the Readable stream will be unpiped.
                this.retryConnect()
            })

            if (typeof this.writableReturnCallback === 'function') {
                this.writableReturnCallback(writableStream)
            }
            return writableStream
        } catch (error) {
            logError('try catch error in GrpcWritableStreamBuilder', error)
        }
    }

    retryConnect() {
        this.attempts += 1
        if (this.attempts > this.maxAttempts) {
            return
        }
        const retryDelayMilliSeconds = this.nextRetryBackoffMilliSeconds
        this.nextRetryBackoffMilliSeconds = Math.min(this.nextRetryBackoffMilliSeconds * this.backoffMultiplier, this.maxBackoff)

        setTimeout(() => {
            this.connect()
        }, retryDelayMilliSeconds)
    }
}

module.exports = GrpcWritableStreamBuilder