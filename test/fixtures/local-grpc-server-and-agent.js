/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const grpc = require('@grpc/grpc-js')
const Agent = require('../../lib/agent')

class LocalGrpcServerAndAgent {
    constructor() {
        this.agent = null
        this.server = null
    }
    
    start() {
        this.server = new grpc.Server()

        const config = require('../pinpoint-config-test.json')
        this.agent = new Agent(config)
    }

    stop() {
        this.server.forceShutdown()
        this.agent.stop()
    }
}
module.exports = LocalGrpcServerAndAgent