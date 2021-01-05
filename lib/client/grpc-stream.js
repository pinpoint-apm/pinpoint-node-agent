/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const log = require('../utils/logger')

class GrpcStream {
    constructor(name, newStream) {
        this.newStream = newStream
        this.name = name

        this.connectStream()
    }

    connectStream() {
        this.stream = this.newStream()
        this.stream.on('data', (data) => {
            if (log.isDebug()) {
                log.debug(`GrpcStream Server side stream data. ${this.name} on(data): ${data}`)
            }
        })
        this.stream.on('end', () => {
            if (log.isDebug()) {
                log.debug(`GrpcStream Server side stream ended. ${this.name} on(end)`)
            }

            if (this.stream) {
                this.end()
                log.debug(`GrpcStream Server side stream ended. But the client stream is active. ${this.name} on(end)`)
            }
        })
        this.stream.on('error', (e) => {
            if (e && this.stream) {
                this.end()
            }
            if (log.isDebug() && e) {
                log.debug(`GrpcStream Server side stream on error. ${this.name} on(error): ${JSON.stringify(e)}`)
            }
        })
        this.stream.on('status', (status) => {
            if (log.isDebug()) {
                log.debug(`GrpcStream Server side stream data. ${this.name} on(status): ${JSON.stringify(status)}`)
            }
        })
    }

    write(data) {
        if (!this.stream) {
            this.connectStream()
        }
        this.stream.write(data)
    }

    end() {
        if (this.stream) {
            this.stream.end()
        }
        this.stream = null
    }
}

module.exports = GrpcStream