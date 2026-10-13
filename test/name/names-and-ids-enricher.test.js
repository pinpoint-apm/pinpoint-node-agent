/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const grpc = require('@grpc/grpc-js')
const services = require('../../lib/data/v1/Service_grpc_pb')
const spanMessages = require('../../lib/data/v1/Span_pb')
const { ConfigBuilder } = require('../../lib/config-builder')
const AgentInfo = require('../../lib/data/dto/agent-info')
const { AgentBuilder } = require('../../lib/agent-builder')
const ApiMetaInfo = require('../../lib/data/dto/api-meta-info')
const MethodType = require('../../lib/constant/method-type')
const { ProtocolVersionConfigBuilder } = require('../../lib/name/protocol-version-config-builder')
const { NamesAndIdsEnricher } = require('../../lib/name/names-and-ids-enricher')

let port

test('AgentBuilder with NamesAndIdsEnricher sends protocol.version per collector.protocolVersion', async (t) => {
    t.plan(4)
    const received = []
    const collector = await startCollector(received)
    port = collector.port
    t.teardown(() => collector.server.forceShutdown())

    await sendApiMetaInfo(agent('v3'))
    await sendApiMetaInfo(agent('v4'))
    await sendApiMetaInfo(agent())

    t.deepEqual(received[0].get('protocol.version'), ['100'], 'v3 sends protocol.version 100')
    t.deepEqual(received[1].get('protocol.version'), ['400'], 'v4 sends protocol.version 400')
    t.deepEqual(received[2].get('protocol.version'), ['400'], 'default protocol version sends protocol.version 400')
    t.equal(received[1].get('agentid')[0], 'agentId', 'agent information metadata is kept')
})

function startCollector(received) {
    const server = new grpc.Server()
    server.addService(services.MetadataService, {
        requestApiMetaData: (call, callback) => {
            received.push(call.metadata)
            const result = new spanMessages.PResult()
            result.setSuccess(true)
            callback(null, result)
        }
    })
    return new Promise((resolve, reject) => {
        server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
            error ? reject(error) : resolve({ server, port })
        })
    })
}

function agent(protocolVersion) {
    const json = {
        agentId: 'agentId',
        applicationName: 'appName',
        collector: { ip: 'localhost', spanPort: port, statPort: port, tcpPort: port, protocolVersion },
        features: { dataSending: true },
    }
    const config = new ConfigBuilder(json).setUserDefinedJson({}).build()
    return new AgentBuilder(AgentInfo.make(config))
        .setConfig(config)
        .disablePingScheduler()
        .disableStatsScheduler()
        .disableServiceCommand()
        .addEnricher(new NamesAndIdsEnricher(new ProtocolVersionConfigBuilder(config).build()))
        .build()
}

function sendApiMetaInfo(agent) {
    return new Promise((resolve, reject) => {
        agent.dataSender.dataSender.sendApiMetaInfo(new ApiMetaInfo(1, 'ApiDescriptor', MethodType.DEFAULT), (err) => {
            agent.dataSender.dataSender.close()
            err ? reject(err) : resolve()
        })
    })
}
