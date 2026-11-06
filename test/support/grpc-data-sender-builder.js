/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { DataSourceCallCountable } = require('./grpc-data-sources')
const agent = require('./agent-singleton-mock')
const { ClientHeader, makeClientHeaderInterceptor } = require('../../lib/name/client-header')

class GrpcDataSenderBuilder {
    constructor(port) {
        this.port = port
        this.config = agent.getConfig()
        this.interceptors = [makeClientHeaderInterceptor(ClientHeader.make(agent.agentStartTime, agent.getConfig()))]
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

    build() {
        const collector = Object.assign({}, this.config.collector, { ip: 'localhost', spanPort: this.port, statPort: this.port, tcpPort: this.port, spanBatch: { deadlineMillis: 10 } })
        const config = Object.assign({}, this.enableMethods, this.config, { collector })
        return new DataSourceCallCountable(config, this.interceptors)
    }
}

module.exports = GrpcDataSenderBuilder