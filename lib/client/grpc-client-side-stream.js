/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const log = require('../utils/logger')
const GrpcStream = require('./grpc-stream')

class GrpcClientSideStream extends GrpcStream {
    // Template method pattern
    connectStream() {
        this.stream = this.newStream.call(this.client, (err, response) => {
            this.callback(err, response)
        })
        this.stream.on('data', (data) => {
            if (log.isDebug()) {
                log.debug(`GrpcClientSideStream Server side stream data. ${this.name} on(data): ${data}`)
            }
        })
        this.stream.on('end', () => {
            if (log.isDebug()) {
                log.debug(`GrpcClientSideStream Server side stream ended. ${this.name} on(end)`)
            }

            // https://www.grpc.io/docs/languages/node/basics/
            // call.on('end', function() {
            //     call.end();
            // });
            if (this.stream) {
                this.end()
                log.debug(`GrpcClientSideStream Server side stream ended. But the client stream is active. ${this.name} on(end)`)
            }
        })
        this.stream.on('error', (e) => {
            if (log.isDebug() && e) {
                log.debug(`GrpcClientSideStream Server side stream on error. ${this.name} on(error): ${JSON.stringify(e)}`)
            }
        })
        this.stream.on('status', (status) => {
            if (log.isDebug()) {
                log.debug(`GrpcClientSideStream Server side stream data. ${this.name} on(status): ${JSON.stringify(status)}`)
            }
        })
    }

    callback(err, data) {
        if (data) {
            if (log.isDebug()) {
                log.debug(`GrpcClientSideStream Server side stream data. ${this.name} on(data): ${data}`)
            }
        } else if (err) {
            if (log.isDebug()) {
                log.debug(`GrpcClientSideStream callback err: ${err}`)
            }
        }
    }
}

module.exports = GrpcClientSideStream