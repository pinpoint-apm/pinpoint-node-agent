/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const log = require('../utils/logger')
const GrpcStream = require('./grpc-stream')

const DEFAULT_CLIENT_REQUEST_TIMEOUT = 10 * 60 * 1000

class GrpcClientSideStream {
    constructor(name, client, newStream) {
        this.grpcStream = new GrpcStream(name, () => {
            this.deadline = Date.now()

            const self = this
            const stream = newStream.call(client, (err, response) => {
                if (response) {
                    if (log.isDebug()) {
                        log.debug(`GrpcClientSideStream Server side stream data. ${name} on(data): ${response}`)
                    }
                } else if (err) {
                    if (log.isDebug()) {
                        log.debug(`GrpcClientSideStream callback err: ${err}`)
                    }
                }

                this.grpcStream.endWithStream(stream)

                if (self.callback && typeof self.callback === 'function') {
                    self.callback(err, response)
                }
            })
            stream.on('error', (e) => {
                if (log.isDebug() && e && name) {
                    log.debug(`GrpcClientSideStream stream on error. ${name} on(error): ${e}`)
                }
            })
            stream.on('status', (status) => {
                if (log.isDebug() && status && name) {
                    log.debug(`GrpcClientSideStream stream data. ${name} on(status): ${status}`)
                }
            })
            return stream
        })
    }

    write(data) {
        this.grpcStream.write(data)

        const now = Date.now()
        if (now - this.deadline > this.grpcStreamDeadline) {
            this.grpcStream.end()
        }
    }

    get grpcStreamDeadline() {
        return this.deadlineOfConfig || DEFAULT_CLIENT_REQUEST_TIMEOUT
    }

    setDeadlineMinutes(deadline) {
        if (typeof deadline === 'number') {
            this.deadlineOfConfig = deadline * 60 * 1000
        }
    }
}

module.exports = GrpcClientSideStream