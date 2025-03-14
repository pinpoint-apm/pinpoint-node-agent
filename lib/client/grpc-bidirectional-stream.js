/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const log = require('../utils/logger')
const GrpcStream = require('./grpc-stream')

const defaultDeadline = 60 * 60 * 1000
class GrpcBidirectionalStream {
    constructor(name, client, newStream) {
        this.grpcStream = new GrpcStream(name, () => {
            this.deadline = Date.now()

            const stream = newStream.call(client)
            stream.on('data', (data) => {
                if (log.isDebug() && name && data) {
                    log.debug(`GrpcBidirectionalStream stream data. ${name} on(data): ${data}`)
                }
            })
            stream.on('end', () => {
                if (log.isDebug() && name) {
                    log.debug(`GrpcBidirectionalStream side stream ended. ${name} on(end)`)
                }
            })
            stream.on('error', (e) => {
                if (log.isDebug() && e && name) {
                    log.debug(`GrpcBidirectionalStream stream on error. ${name} on(error): `, e)
                }
            })
            stream.on('status', (status) => {
                if (log.isDebug() && status && name) {
                    log.debug(`GrpcBidirectionalStream stream data. ${name} on(status): ${status}`)
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
        return this.deadlineOfConfig ?? defaultDeadline
    }

    setDeadlineMinutes(deadline) {
        if (typeof deadline === 'number') {
            this.deadlineOfConfig = deadline * 60 * 1000
        }
    }
}

module.exports = GrpcBidirectionalStream
