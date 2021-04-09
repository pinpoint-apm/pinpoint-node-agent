/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const log = require('../utils/logger')
const ended = Symbol('ended')
const writableHighWaterMarkedSymbol = Symbol('writableHighWaterMark')

class GrpcStream {
    constructor(name, makeStream) {
        this.name = name
        this.connectStream = makeStream
        this.stream = this.connectStream()
    }

    get writable() {
        if (!this.stream) {
            return false
        }

        if (typeof this.stream.writable !== 'boolean') {
            return !this.streamEnded
        }

        return this.stream.writable
    }

    get streamEnded() {
        return !this.stream || this.streamEndedSymbol
    }

    get streamEndedSymbol() {
        if (!this.stream) {
            return undefined
        }
        return this.stream[ended]
    }

    get writableHighWaterMarked() {
        if (!this.stream) {
            return undefined
        }
        return this.stream[writableHighWaterMarkedSymbol]
    }

    write(data, rewriteAfterStreamEnd = true) {
        try {
            if (this.writableHighWaterMarked) {
                return
            }

            if (!this.writable) {
                this.end()
                this.stream = this.connectStream()
            }

            const stream = this.stream
            const result = stream.write(data, (error) => {
                if (error) {
                    this.endWithStream(stream)
                    if (rewriteAfterStreamEnd) {
                        this.write(data, false)
                    }
                    log.error(`grpc-stream.js write error in write method's callback: ${error}`)
                }
            })
            if (!result) {
                stream[writableHighWaterMarkedSymbol] = true
                stream.once('drain', () => {
                    stream[writableHighWaterMarkedSymbol] = false
                })
            }
        } catch (error) {
            if (error) {
                log.error(`grpc-stream.js write error: ${error}`)
            }
        }
    }

    end() {
        this.endWithStream(this.stream)
        this.stream = null
    }

    endWithStream(stream) {
        try {
            if (stream) {
                stream.end()
                stream[ended] = true
            }
        } catch (error) {
            if (error) {
                log.error(`grpc-stream.js end error: ${error}`)
            }
        }
    }
}

module.exports = GrpcStream