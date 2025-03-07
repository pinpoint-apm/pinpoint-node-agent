/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { Transform } = require('node:stream')
const GrpcWritableStreamBuilder = require('./grpc-writable-stream-builder')

// Java Agent queue size private static final int DEFAULT_AGENT_SENDER_EXECUTOR_QUEUE_SIZE = 1000;
class GrpcReadableStream {
    constructor(makeWritableStream) {
        this.writableStreamBuilder = new GrpcWritableStreamBuilder(makeWritableStream)
        this.makeWritableStream = makeWritableStream
        this.readableStream = this.makeReadableStream()
        this.pipeWritableStream()
    }

    makeReadableStream() {
        const readableStream = new Transform(Object.assign({
            readableObjectMode: true,
            highWaterMark: 100,
            transform(chunk, encoding, callback) {
                callback(null, chunk)
            },
            // https://nodejs.org/api/stream.html#readablepushchunk-encoding
            read: () => {
                this.readStart()
            }
        }, this.options ?? {}))

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

    readStart() {
        this.readable = true
    }

    push(data) {
        if (this.readable === false) {
            return
        }

        if (!this.readableStream.push(data)) {
            this.readStop()
        }
    }

    readStop() {
        this.readable = false
    }

    pipeWritableStream() {
        if (this.ended) {
            return
        }

        this.writableStreamBuilder.setDeadlineOptionsBuilder(this.deadlineOptionsBuilder)
            .setCallCallback((error, response) => {
                if (typeof this.callback === 'function') {
                    this.callback(error, response)
                }
            })
            .build((writableStream) => {
                this.readableStream.pipe(writableStream)
                this.writableStream = writableStream
            })
    }

    end() {
        this.ended = true
        // writableStream.end() is called by function onend() { dest.end() } in Readable.prototype.pipe()
        this.readableStream.end()
        this.writableStreamBuilder.end()
    }
}

class GrpcReadableStreamBuilder {
    constructor(serviceClient, method) {
        this.serviceClient = serviceClient
        this.method = method
    }

    setMaxAttempts(maxAttempts) {
        this.maxAttempts = maxAttempts
        return this
    }

    setInitialBackoff(initialBackoff) {
        this.initialBackoff = initialBackoff
        return
    }

    setDeadlineOptionsBuilder(deadlineOptionsBuilder) {
        this.deadlineOptionsBuilder = deadlineOptionsBuilder
        return this
    }

    setCallback(callback) {
        this.callback = callback
        return this
    }

    setErrorHandler(errorHandler) {
        this.errorHandler = errorHandler
        return this
    }

    setReadableStreamOptions(options) {
        this.options = options
        return this
    }

    build() {
        const serviceClientCall = this.serviceClient[this.method].bind(this.serviceClient)
        const stream = new GrpcReadableStream(serviceClientCall)

        if (this.maxAttempts) {
            stream.writableStreamBuilder.maxAttempts = this.maxAttempts
        }

        if (this.initialBackoff) {
            stream.writableStreamBuilder.initialBackoff = this.initialBackoff
        }

        stream.deadlineOptionsBuilder = this.deadlineOptionsBuilder
        stream.errorHandler = this.errorHandler

        if (this.callback) {
            stream.callback = this.callback
        }

        stream.options = this.options
        return stream
    }
}

module.exports = GrpcReadableStreamBuilder