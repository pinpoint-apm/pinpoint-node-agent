const test = require('tape')
const config = require('../../lib/config')

test('should return the string value when the env value is string type', function(t) {
    process.env['PINPOINT_AGENT_ID'] = "agentId"
    process.env['PINPOINT_APPLICATION_NAME'] = "appication name"
    process.env['PINPOINT_COLLECTOR_IP'] = "***REMOVED***"
    process.env['PINPOINT_LOG_LEVEL'] = "Debug"

    const given = config.getConfig()
    t.equal(given.agentId, "agentId", "given PINPOINT_AGENT_ID env, should equal config")
    t.equal(given.applicationName, "appication name", "given PINPOINT_APPLICATION_NAME env, should equal config")
    t.equal(given.collectorIp, "***REMOVED***", "given PINPOINT_COLLECTOR_IP env, should equal config")
    t.equal(given.logLevel, "Debug", "given PINPOINT_LOG_LEVEL env, should equal config")

    delete process.env.PINPOINT_AGENT_ID
    delete process.env.PINPOINT_APPLICATION_NAME
    delete process.env.PINPOINT_COLLECTOR_IP
    delete process.env.PINPOINT_LOG_LEVEL

    t.end()
})

test('should return the number value when the env value is number type', function(t) {
    process.env['PINPOINT_SERVICE_TYPE'] = "1400"
    process.env['PINPOINT_COLLECTOR_TCP_PORT'] = "1400"
    process.env['PINPOINT_COLLECTOR_STAT_PORT'] = "1400"
    process.env['PINPOINT_COLLECTOR_SPAN_PORT'] = "1400"
    // process.env['PINPOINT_SAMPLING_RATE'] = "10"

    const given = config.getConfig()
    t.equal(given.serviceType, 1400, 'given PINPOINT_SERVICE_TYPE env, should equal config')
    t.equal(given.collectorTcpPort, 1400, 'given PINPOINT_COLLECTOR_TCP_PORT env, should equal config')
    t.equal(given.collectorStatPort, 1400, 'given PINPOINT_COLLECTOR_STAT_PORT env, should equal config')
    t.equal(given.collectorSpanPort, 1400, 'given PINPOINT_COLLECTOR_SPAN_PORT env, should equal config')
    // t.equal(given.sampleRate, 10, 'given PINPOINT_SAMPLING_RATE env, should equal config')

    delete process.env.PINPOINT_SERVICE_TYPE
    delete process.env.PINPOINT_COLLECTOR_TCP_PORT
    delete process.env.PINPOINT_COLLECTOR_STAT_PORT
    delete process.env.PINPOINT_COLLECTOR_SPAN_PORT
    t.end()
})