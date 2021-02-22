/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const log = require('../utils/logger')
const GrpcStream = require('./grpc-stream')

class GrpcBidirectionalStream extends GrpcStream {
    // Template method pattern
    connectStream() {
        this.stream = this.newStream.call(this.client)
        this.stream.on('data', (data) => {
            if (log.isDebug()) {
                log.debug(`GrpcBidirectionalStream Server side stream data. ${this.name} on(data): ${data}`)
            }
        })
        this.stream.on('end', () => {
            if (log.isDebug()) {
                log.debug(`GrpcBidirectionalStream Server side stream ended. ${this.name} on(end)`)
            }

            // https://www.grpc.io/docs/languages/node/basics/
            if (this.stream) {
                this.end()
                log.debug(`GrpcBidirectionalStream Server side stream ended. But the client stream is active. ${this.name} on(end)`)
            }
        })
        this.stream.on('error', (e) => {
            if (log.isDebug() && e) {
                log.debug(`GrpcBidirectionalStream Server side stream on error. ${this.name} on(error): ${JSON.stringify(e)}`)
            }
        })
        this.stream.on('status', (status) => {
            if (log.isDebug()) {
                log.debug(`GrpcBidirectionalStream Server side stream data. ${this.name} on(status): ${JSON.stringify(status)}`)
            }
        })
    }
}

module.exports = GrpcBidirectionalStream
