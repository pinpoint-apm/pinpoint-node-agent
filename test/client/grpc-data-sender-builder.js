/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { DataSourceCallCountable } = require('./grpc-fixture')
const agent = require('../support/agent-singleton-mock')

class GrpcDataSenderBuilder {
    constructor(port) {
        this.port = port
        this.config = agent.config
        this.agentInfo = agent.getAgentInfo()
        this.enableMethods = {
            sendAgentInfo: false,
            sendApiMetaInfo: false,
            sendStringMetaInfo: false,
            sendSqlMetaInfo: false,
            sendSqlUidMetaData: false,
            sendExceptionMetaData: false,
            sendSpan: false,
            sendSpanChunk: false,
            sendStat: false,
            sendSupportedServicesCommand: false,
            sendPing: false,
            agentInfoScheduler: false,
        }
    }

    enableApiMetaInfo() {
        this.enableMethods.sendApiMetaInfo = true
        return this
    }

    enableStringMetaInfo() {
        this.enableMethods.sendStringMetaInfo = true
        return this
    }

    enableSqlMetaInfo() {
        this.enableMethods.sendSqlMetaInfo = true
        return this
    }

    enableSqlUidMetaData() {
        this.enableMethods.sendSqlUidMetaData = true
        return this
    }

    enableExceptionMetaData() {
        this.enableMethods.sendExceptionMetaData = true
        return this
    }

    enableSpan() {
        this.enableMethods.sendSpan = true
        return this
    }

    enableSpanChunk() {
        this.enableMethods.sendSpanChunk = true
        return this
    }

    enableStat() {
        this.enableMethods.sendStat = true
        return this
    }

    enableSupportedServicesCommand() {
        this.enableMethods.sendSupportedServicesCommand = true
        return this
    }

    enablePing() {
        this.enableMethods.sendPing = true
        return this
    }

    enableAgentInfoScheduler() {
        this.enableMethods.agentInfoScheduler = true
        return this
    }

    build() {
        const config = Object.assign({}, this.enableMethods, this.config)
        return new DataSourceCallCountable('localhost', this.port, this.port, this.port, this.agentInfo, config)
    }
}

module.exports = GrpcDataSenderBuilder