/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const { getConfig, clear, isContainerEnvironment } = require('../../lib/config')

function isRunGithubAction() {
    return isContainerEnvironment
}


test('should return the string value when the env value is string type', function(t) {
    clear()

    process.env['PINPOINT_AGENT_ID'] = "agentId"
    process.env['PINPOINT_APPLICATION_NAME'] = "appication name"
    process.env['PINPOINT_COLLECTOR_IP'] = "192.168.78.79"
    process.env['PINPOINT_LOG_LEVEL'] = "Debug"

    const given = getConfig()
    t.equal(given.agentId, "agentId", "given PINPOINT_AGENT_ID env, should equal config")
    t.equal(given.applicationName, "appication name", "given PINPOINT_APPLICATION_NAME env, should equal config")
    t.equal(given.collectorIp, "192.168.78.79", "given PINPOINT_COLLECTOR_IP env, should equal config")
    t.equal(given.logLevel, "Debug", "given PINPOINT_LOG_LEVEL env, should equal config")

    delete process.env.PINPOINT_AGENT_ID
    delete process.env.PINPOINT_APPLICATION_NAME
    delete process.env.PINPOINT_COLLECTOR_IP
    delete process.env.PINPOINT_LOG_LEVEL

    clear()
    t.end()
})

const givenDefaultIdAndName = () => {
    process.env['PINPOINT_AGENT_ID'] = "agentId"
    process.env['PINPOINT_APPLICATION_NAME'] = "appication name"

    const given = getConfig()

    delete process.env.PINPOINT_AGENT_ID
    delete process.env.PINPOINT_APPLICATION_NAME

    return given
}

test('should return the number value when the env value is number type', function(t) {
    clear()

    process.env['PINPOINT_SERVICE_TYPE'] = "1400"
    process.env['PINPOINT_COLLECTOR_TCP_PORT'] = "9894"
    process.env['PINPOINT_COLLECTOR_STAT_PORT'] = "9895"
    process.env['PINPOINT_COLLECTOR_SPAN_PORT'] = "9896"
    process.env['PINPOINT_SAMPLING_RATE'] = "10"

    const given = givenDefaultIdAndName()
    t.equal(given.serviceType, 1400, 'given PINPOINT_SERVICE_TYPE env, should equal config')
    t.equal(given.collectorTcpPort, 9894, 'given PINPOINT_COLLECTOR_TCP_PORT env, should equal config')
    t.equal(given.collectorStatPort, 9895, 'given PINPOINT_COLLECTOR_STAT_PORT env, should equal config')
    t.equal(given.collectorSpanPort, 9896, 'given PINPOINT_COLLECTOR_SPAN_PORT env, should equal config')
    t.equal(given.sampleRate, 10, 'given PINPOINT_SAMPLING_RATE env, should equal config')

    delete process.env.PINPOINT_SERVICE_TYPE
    delete process.env.PINPOINT_COLLECTOR_TCP_PORT
    delete process.env.PINPOINT_COLLECTOR_STAT_PORT
    delete process.env.PINPOINT_COLLECTOR_SPAN_PORT
    delete process.env.PINPOINT_SAMPLING_RATE

    clear()
    t.end()
})

test('should return the true value when the env value is boolean type', function(t) {
    clear()

    process.env['PINPOINT_SAMPLING'] = "true"
    process.env['PINPOINT_ENABLE'] = "true"
    process.env['PINPOINT_CONTAINER'] = "true"

    const given = givenDefaultIdAndName()
    t.equal(given.sampling, true, 'given PINPOINT_SAMPLING env, should equal config')
    t.equal(given.enable, false, 'given PINPOINT_ENABLE env, should equal config')
    t.equal(given.container, true, 'given PINPOINT_CONTAINER env, should equal config')

    delete process.env.PINPOINT_SAMPLING
    delete process.env.PINPOINT_ENABLE
    delete process.env.PINPOINT_CONTAINER

    clear()
    t.end()
})

test('should return the false value when the env value is boolean type', function(t) {
    clear()

    process.env['PINPOINT_SAMPLING'] = "false"
    process.env['PINPOINT_ENABLE'] = "false"
    process.env['PINPOINT_CONTAINER'] = "false"

    const given = getConfig()
    t.equal(given.sampling, false, 'given PINPOINT_SAMPLING env, should equal config')
    t.equal(given.enable, false, 'given PINPOINT_ENABLE env, should equal config')
    if (!isRunGithubAction()) {
        t.equal(given.container, false, 'given PINPOINT_CONTAINER env, should equal config')
    }

    delete process.env.PINPOINT_SAMPLING
    delete process.env.PINPOINT_ENABLE
    delete process.env.PINPOINT_CONTAINER

    clear()
    t.end()
})

test('should not exist in the process.env property when you do not set an environment variable', function(t) {
    clear()

    delete process.env.PINPOINT_COLLECTOR_IP
    delete process.env.PINPOINT_LOG_LEVEL

    delete process.env.PINPOINT_SAMPLING
    delete process.env.PINPOINT_ENABLE
    delete process.env.PINPOINT_CONTAINER

    delete process.env.PINPOINT_SERVICE_TYPE
    delete process.env.PINPOINT_COLLECTOR_TCP_PORT
    delete process.env.PINPOINT_COLLECTOR_STAT_PORT
    delete process.env.PINPOINT_COLLECTOR_SPAN_PORT
    delete process.env.PINPOINT_SAMPLING_RATE

    const given = givenDefaultIdAndName()
    t.equal(given.agentId, "agentId", "No set PINPOINT_AGENT_ID env, should equal default config")
    t.equal(given.applicationName, "appication name", "No set PINPOINT_APPLICATION_NAME env, should equal default config")
    t.equal(given.collectorIp, "localhost", "No set PINPOINT_COLLECTOR_IP env, should equal default config")
    t.equal(given.logLevel, "WARN", "No set PINPOINT_LOG_LEVEL env, should equal default config")

    t.equal(given.sampling, true, 'No set PINPOINT_SAMPLING env, should equal default config')
    t.equal(given.enable, false, 'No set PINPOINT_ENABLE env, should equal default config')
    if (!isRunGithubAction()) {
        t.equal(given.container, false, 'No set PINPOINT_CONTAINER env, should equal default config')
    }

    t.equal(given.serviceType, 1400, 'No set PINPOINT_SERVICE_TYPE env, should equal default config')
    t.equal(given.collectorTcpPort, 9991, 'No set PINPOINT_COLLECTOR_TCP_PORT env, should equal default config')
    t.equal(given.collectorStatPort, 9992, 'No set PINPOINT_COLLECTOR_STAT_PORT env, should equal default config')
    t.equal(given.collectorSpanPort, 9993, 'No set PINPOINT_COLLECTOR_SPAN_PORT env, should equal default config')
    t.equal(given.sampleRate, 10, 'No set PINPOINT_SAMPLING_RATE env, should equal default config')

    clear()
    t.end()
})

test(`default config`, (t) => {
    clear()

    const given = givenDefaultIdAndName()
    t.equal(given.enabledActiveThreadCount, false, 'No set activeThreadCount')

    t.end()
})

test(`detect container`, (t) => {
    clear()

    process.env['KUBERNETES_SERVICE_HOST'] = "aaa"
    const given = getConfig()

    t.plan(1)
    t.equal(given.container, true, 'container detect')

    delete process.env.KUBERNETES_SERVICE_HOST
})

test(`detect container2`, (t) => {
    clear()

    if (!isRunGithubAction()) {
        const given = getConfig()
        t.equal(given.container, false, 'container detect')
    }

    delete process.env.KUBERNETES_SERVICE_HOST
    t.end()
})