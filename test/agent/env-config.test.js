/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const { ConfigBuilder } = require('../../lib/config-builder')

test('should return the string value when the env value is string type', function(t) {
    process.env['PINPOINT_AGENT_ID'] = "agentId"
    process.env['PINPOINT_APPLICATION_NAME'] = "appication name"
    process.env['PINPOINT_COLLECTOR_IP'] = "192.168.78.79"
    process.env['PINPOINT_LOGGER_LEVELS'] = "default-logger=DEBUG"

    const given = new ConfigBuilder({ collector: { protocolVersion: 'v3' } }).build()
    t.equal(given.agentId, "agentId", "given PINPOINT_AGENT_ID env, v3 config uses it")
    t.equal(given.applicationName, "appication name", "given PINPOINT_APPLICATION_NAME env, should equal config")
    t.equal(given.collector.ip, "192.168.78.79", "given PINPOINT_COLLECTOR_IP env, should equal config")
    t.equal(given.features.logLevels['default-logger'], "DEBUG", "given PINPOINT_LOGGER_LEVELS env, should equal config")

    delete process.env.PINPOINT_AGENT_ID
    delete process.env.PINPOINT_APPLICATION_NAME
    delete process.env.PINPOINT_COLLECTOR_IP
    delete process.env.PINPOINT_LOGGER_LEVELS

    t.end()
})

const givenDefaultIdAndName = () => {
    process.env['PINPOINT_APPLICATION_NAME'] = "appName"
    process.env['PINPOINT_SERVICE_NAME'] = "serviceName"

    const given = new ConfigBuilder().build()

    delete process.env.PINPOINT_APPLICATION_NAME
    delete process.env.PINPOINT_SERVICE_NAME

    return given
}

test('should return the number value when the env value is number type', function(t) {
    process.env['PINPOINT_COLLECTOR_TCP_PORT'] = "9894"
    process.env['PINPOINT_COLLECTOR_STAT_PORT'] = "9895"
    process.env['PINPOINT_COLLECTOR_SPAN_PORT'] = "9896"
    process.env['PINPOINT_SAMPLING_RATE'] = "10"

    const given = givenDefaultIdAndName()
    t.equal(given.collector.tcpPort, 9894, 'given PINPOINT_COLLECTOR_TCP_PORT env, should equal config')
    t.equal(given.collector.statPort, 9895, 'given PINPOINT_COLLECTOR_STAT_PORT env, should equal config')
    t.equal(given.collector.spanPort, 9896, 'given PINPOINT_COLLECTOR_SPAN_PORT env, should equal config')
    t.equal(given.sampling.rate, 10, 'given PINPOINT_SAMPLING_RATE env, should equal config')

    delete process.env.PINPOINT_COLLECTOR_TCP_PORT
    delete process.env.PINPOINT_COLLECTOR_STAT_PORT
    delete process.env.PINPOINT_COLLECTOR_SPAN_PORT
    delete process.env.PINPOINT_SAMPLING_RATE

    t.end()
})

test('span batch env values set collector.spanBatch', function(t) {
    process.env['PINPOINT_COLLECTOR_SPAN_BATCH_SIZE'] = "50"
    process.env['PINPOINT_COLLECTOR_SPAN_BATCH_COLLECT_DEADLINE_MILLIS'] = "300"
    process.env['PINPOINT_COLLECTOR_SPAN_BATCH_MAX_CONCURRENT_REQUESTS'] = "5"

    const given = givenDefaultIdAndName()
    t.deepEqual(given.getSpanBatch(), { size: 50, collectDeadlineMillis: 300, maxConcurrentRequests: 5 }, 'given PINPOINT_COLLECTOR_SPAN_BATCH_* env, should equal config')

    delete process.env.PINPOINT_COLLECTOR_SPAN_BATCH_SIZE
    delete process.env.PINPOINT_COLLECTOR_SPAN_BATCH_COLLECT_DEADLINE_MILLIS
    delete process.env.PINPOINT_COLLECTOR_SPAN_BATCH_MAX_CONCURRENT_REQUESTS

    t.end()
})

test('should return the true value when the env value is boolean type', function(t) {
    process.env['PINPOINT_SAMPLING'] = "true"
    process.env['PINPOINT_ENABLE'] = "true"

    const given = givenDefaultIdAndName()
    t.equal(given.sampling.enable, true, 'given PINPOINT_SAMPLING env, should equal config')
    t.equal(given.enable, true, 'given PINPOINT_ENABLE env, should equal config')

    delete process.env.PINPOINT_SAMPLING
    delete process.env.PINPOINT_ENABLE

    t.end()
})

test('should return the false value when the env value is boolean type', function(t) {
    process.env['PINPOINT_SAMPLING'] = "false"
    process.env['PINPOINT_ENABLE'] = "false"

    const given = new ConfigBuilder().build()
    t.equal(given.sampling.enable, false, 'given PINPOINT_SAMPLING env, should equal config')
    t.equal(given.enable, false, 'given PINPOINT_ENABLE env, should equal config')

    delete process.env.PINPOINT_SAMPLING
    delete process.env.PINPOINT_ENABLE

    t.end()
})

test('should not exist in the process.env property when you do not set an environment variable', function(t) {
    delete process.env.PINPOINT_COLLECTOR_IP
    delete process.env.PINPOINT_LOGGER_LEVELS

    delete process.env.PINPOINT_SAMPLING
    delete process.env.PINPOINT_ENABLE

    delete process.env.PINPOINT_COLLECTOR_TCP_PORT
    delete process.env.PINPOINT_COLLECTOR_STAT_PORT
    delete process.env.PINPOINT_COLLECTOR_SPAN_PORT
    delete process.env.PINPOINT_SAMPLING_RATE

    const given = givenDefaultIdAndName()
    t.equal(given.collector.ip, "localhost", "No set PINPOINT_COLLECTOR_IP env, should equal default config")
    t.deepEqual(given.features.logLevels, { 'default-logger': 'WARN', 'grpcLogger': 'SILENT' }, "No set PINPOINT_ LOGGER_LEVELS env, should equal default config")

    t.equal(given.sampling.enable, true, 'No set PINPOINT_SAMPLING env, should equal default config')
    t.equal(given.enable, true, 'No set PINPOINT_ENABLE env, should equal default config')

    t.equal(given.collector.tcpPort, 9991, 'No set PINPOINT_COLLECTOR_TCP_PORT env, should equal default config')
    t.equal(given.collector.statPort, 9992, 'No set PINPOINT_COLLECTOR_STAT_PORT env, should equal default config')
    t.equal(given.collector.spanPort, 9993, 'No set PINPOINT_COLLECTOR_SPAN_PORT env, should equal default config')
    t.equal(given.sampling.rate, 10, 'No set PINPOINT_SAMPLING_RATE env, should equal default config')
    t.end()
})

test(`default config`, (t) => {
    const given = givenDefaultIdAndName()
    t.equal(given.features.activeThreadCount, true, 'No set activeThreadCount')
    t.end()
})
