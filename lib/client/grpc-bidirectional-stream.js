/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const log = require('../utils/logger')
const GrpcDuplexStream = require('./grpc-duplex-stream')

class GrpcBidirectionalStream {
    constructor(name, client, newStream) {
        this.grpcStream = new GrpcDuplexStream(name, () => {
            const stream = newStream.call(client)
            stream.on('data', (data) => {
                if (log.isInfo() && name && data) {
                    log.info(`GrpcBidirectionalStream stream data. ${name} on(data): ${data}`)
                }
            })
            stream.on('end', () => {
                if (log.isInfo() && name) {
                    log.info(`GrpcBidirectionalStream side stream ended. ${name} on(end)`)
                }
                this.end()
            })
            stream.on('error', (e) => {
                log.error(`GrpcBidirectionalStream stream on error. ${name} on(error): `, e)
            })
            stream.on('status', (status) => {
                if (log.isInfo() && status && name) {
                    log.info(`GrpcBidirectionalStream stream data. ${name} on(status): ${status}`)
                }
            })
            return stream
        })
    }

    end() {
        if (!this.grpcStream.ended) {
            this.grpcStream.end()
        }
    }

    write(data) {
        this.grpcStream.write(data)
    }
}

module.exports = GrpcBidirectionalStream
