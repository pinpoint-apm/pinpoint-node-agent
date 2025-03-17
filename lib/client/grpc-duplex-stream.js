/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const GrpcStream = require('./grpc-stream')

class GrpcDuplexStream extends GrpcStream {
    constructor(name, makeStream) {
        super(name, makeStream)
    }

    get writable() {
        return this.stream.writable === true && this.stream.readable === true
    }

    get ended() {
        return this.stream.writableEnded === true && this.stream.readableEnded === true
    }
}

module.exports = GrpcDuplexStream