/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const log = require('../utils/logger')
const writableHighWaterMarkedSymbol = Symbol('writableHighWaterMark')

class GrpcStream {
    constructor(name, makeStream) {
        this.name = name
        this.connectStream = makeStream
        this.stream = this.connectStream()
    }

    get writableHighWaterMarked() {
        return this.stream[writableHighWaterMarkedSymbol]
    }

    get writable() {
        return this.stream.writable
    }

    get ended() {
        return this.stream.writableEnded === true
    }

    write(data) {
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
                    log.error(`grpc-stream.js write error in write method's callback: `, error)
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
                log.error(`grpc-stream.js write error: `, error)
            }
        }
    }

    end() {
        this.endWithStream(this.stream)
    }

    endWithStream(stream) {
        try {
            if (this.ended === false) {
                stream.end()
            }
        } catch (error) {
            if (error) {
                log.error(`grpc-stream.js end error: `, error)
            }
        }
    }
}

module.exports = GrpcStream