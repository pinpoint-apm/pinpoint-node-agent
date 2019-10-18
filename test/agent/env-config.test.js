const test = require('tape')
const config = require('../../lib/config')

test('should return the agentId string value when the env value is string type', function(t) {
    process.env['PINPOINT_AGENT_ID'] = "agentId"
    process.env['PINPOINT_APPLICATION_NAME'] = "appication name"
    process.env['PINPOINT_COLLECTOR_IP'] = "***REMOVED***"
    process.env['PINPOINT_LOG_LEVEL'] = "Debug"

    const given = config.getConfig()
    t.equal(given.agentId, "agentId", "given PINPOINT_AGENT_ID env, should equal config")
    t.equal(given.applicationName, "appication name", "given PINPOINT_APPLICATION_NAME env, should equal config")
    t.equal(given.collectorIp, "***REMOVED***", "given PINPOINT_COLLECTOR_IP env, should equal config")
    t.equal(given.logLevel, "Debug", "given PINPOINT_LOG_LEVEL env, should equal config")

    process.env['PINPOINT_AGENT_ID'] = undefined
    process.env['PINPOINT_APPLICATION_NAME'] = undefined
    process.env['PINPOINT_COLLECTOR_IP'] = undefined
    process.env['PINPOINT_LOG_LEVEL'] = undefined
    t.end()
});
