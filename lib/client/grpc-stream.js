/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const log = require('../utils/logger')
const ended = Symbol('ended')

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
            return this.stream[ended]
        }

        return this.stream.writable
    }

    get writableEnded() {
        if (!this.stream) {
            return false
        }

        if (typeof this.stream.writableEnded !== 'boolean') {
            return this.stream[ended]
        }

        return this.stream.writableEnded
    }

    write(data, rewriteAfterStreamEnd = true) {
        try {
            if (!this.writable) {
                this.stream = this.connectStream()
            }
            this.stream.write(data, (error) => {
                if (error) {
                    this.end()
                    if (rewriteAfterStreamEnd) {
                        this.write(data, false)
                    }
                    log.error(`grpc-stream.js write error in write's callback: ${error}`)
                }
            })
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