/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const config = require('../../lib/config')
const AgentInfo = require('../../lib/data/dto/agent-info')
const GrpcDataSender = require('../../lib/client/grpc-data-sender')
const SpanBuilder = require('../../lib/instrumentation/context/span-builder')

let callCount = 0
let afterCount = 0
let callRequests = []
let callMetadata = []

function beforeSpecificOne(port, one, serviceConfig) {
    callCount = 0
    afterCount = 0
    config.clear()
    callRequests = []
    callMetadata = []
    const actualConfig = config.getConfig({ 'grpc.service_config': serviceConfig })
    actualConfig.collectorIp = 'localhost'
    actualConfig.collectorTcpPort = port
    actualConfig.collectorStatPort = port
    actualConfig.collectorSpanPort = port
    actualConfig.enabledDataSending = true
    return new one(
        actualConfig.collectorIp,
        actualConfig.collectorTcpPort,
        actualConfig.collectorStatPort,
        actualConfig.collectorSpanPort,
        agentInfo(),
        actualConfig
    )
}

function agentInfo() {
    return Object.assign(new AgentInfo({
        agentId: '12121212',
        applicationName: 'applicationName',
        agentStartTime: Date.now()
    }), {
        ip: '1'
    })
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
        super(collectorIp, collectorTcpPort, collectorStatPort, collectorSpanPort, agentInfo, config)
    }

    sendAgentInfo(agentInfo, callArguments) {
        increaseCallCount()
        super.sendAgentInfo(agentInfo, callArguments)
    }

    sendApiMetaInfo(apiMetaInfo, callArguments) {
        increaseCallCount()
        super.sendApiMetaInfo(apiMetaInfo, callArguments)
    }

    sendStringMetaInfo(stringMetaInfo, callArguments) {
        increaseCallCount()
        super.sendStringMetaInfo(stringMetaInfo, callArguments)
    }

    sendSqlMetaInfo(sqlMetaData, callback) {
        increaseCallCount()
        super.sendSqlMetaInfo(sqlMetaData, callback)
    }

    sendSqlUidMetaData(sqlMetaData, callback) {
        increaseCallCount()
        super.sendSqlUidMetaData(sqlMetaData, callback)
    }

    sendSpan(span) {
        increaseCallCount()
        super.sendSpan(span)
    }

    sendSupportedServicesCommand(callArguments) {
        increaseCallCount()
        super.sendSupportedServicesCommand(callArguments)
    }
}

function spanWithId(spanId) {
    return SpanBuilder.makeWithSpanId(spanId, agentInfo()).build()
}

function spanMessageWithId(spanId) {
    return spanWithId(spanId).spanMessage
}

module.exports = {
    beforeSpecificOne,
    afterOne,
    getCallRequests,
    getMetadata,
    DataSourceCallCountable,
    spanWithId,
    spanMessageWithId,
}