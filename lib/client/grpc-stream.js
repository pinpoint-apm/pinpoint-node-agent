/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const log = require('../utils/logger')

class GrpcStream {
    constructor(name, makeStream) {
        this.name = name
        this.connectStream = makeStream
        this.stream = this.connectStream()
        this.makeStream = makeStream
    }

    newStream() {
        const stream = this.makeStream()
        this.write = (data, rewriteAfterStreamEnd = true) => {
            try {            
                stream.write(data)
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
        this.end = () => {
            try {
                stream.end()
            } catch (error) {
                if (error) {
                    log.error(`grpc-stream.js end error: ${error}`)
                }
            }
        }
    }
    
    write(data, rewriteAfterStreamEnd = true) {
        try {            
            if (!this.stream) {
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
        try {
            if (this.stream) {
                this.stream.end()
            }
        } catch (error) {
            if (error) {
                log.error(`grpc-stream.js end error: ${error}`)
            }
        }
        this.stream = null
    }

    isLiveStream() {
        return this.stream
    }
}

module.exports = GrpcStream