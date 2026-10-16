/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const { ConfigBuilder } = require('../../lib/config-builder')
const { AgentBuilder } = require('../../lib/agent-builder')

test('Agent is disabled when names and ids have errors', (t) => {
    const config = new ConfigBuilder({ applicationName: '~', serviceName: 'serviceName' }).setUserDefinedJson({}).build()
    const sentData = []
    const warnLogs = []

    const agent = new AgentBuilder(config)
        .setDataSender({ send: (data) => sentData.push(data), close: () => {} })
        .setLogger({ warn: (...args) => warnLogs.push(args) })
        .disablePingScheduler()
        .disableStatsScheduler()
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
        .disableStatsScheduler()
        .disableServiceCommand()
        .build()
    agent.start()

    t.deepEqual(warnLogs[0], ['[Pinpoint Agent] Configuration', config], 'the Configuration is logged first')
    t.deepEqual(config.messages.warns, ['Agent ID node.app is ignored; collector.protocolVersion v4 always generates the Agent ID. Set collector.protocolVersion to v3 to use a configured Agent ID.'], 'the Configuration has the ignored v4 agentId warn')
    t.end()
})
