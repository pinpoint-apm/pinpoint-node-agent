/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

// Runs in its own process: Agent.shutdown() cancels the process-wide undici instrumentation
// that other test files share, so test/agent/agent-shutdown.test.js starts the agent here.
const { ConfigBuilder } = require('../../lib/config-builder')
const { AgentBuilder } = require('../../lib/agent-builder')

const scheduler = process.argv[2]
const agent = scheduler === 'stats' ? statsOnlyAgent() : pingOnlyAgent()

const beforeStart = activeTimeoutCount()
agent.start()
const afterStart = activeTimeoutCount()
agent.shutdown()
const afterShutdown = activeTimeoutCount()

process.stdout.write(JSON.stringify({ beforeStart, afterStart, afterShutdown }))

function statsOnlyAgent() {
    const config = new ConfigBuilder({ applicationName: 'appName', serviceName: 'serviceName' }).setUserDefinedJson({}).build()
    return new AgentBuilder(config)
        .setDataSender({ send: () => {}, sendStat: () => {}, close: () => {} })
        .setLogger({ warn: () => {} })
        .disablePingScheduler()
        .disableServiceCommand()
        .build()
}

function pingOnlyAgent() {
    const config = new ConfigBuilder({ applicationName: 'appName', serviceName: 'serviceName', features: { statsMonitoring: false } }).setUserDefinedJson({}).build()
    return new AgentBuilder(config)
        .setDataSender({ send: () => {}, sendPing: () => {}, close: () => {} })
        .setLogger({ warn: () => {} })
        .disableStatsScheduler()
        .disableServiceCommand()
        .build()
}

function activeTimeoutCount() {
    return process.getActiveResourcesInfo().filter(resource => resource === 'Timeout').length
}
