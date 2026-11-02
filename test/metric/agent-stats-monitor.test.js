/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const AgentStatsMonitor = require('../../lib/metric/agent-stats-monitor')
const DateNow = require('../../lib/support/date-now')

test('collectInterval is the time since the AgentStatsMonitor was created for the first stat', (t) => {
    const agentStatsMonitor = new AgentStatsMonitor(null, 'agentId', 1)
    DateNow.setOffset(7000)

    const collectInterval = agentStatsMonitor.createStatsInfo({}).collectInterval

    t.ok(collectInterval >= 7000 && collectInterval < 8000, `collectInterval ${collectInterval} is about 7000 ms`)
    DateNow.reset()
    agentStatsMonitor.shutdown()
    t.end()
})

test('collectInterval is the time since the previous stat', (t) => {
    const agentStatsMonitor = new AgentStatsMonitor(null, 'agentId', 1)
    agentStatsMonitor.createStatsInfo({})
    DateNow.setOffset(3000)

    const collectInterval = agentStatsMonitor.createStatsInfo({}).collectInterval

    t.ok(collectInterval >= 3000 && collectInterval < 4000, `collectInterval ${collectInterval} is about 3000 ms`)
    DateNow.reset()
    agentStatsMonitor.shutdown()
    t.end()
})
