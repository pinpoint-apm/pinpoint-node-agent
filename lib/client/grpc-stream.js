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
    constructor(name, client, newStream) {
        this.newStream = newStream
        this.client = client
        this.name = name

        this.connectStream()
    }
    
    // Template method pattern
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

            // https://www.grpc.io/docs/languages/node/basics/
            // call.on('end', function() {
            //     call.end();
            // });
            if (this.stream) {
                this.end()
                log.debug(`GrpcStream Server side stream ended. But the client stream is active. ${this.name} on(end)`)
            }
        })
        this.stream.on('error', (e) => {
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
        try {            
            if (!this.stream) {
                this.connectStream()
            }
            this.stream.write(data)
        } catch (error) {
            if (error) {
                log.error(`grpc-stream.js write error: ${error}`)
            }
            this.end()
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
}

module.exports = GrpcStream