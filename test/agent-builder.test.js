/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const path = require('path')
const { execFileSync } = require('child_process')
const grpc = require('@grpc/grpc-js')
const services = require('../lib/data/v1/Service_grpc_pb')
const { ConfigBuilder } = require('../lib/config-builder')
const { AgentBuilder } = require('../lib/agent-builder')

test('Agent is disabled when names and ids have errors', (t) => {
    const config = new ConfigBuilder({ applicationName: '~', serviceName: 'serviceName' }).setUserDefinedJson({}).build()
    const sentData = []
    const warnLogs = []

    const agent = new AgentBuilder(config)
        .setDataSender({ send: (data) => sentData.push(data), close: () => {} })
        .setLogger({ warn: (...args) => warnLogs.push(args) })
        .disablePingScheduler()
        .disableServiceCommand()
        .build()
    agent.start()

    t.equal(config.enable, false, 'names and ids errors disable the agent')
    t.deepEqual(sentData, [], 'AgentInfo is not sent')
    t.true(warnLogs[warnLogs.length - 1][0].endsWith('Disabled'), 'Disabled is logged')
    t.end()
})

test('Agent logs the Configuration with the names and ids warns at start', (t) => {
    const config = new ConfigBuilder({ enable: false, agentId: 'node.app', applicationName: 'appName', serviceName: 'serviceName' }).setUserDefinedJson({}).build()
    const warnLogs = []

    const agent = new AgentBuilder(config)
        .setDataSender({ send: () => {}, close: () => {} })
        .setLogger({ warn: (...args) => warnLogs.push(args) })
        .disablePingScheduler()
        .disableServiceCommand()
        .build()
    agent.start()

    t.deepEqual(warnLogs[0], ['[Pinpoint Agent] Configuration', config], 'the Configuration is logged first')
    t.deepEqual(config.messages.warns, ['Agent ID node.app is ignored; collector.protocolVersion v4 always generates the Agent ID. Set collector.protocolVersion to v3 to use a configured Agent ID.'], 'the Configuration has the ignored v4 agentId warn')
    t.end()
})

test('A disabled agent opens no ping session to the collector', async (t) => {
    const collector = await startCollectorRecordingPingSessions()
    t.teardown(() => collector.server.forceShutdown())

    const disabledAgent = new AgentBuilder(collectorConfig(collector.port, { enable: false, agentName: 'disabled-agent', serviceName: 'serviceName' }))
        .setLogger({ warn: () => {} })
        .build()
    disabledAgent.start()
    const enabledAgent = new AgentBuilder(collectorConfig(collector.port, { agentName: 'enabled-agent', serviceName: 'serviceName' })).build()
    await collector.firstPingSession
    enabledAgent.dataSender.close()

    t.deepEqual(collector.pingSessionAgentNames, ['enabled-agent'], 'only the enabled agent opens a ping session')
    t.end()
})

test('An agent disabled by a too short serviceName opens no ping session to the collector', async (t) => {
    const collector = await startCollectorRecordingPingSessions()
    t.teardown(() => collector.server.forceShutdown())

    const disabledAgent = new AgentBuilder(collectorConfig(collector.port, { agentName: 'short-service-agent', serviceName: 'ab' }))
        .setLogger({ warn: () => {} })
        .build()
    disabledAgent.start()
    const enabledAgent = new AgentBuilder(collectorConfig(collector.port, { agentName: 'enabled-agent', serviceName: 'serviceName' })).build()
    await collector.firstPingSession
    enabledAgent.dataSender.close()

    t.equal(disabledAgent.getConfig().enable, false, 'a too short serviceName disables the agent')
    t.deepEqual(collector.pingSessionAgentNames, ['enabled-agent'], 'only the enabled agent opens a ping session')
    t.end()
})

test('Agent shutdown stops the stats scheduler', (t) => {
    const timeouts = startAndShutdownAgentInChildProcess('stats')

    t.equal(timeouts.afterStart, timeouts.beforeStart + 1, 'start schedules the stats job')
    t.equal(timeouts.afterShutdown, timeouts.beforeStart, 'shutdown clears the stats job')
    t.end()
})

test('features.statsMonitoring false starts no stats scheduler', (t) => {
    const timeouts = startAndShutdownAgentInChildProcess('stats-monitoring-off')

    t.equal(timeouts.afterStart, timeouts.beforeStart, 'start schedules no stats job')
    t.end()
})

test('Agent shutdown stops the ping scheduler', (t) => {
    const timeouts = startAndShutdownAgentInChildProcess('ping')

    t.equal(timeouts.afterStart, timeouts.beforeStart + 1, 'start schedules the ping job')
    t.equal(timeouts.afterShutdown, timeouts.beforeStart, 'shutdown clears the ping job')
    t.end()
})

function startAndShutdownAgentInChildProcess(scheduler) {
    const fixture = path.join(__dirname, 'fixtures/agent-shutdown.js')
    return JSON.parse(execFileSync(process.execPath, [fixture, scheduler], { encoding: 'utf8', timeout: 10000 }))
}

function startCollectorRecordingPingSessions() {
    const pingSessionAgentNames = []
    let pingSessionStarted
    const firstPingSession = new Promise((resolve) => { pingSessionStarted = resolve })
    const server = new grpc.Server()
    server.addService(services.AgentService, {
        pingSession: (call) => {
            pingSessionAgentNames.push(call.metadata.get('agentname')[0])
            call.on('data', (ping) => call.write(ping))
            pingSessionStarted()
        }
    })
    return new Promise((resolve, reject) => {
        server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
            error ? reject(error) : resolve({ server, port, pingSessionAgentNames, firstPingSession })
        })
    })
}

function collectorConfig(port, json) {
    return new ConfigBuilder({
        applicationName: 'appName',
        collector: { ip: 'localhost', spanPort: port, statPort: port, tcpPort: port },
        features: { dataSending: true },
        ...json,
    }).setUserDefinedJson({}).build()
}
