/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const path = require('path')
const { execFileSync } = require('child_process')
const AgentStatsMonitor = require('../../lib/metric/agent-stats-monitor')

test('Agent shutdown stops the stats scheduler', (t) => {
    const timeouts = startAndShutdownAgentInChildProcess('stats')

    t.equal(timeouts.afterStart, timeouts.beforeStart + 1, 'start schedules the stats job')
    t.equal(timeouts.afterShutdown, timeouts.beforeStart, 'shutdown clears the stats job')
    t.end()
})

test('Agent shutdown stops the ping scheduler', (t) => {
    const timeouts = startAndShutdownAgentInChildProcess('ping')

    t.equal(timeouts.afterStart, timeouts.beforeStart + 1, 'start schedules the ping job')
    t.equal(timeouts.afterShutdown, timeouts.beforeStart, 'shutdown clears the ping job')
    t.end()
})

test('AgentStatsMonitor does not send a stat collected before shutdown', async (t) => {
    const sentStats = []
    const agentStatsMonitor = new AgentStatsMonitor({ sendStat: (stat) => sentStats.push(stat) }, 'agentId', 1)

    agentStatsMonitor.send()
    agentStatsMonitor.shutdown()
    await new Promise(resolve => setTimeout(resolve, 1100))

    t.deepEqual(sentStats, [], 'no stat is sent after shutdown')
    t.end()
})

function startAndShutdownAgentInChildProcess(scheduler) {
    const fixture = path.join(__dirname, '../fixtures/agent-shutdown.js')
    return JSON.parse(execFileSync(process.execPath, [fixture, scheduler], { encoding: 'utf8', timeout: 10000 }))
}
