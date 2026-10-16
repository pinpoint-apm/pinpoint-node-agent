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
const { AgentBuilder } = require('../../lib/agent-builder')
const ApiMetaInfo = require('../../lib/data/dto/api-meta-info')
const MethodType = require('../../lib/constant/method-type')

let port

test('protocol.version header follows collector.protocolVersion', async (t) => {
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
    t.end()
})

test('v4 sends a generated agentid, servicename and agentname', async (t) => {
    const received = []
    const collector = await startCollector(received)
    port = collector.port
    t.teardown(() => collector.server.forceShutdown())

    const v4Agent = agent('v4')
    await sendApiMetaInfo(v4Agent)
    await sendApiMetaInfo(agent('v4', 'agentName'))

    const generatedAgentId = v4Agent.getConfig().getAgentId()
    t.notEqual(generatedAgentId, 'agentId', 'v4 ignores the configured agentId')
    t.deepEqual(received[0].get('agentid'), [generatedAgentId], 'v4 sends the generated agentId')
    t.deepEqual(received[0].get('servicename'), ['serviceName'], 'v4 sends servicename')
    t.deepEqual(received[0].get('agentname'), [generatedAgentId], 'v4 without agentName sends agentId as agentname')
    t.deepEqual(received[1].get('agentname'), ['agentName'], 'v4 with agentName sends agentName')
    t.deepEqual(received[0].get('starttime'), [v4Agent.agentStartTime], 'starttime is the Agent agentStartTime')
    t.end()
})

test('v3 sends the configured agentid and no servicename', async (t) => {
    const received = []
    const collector = await startCollector(received)
    port = collector.port
    t.teardown(() => collector.server.forceShutdown())

    await sendApiMetaInfo(agent('v3'))

    t.deepEqual(received[0].get('agentid'), ['agentId'], 'v3 sends the configured agentId')
    t.deepEqual(received[0].get('servicename'), [], 'v3 does not send servicename even if serviceName is set')
    t.deepEqual(received[0].get('agentname'), ['agentId'], 'v3 without agentName sends agentId as agentname')
    t.end()
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

function agent(protocolVersion, agentName) {
    const json = {
        agentId: 'agentId',
        agentName,
        applicationName: 'appName',
        serviceName: 'serviceName',
        collector: { ip: 'localhost', spanPort: port, statPort: port, tcpPort: port, protocolVersion },
        features: { dataSending: true },
    }
    const config = new ConfigBuilder(json).setUserDefinedJson({}).build()
    return new AgentBuilder(config)
        .disablePingScheduler()
        .disableStatsScheduler()
        .disableServiceCommand()
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
