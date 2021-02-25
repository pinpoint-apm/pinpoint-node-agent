/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const log = require('../utils/logger')

// DEFAULT_CLIENT_REQUEST_TIMEOUT in GrpcTransportConfig.java
const DEFAULT_CLIENT_REQUEST_TIMEOUT = 6000

class GrpcStream {
    constructor(name, client, newStream, connectStream) {
        this.newStream = newStream
        this.client = client
        this.name = name
        this.connectStream = connectStream
        this.stream = this.connectStream()
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