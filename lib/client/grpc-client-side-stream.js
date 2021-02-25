/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const log = require('../utils/logger')
const GrpcStream = require('./grpc-stream')

class GrpcClientSideStream {
    constructor(name, client, newStream) {
        this.grpcStream = new GrpcStream(name, client, newStream, () => {
            const stream = newStream.call(client, (err, response) => {
                this.callback(err, response)
            })
            stream.on('status', (status) => {
                if (log.isDebug() && status) {
                    log.debug(`GrpcClientSideStream Server side stream data. ${name} on(status): ${JSON.stringify(status)}`)
                }
            })
            return stream
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

    write(data) {
        this.grpcStream.write(data)
    }

    end() {
        this.grpcStream.end()
    }
}

module.exports = GrpcClientSideStream