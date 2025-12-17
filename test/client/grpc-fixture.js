/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const agent = require('../support/agent-singleton-mock')
const { clear, getConfig } = require('../../lib/config')
const GrpcDataSender = require('../../lib/client/grpc-data-sender')
const SpanBuilder = require('../../lib/context/span-builder')
const RemoteTraceRootBuilder = require('../../lib/context/remote-trace-root-builder')
const { ConfigBuilder } = require('../../lib/config-builder')

let callCount = 0
let afterCount = 0
let callRequests = []
let callMetadata = []

function beforeSpecificOne(port, one, serviceConfig) {
    callCount = 0
    afterCount = 0
    clear()
    callRequests = []
    callMetadata = []
    let actualConfig = new ConfigBuilder({
        'collector': {
            'ip': '127.0.0.1',
            'spanPort': port,
            'statPort': port,
            'tcpPort': port,
            'grpcServiceConfig': serviceConfig,
        },
        'features': {
            'dataSending': true,
        }
    }).build()
    const collector = actualConfig.getCollector()
    return new one(
        collector.ip,
        collector.tcpPort,
        collector.statPort,
        collector.spanPort,
        agentInfo(),
        actualConfig
    )
}

function agentInfo() {
    return agent.getAgentInfo()
}

function afterOne(t) {
    afterCount++
    if (callCount === afterCount) {
        t.end()
    }
}

function getCallRequests() {
    return callRequests
}

function getMetadata() {
    return callMetadata
}

function increaseCallCount() {
    callCount++
}

class DataSourceCallCountable extends GrpcDataSender {
    constructor(collectorIp, collectorTcpPort, collectorStatPort, collectorSpanPort, agentInfo, config) {
        config = Object.assign({}, {
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
        }, config)
        config = new ConfigBuilder(config).build()
        super(collectorIp, collectorTcpPort, collectorStatPort, collectorSpanPort, agentInfo, config)
    }

    initializeClients() {
        if (this.config.sendAgentInfo || this.config.sendPing) {
            super.initializeClients()
        }
    }

    initializeMetadataClients() {
        if (this.config.sendApiMetaInfo || this.config.sendStringMetaInfo || this.config.sendSqlMetaInfo || this.config.sendSqlUidMetaData || this.config.sendExceptionMetaData) {
            super.initializeMetadataClients()
        }
    }

    initializePingStream() {
        if (this.config.sendPing) {
            super.initializePingStream()
        }
    }

    initializeAgentInfoScheduler() {
        if (this.config.agentInfoScheduler) {
            super.initializeAgentInfoScheduler()
        }
    }

    initializeProfilerClients(collectorIp, collectorTcpPort, config) {
        if (this.config.sendSupportedServicesCommand) {
            super.initializeProfilerClients(collectorIp, collectorTcpPort, config)
        }
    }

    initializeSpanStream(collectorIp, collectorSpanPort, config) {
        if (this.config.sendSpan || this.config.sendSpanChunk) {
            super.initializeSpanStream(collectorIp, collectorSpanPort, config)
        }
    }

    initializeStatStream(collectorIp, collectorStatPort, config) {
        if (this.config.sendStat) {
            super.initializeStatStream(collectorIp, collectorStatPort, config)
        }
    }

    sendAgentInfo(agentInfo, callArguments) {
        increaseCallCount()
        if (this.config.sendAgentInfo) {
            super.sendAgentInfo(agentInfo, callArguments)
        }
    }

    sendApiMetaInfo(apiMetaInfo, callArguments) {
        increaseCallCount()
        if (this.config.sendApiMetaInfo) {
            super.sendApiMetaInfo(apiMetaInfo, callArguments)
        }
    }

    sendStringMetaInfo(stringMetaInfo, callArguments) {
        increaseCallCount()
        if (this.config.sendStringMetaInfo) {
            super.sendStringMetaInfo(stringMetaInfo, callArguments)
        }
    }

    sendSqlMetaInfo(sqlMetaData, callback) {
        increaseCallCount()
        if (this.config.sendSqlMetaInfo) {
            super.sendSqlMetaInfo(sqlMetaData, callback)
        }
    }

    sendSqlUidMetaData(sqlMetaData, callback) {
        increaseCallCount()
        if (this.config.sendSqlUidMetaData) {
            super.sendSqlUidMetaData(sqlMetaData, callback)
        }
    }

    sendExceptionMetaData(exceptionMetaData) {
        increaseCallCount()
        if (this.config.sendExceptionMetaData) {
            super.sendExceptionMetaData(exceptionMetaData)
        }
    }

    sendSpan(span) {
        increaseCallCount()
        if (this.config.sendSpan) {
            super.sendSpan(span)
        }
    }

    sendSpanChunk(spanChunk) {
        increaseCallCount()
        if (this.config.sendSpanChunk) {
            super.sendSpanChunk(spanChunk)
        }
    }

    sendStat(stat) {
        increaseCallCount()
        if (this.config.sendStat) {
            super.sendStat(stat)
        }
    }

    sendPing() {
        increaseCallCount()
        if (this.config.sendPing) {
            super.sendPing()
        }
    }

    sendSupportedServicesCommand(callback) {
        increaseCallCount()
        if (this.config.sendSupportedServicesCommand) {
            super.sendSupportedServicesCommand(callback)
        }
    }
}

function spanWithId(transactionId) {
    return new SpanBuilder(new RemoteTraceRootBuilder(agentInfo(), transactionId).build()).build()
}

function spanMessageWithId(spanId) {
    return spanWithId(spanId).toProtocolBuffer()
}

class ProfilerDataSource extends DataSourceCallCountable {
    constructor(collectorIp, collectorTcpPort, collectorStatPort, collectorSpanPort, agentInfo, config) {
        config = Object.assign({}, config, {
            sendSupportedServicesCommand: true,
        })
        config = new ConfigBuilder(config).build()
        super(collectorIp, collectorTcpPort, collectorStatPort, collectorSpanPort, agentInfo, config)
    }
}

class SpanOnlyFunctionalTestableDataSource extends DataSourceCallCountable {
    constructor(collectorIp, collectorTcpPort, collectorStatPort, collectorSpanPort, agentInfo, config) {
        config = Object.assign({}, config, {
                sendSpan: true,
                sendSpanChunk: true,
            })
        config = new ConfigBuilder(config).build()
        super(collectorIp, collectorTcpPort, collectorStatPort, collectorSpanPort, agentInfo, config)
    }
}

class StatOnlyFunctionalTestableDataSource extends DataSourceCallCountable {
    constructor(collectorIp, collectorTcpPort, collectorStatPort, collectorSpanPort, agentInfo, config) {
        config = Object.assign({}, config, {
            sendStat: true,
        })
        config = new ConfigBuilder(config).build()
        super(collectorIp, collectorTcpPort, collectorStatPort, collectorSpanPort, agentInfo, config)
    }
}

class MetaInfoOnlyDataSource extends DataSourceCallCountable {
    constructor(collectorIp, collectorTcpPort, collectorStatPort, collectorSpanPort, agentInfo, config) {
        config = Object.assign({}, config, {
            sendApiMetaInfo: true,
            sendStringMetaInfo: true,
            sendSqlMetaInfo: true,
            sendSqlUidMetaData: true,
            sendExceptionMetaData: true,
        })
        config = new ConfigBuilder(config).build()
        super(collectorIp, collectorTcpPort, collectorStatPort, collectorSpanPort, agentInfo, config)
    }
}

module.exports = {
    beforeSpecificOne,
    afterOne,
    getCallRequests,
    getMetadata,
    DataSourceCallCountable,
    ProfilerDataSource,
    SpanOnlyFunctionalTestableDataSource,
    spanWithId,
    spanMessageWithId,
    StatOnlyFunctionalTestableDataSource,
    MetaInfoOnlyDataSource,
}