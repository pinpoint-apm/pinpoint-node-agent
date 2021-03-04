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
    
    write(data, rewriteAfterStreamEnd = true) {
        try {            
            if (!this.stream || this.stream[ended]) {
                this.stream = this.connectStream()
            }
            this.stream.write(data)
        } catch (error) {
            if (error) {
                log.error(`grpc-stream.js write error: ${error}`)
            }
            this.end()
            if (rewriteAfterStreamEnd) {
                this.write(data, false)
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