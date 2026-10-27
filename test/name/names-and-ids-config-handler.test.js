/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const { NamesAndIdsConfigHandler } = require('../../lib/name/names-and-ids-config-handler')
const { isContainerEnvironment } = require('../../lib/support/container-environment')
const { ConfigBuilder } = require('../../lib/config-builder')
const AgentInfo = require('../../lib/data/dto/agent-info')

const generatedAgentIdPattern = /^[A-Za-z0-9_-]{22}$/
const v3Json = { collector: { protocolVersion: 'v3' } }

test('collector.protocolVersion from json config', (t) => {
    let actual = namesAndIdsOf({ collector: {} })
    t.equal(actual.collector.protocolVersion, 'v4', 'no protocolVersion defaults to v4')

    actual = namesAndIdsOf({ collector: { protocolVersion: 'v3' } })
    t.equal(actual.collector.protocolVersion, 'v3', 'v3 is v3')

    actual = namesAndIdsOf({ collector: { protocolVersion: 'V3' } })
    t.equal(actual.collector.protocolVersion, 'v3', 'V3 is case-insensitive v3')

    actual = namesAndIdsOf({ collector: { protocolVersion: 'v4' } })
    t.equal(actual.collector.protocolVersion, 'v4', 'v4 is v4')

    actual = namesAndIdsOf({ collector: { protocolVersion: 'x' } })
    t.equal(actual.collector.protocolVersion, 'v4', 'unknown value falls back to v4')

    actual = namesAndIdsOf({ collector: { protocolVersion: '' } })
    t.equal(actual.collector.protocolVersion, 'v4', 'empty value falls back to v4')
    t.end()
})

test('PINPOINT_PROTOCOL_VERSION overrides json config', (t) => {
    process.env.PINPOINT_PROTOCOL_VERSION = 'V3'
    let actual = namesAndIdsOf({ collector: { protocolVersion: 'v4' } })
    t.equal(actual.collector.protocolVersion, 'v3', 'env V3 overrides json v4')

    process.env.PINPOINT_PROTOCOL_VERSION = 'v4'
    actual = namesAndIdsOf({ collector: { protocolVersion: 'v3' } })
    t.equal(actual.collector.protocolVersion, 'v4', 'env v4 overrides json v3')
    delete process.env.PINPOINT_PROTOCOL_VERSION
    t.end()
})

test('v4 without serviceName has an error', (t) => {
    const given = namesAndIdsOf({ applicationName: 'appName' })

    t.equal(given.collector.protocolVersion, 'v4', 'default version is v4')
    t.deepEqual(errorsOf(given), ['Service Name is required. See https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#3-configuration-with-environment-variables'], 'serviceName is required for v4')
    t.end()
})

test('v4 serviceName up to 254 characters with [a-zA-Z0-9._-]', (t) => {
    const maxLength = namesAndIdsOf({ applicationName: 'appName', serviceName: 'a'.repeat(254) })
    t.deepEqual(errorsOf(maxLength), [], '254 characters serviceName is valid')
    t.equal(maxLength.serviceName, 'a'.repeat(254), 'serviceName is kept')

    const tooLong = namesAndIdsOf({ applicationName: 'appName', serviceName: 'a'.repeat(255) })
    t.deepEqual(errorsOf(tooLong), ['Service Name is too long (max 254 characters). See https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#3-configuration-with-environment-variables'], '255 characters serviceName is too long')

    const invalid = namesAndIdsOf({ applicationName: 'appName', serviceName: '~' })
    t.deepEqual(errorsOf(invalid), ['Service Name has invalid characters; allowed [a-zA-Z0-9._-]. Value: ~. See https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#3-configuration-with-environment-variables'], 'invalid characters in serviceName')
    t.end()
})

test('v3 ignores serviceName', (t) => {
    const withoutServiceName = namesAndIdsOf({ ...v3Json, applicationName: 'appName' })
    t.deepEqual(errorsOf(withoutServiceName), [], 'v3 does not require serviceName')

    const invalidServiceName = namesAndIdsOf({ ...v3Json, applicationName: 'appName', serviceName: '~' })
    t.deepEqual(errorsOf(invalidServiceName), [], 'v3 does not validate serviceName')
    t.end()
})

test('PINPOINT_SERVICE_NAME overrides json serviceName', (t) => {
    process.env.PINPOINT_SERVICE_NAME = 'service-from-env'
    const given = namesAndIdsOf({ applicationName: 'appName', serviceName: 'service-from-json' })
    delete process.env.PINPOINT_SERVICE_NAME

    t.equal(given.serviceName, 'service-from-env', 'env overrides json')
    t.end()
})

test('v4 ignores the configured agentId and always generates one', (t) => {
    const byJson = namesAndIdsOf({ agentId: 'agentId', applicationName: 'appName', serviceName: 'serviceName' })
    t.notEqual(byJson.agentId, 'agentId', 'v4 ignores json agentId')
    t.match(byJson.agentId, generatedAgentIdPattern, 'v4 agentId is a 22-char base64 UUIDv7')

    process.env.PINPOINT_AGENT_ID = 'agentIdagentIdagentIdageE'
    const byEnv = namesAndIdsOf({ applicationName: 'appName', serviceName: 'serviceName' })
    delete process.env.PINPOINT_AGENT_ID
    t.match(byEnv.agentId, generatedAgentIdPattern, 'v4 ignores PINPOINT_AGENT_ID')
    t.deepEqual(errorsOf(byEnv), [], 'v4 does not validate the ignored agentId')
    t.end()
})

test('v4 agentName up to 254 characters', (t) => {
    const maxLength = namesAndIdsOf({ agentName: 'a'.repeat(254), applicationName: 'appName', serviceName: 'serviceName' })
    t.deepEqual(errorsOf(maxLength), [], '254 characters agentName is valid')

    const tooLong = namesAndIdsOf({ agentName: 'a'.repeat(255), applicationName: 'appName', serviceName: 'serviceName' })
    t.deepEqual(errorsOf(tooLong), ['Agent Name is too long (max 254 characters). See https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#3-configuration-with-environment-variables'], '255 characters agentName is too long for v4')
    t.end()
})

test('agentName falls back to agentId', (t) => {
    const v4WithoutAgentName = namesAndIdsOf({ applicationName: 'appName', serviceName: 'serviceName' })
    t.equal(v4WithoutAgentName.agentName, v4WithoutAgentName.agentId, 'v4 without agentName uses the generated agentId')

    const v4WithAgentName = namesAndIdsOf({ agentName: 'agentName', applicationName: 'appName', serviceName: 'serviceName' })
    t.equal(v4WithAgentName.agentName, 'agentName', 'v4 with agentName uses agentName')

    const v3WithoutAgentName = namesAndIdsOf({ ...v3Json, agentId: 'agentId', applicationName: 'appName' })
    t.equal(v3WithoutAgentName.agentName, 'agentId', 'v3 without agentName uses agentId')
    t.end()
})

test('json applicationServiceType and PINPOINT_SERVICE_TYPE are ignored and AgentInfo is NODE 1400', (t) => {
    process.env.PINPOINT_SERVICE_TYPE = '1600'
    const config = configOf({ applicationName: 'appName', serviceName: 'serviceName', applicationServiceType: 1500 })
    delete process.env.PINPOINT_SERVICE_TYPE

    t.equal(new AgentInfo(config, '1700000000000').getApplicationServiceType(), 1400, 'AgentInfo applicationServiceType is NODE 1400')
    t.end()
})

test('PINPOINT_CONTAINER true and json features.container true mark the container', (t) => {
    process.env.PINPOINT_CONTAINER = 'true'
    const byEnv = namesAndIdsOf(v3Json)
    delete process.env.PINPOINT_CONTAINER
    t.true(byEnv.features.container, 'PINPOINT_CONTAINER true')

    const byJson = namesAndIdsOf({ ...v3Json, features: { container: true } })
    t.true(byJson.features.container, 'json features.container true')
    t.end()
})

test('KUBERNETES_SERVICE_HOST is detected as a container', (t) => {
    process.env.KUBERNETES_SERVICE_HOST = 'aaa'
    const given = namesAndIdsOf(v3Json)
    delete process.env.KUBERNETES_SERVICE_HOST

    t.true(given.features.container, 'Kubernetes environment is a container')
    t.end()
})

test('AgentInfo carries the final names, ids and container of Config', (t) => {
    process.env.KUBERNETES_SERVICE_HOST = 'aaa'
    const config = configOf({ applicationName: 'appName', serviceName: 'serviceName' })
    delete process.env.KUBERNETES_SERVICE_HOST

    const agentInfo = new AgentInfo(config, '1700000000000')
    t.match(agentInfo.getAgentId(), generatedAgentIdPattern, 'agentId is the generated v4 agentId')
    t.equal(agentInfo.getAgentId(), config.agentId, 'agentId is the Config agentId')
    t.equal(agentInfo.getAgentName(), config.agentId, 'agentName falls back to agentId')
    t.equal(agentInfo.getApplicationName(), 'appName', 'applicationName')
    t.true(agentInfo.container, 'container')
    t.equal(agentInfo.getAgentStartTime(), '1700000000000', 'agentStartTime is the given agentStartTime')
    t.end()
})

test('Agent ID required field', function (t) {
    t.plan(1)

    delete process.env.PINPOINT_AGENT_ID
    delete process.env.PINPOINT_APPLICATION_NAME

    const conf = namesAndIdsOf(v3Json)
    t.match(conf.agentId, generatedAgentIdPattern, 'agentId is generated as 22-char base64 UUIDv7')
})

test('Should be configured with environment variable', function (t) {
    t.plan(1)

    const agentId = 'id-from-env'
    process.env.PINPOINT_AGENT_ID = agentId

    const conf = namesAndIdsOf(v3Json)
    t.equal(agentId, conf.agentId)

    delete process.env.PINPOINT_AGENT_ID
})

test('PINPOINT_AGENT_ID overrides json agentId', function (t) {
    t.plan(1)

    process.env.PINPOINT_AGENT_ID = 'id-from-env'

    const conf = namesAndIdsOf({ ...v3Json, agentId: 'id-from-json' })
    t.equal(conf.agentId, 'id-from-env')

    delete process.env.PINPOINT_AGENT_ID
})

// https://github.com/pinpoint-apm/pinpoint/blob/master/commons/src/main/java/com/navercorp/pinpoint/common/util/IdValidateUtils.java
// public static final String ID_PATTERN_VALUE = '[a-zA-Z0-9\\._\\-]+';
// https://github.com/pinpoint-apm/pinpoint/blob/master/bootstraps/bootstrap/src/main/java/com/navercorp/pinpoint/bootstrap/IdValidator.java
// https://github.com/pinpoint-apm/pinpoint/blob/master/commons/src/main/java/com/navercorp/pinpoint/common/PinpointConstants.java
// public final class PinpointConstants {
//   public static final int APPLICATION_NAME_MAX_LEN = 24; // uid v1 only, v3 and v4 allow 254
//   public static final int AGENT_ID_MAX_LEN = 24;
// }
test('Agent ID length check', (t) => {
    process.env['PINPOINT_AGENT_ID'] = 'agentId'
    process.env['PINPOINT_APPLICATION_NAME'] = 'appication-name'
    process.env['PINPOINT_AGENT_NAME'] = 'agent-name'
    let given = namesAndIdsOf(v3Json)
    t.deepEqual(errorsOf(given), [], 'configuration agentId, Name, ApplicationName enable agent id')
    t.equal(given.agentName, 'agent-name', 'agent name is agent name')
    delete process.env.PINPOINT_AGENT_ID
    delete process.env.PINPOINT_APPLICATION_NAME
    delete process.env.PINPOINT_AGENT_NAME

    process.env['PINPOINT_AGENT_ID'] = 'agentIdagentIdagentIdage'
    process.env['PINPOINT_APPLICATION_NAME'] = 'appicationnameappication'
    given = namesAndIdsOf(v3Json)
    t.deepEqual(errorsOf(given), [], 'maxlength agentID and application Name')
    t.deepEqual(errorsOf(given), [], 'no error message')
    delete process.env.PINPOINT_AGENT_ID
    delete process.env.PINPOINT_APPLICATION_NAME

    process.env['PINPOINT_AGENT_ID'] = 'agentIdagentIdagentIdageE'
    process.env['PINPOINT_APPLICATION_NAME'] = 'appicationnameappication'
    given = namesAndIdsOf(v3Json)
    t.notDeepEqual(errorsOf(given), [], 'maxlength agentID error')
    t.equal(errorsOf(given)[0], 'Agent ID is too long (max 24 characters). See https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#3-configuration-with-environment-variables')
    delete process.env.PINPOINT_AGENT_ID
    delete process.env.PINPOINT_APPLICATION_NAME

    process.env['PINPOINT_AGENT_ID'] = 'agentIdagentIdagentIdage'
    process.env['PINPOINT_APPLICATION_NAME'] = 'a'.repeat(254)
    given = namesAndIdsOf(v3Json)
    t.deepEqual(errorsOf(given), [], 'maxlength application Name is 254')
    t.deepEqual(errorsOf(given), [], 'no error message for 254 characters application Name')

    process.env['PINPOINT_APPLICATION_NAME'] = 'a'.repeat(255)
    given = namesAndIdsOf(v3Json)
    t.notDeepEqual(errorsOf(given), [], 'maxlength application Name error')
    t.equal(errorsOf(given)[0], 'Application Name is too long (max 254 characters). See https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#3-configuration-with-environment-variables')
    delete process.env.PINPOINT_AGENT_ID
    delete process.env.PINPOINT_APPLICATION_NAME

    process.env['PINPOINT_AGENT_ID'] = '~'
    process.env['PINPOINT_APPLICATION_NAME'] = 'appicationnameappication'
    given = namesAndIdsOf(v3Json)
    t.notDeepEqual(errorsOf(given), [], 'invalide agent ID')
    t.equal(errorsOf(given)[0], 'Agent ID has invalid characters; allowed [a-zA-Z0-9._-]. Value: ~. See https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#3-configuration-with-environment-variables')
    delete process.env.PINPOINT_AGENT_ID
    delete process.env.PINPOINT_APPLICATION_NAME

    process.env['PINPOINT_AGENT_ID'] = 'agentIdagentIdagentIdage'
    process.env['PINPOINT_APPLICATION_NAME'] = '~'
    given = namesAndIdsOf(v3Json)
    t.notDeepEqual(errorsOf(given), [], 'invalide application name')
    t.equal(errorsOf(given)[0], 'Application Name has invalid characters; allowed [a-zA-Z0-9._-]. Value: ~. See https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#3-configuration-with-environment-variables')
    delete process.env.PINPOINT_AGENT_ID
    delete process.env.PINPOINT_AGENT_NAME
    delete process.env.PINPOINT_APPLICATION_NAME

    process.env['PINPOINT_APPLICATION_NAME'] = 'appicationnameappication'
    given = namesAndIdsOf(v3Json)
    t.deepEqual(errorsOf(given), [], 'agent ID nullable test')
    t.equal(given.applicationName, 'appicationnameappication', 'application name is appicationnameappication')
    t.match(given.agentId, generatedAgentIdPattern, 'generated agent ID is 22-char base64 UUIDv7')
    delete process.env.PINPOINT_AGENT_ID
    delete process.env.PINPOINT_AGENT_NAME
    delete process.env.PINPOINT_APPLICATION_NAME

    given = namesAndIdsOf(v3Json)
    t.notDeepEqual(errorsOf(given), [], 'Application Name must be set')
    t.match(given.agentId, generatedAgentIdPattern, 'Agent ID was generated')
    t.equal(given.agentName, given.agentId, 'Agent Name falls back to Agent ID')
    t.equal(given.applicationName, undefined, 'Application Name is required and only set from developer')
    t.equal(errorsOf(given)[0], 'Application Name is required. See https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#3-configuration-with-environment-variables')
    delete process.env.PINPOINT_AGENT_ID
    delete process.env.PINPOINT_AGENT_NAME
    delete process.env.PINPOINT_APPLICATION_NAME

    process.env['PINPOINT_APPLICATION_NAME'] = 'appicationnameappication'
    process.env['PINPOINT_AGENT_NAME'] = 'agent name'
    given = namesAndIdsOf(v3Json)
    t.notDeepEqual(errorsOf(given), [], 'Application Name must be set')
    t.match(given.agentId, generatedAgentIdPattern, 'Agent ID was generated')
    t.equal(given.agentName, 'agent name', 'Agent Name is optional value and only set from developer')
    t.equal(given.applicationName, 'appicationnameappication', 'Application Name is required and only set from developer')
    t.equal(errorsOf(given)[0], 'Agent Name has invalid characters; allowed [a-zA-Z0-9._-]. Value: agent name. See https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#3-configuration-with-environment-variables')
    delete process.env.PINPOINT_AGENT_ID
    delete process.env.PINPOINT_AGENT_NAME
    delete process.env.PINPOINT_APPLICATION_NAME

    process.env['PINPOINT_APPLICATION_NAME'] = 'appicationnameappication'
    process.env['PINPOINT_AGENT_NAME'] = 'agent?name'
    given = namesAndIdsOf(v3Json)
    t.notDeepEqual(errorsOf(given), [], 'Application Name must be set')
    t.match(given.agentId, generatedAgentIdPattern, 'Agent ID was generated')
    t.equal(given.agentName, 'agent?name', 'Agent Name is optional value and only set from developer')
    t.equal(given.applicationName, 'appicationnameappication', 'Application Name is required and only set from developer')
    t.equal(errorsOf(given)[0], 'Agent Name has invalid characters; allowed [a-zA-Z0-9._-]. Value: agent?name. See https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#3-configuration-with-environment-variables')
    delete process.env.PINPOINT_AGENT_ID
    delete process.env.PINPOINT_AGENT_NAME
    delete process.env.PINPOINT_APPLICATION_NAME

    process.env['PINPOINT_APPLICATION_NAME'] = 'appicationnameappication'
    process.env['PINPOINT_AGENT_NAME'] = 'agentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagen'
    given = namesAndIdsOf(v3Json)
    t.notDeepEqual(errorsOf(given), [], 'Application Name must be set')
    t.match(given.agentId, generatedAgentIdPattern, 'Agent ID was generated')
    t.equal(given.agentName, 'agentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagen', 'Agent Name is optional value and only set from developer')
    t.equal(given.applicationName, 'appicationnameappication', 'Application Name is required and only set from developer')
    t.equal(errorsOf(given)[0], 'Agent Name is too long (max 255 characters). See https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#3-configuration-with-environment-variables')
    delete process.env.PINPOINT_AGENT_ID
    delete process.env.PINPOINT_AGENT_NAME
    delete process.env.PINPOINT_APPLICATION_NAME

    process.env['PINPOINT_APPLICATION_NAME'] = 'appicationnameappication'
    process.env['PINPOINT_AGENT_NAME'] = 'agentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameage'
    given = namesAndIdsOf(v3Json)
    t.deepEqual(errorsOf(given), [], 'Application Name must be set')
    t.match(given.agentId, generatedAgentIdPattern, 'Agent ID was generated')
    t.equal(given.agentName, 'agentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameage', 'Agent Name is optional value and only set from developer')
    t.equal(given.applicationName, 'appicationnameappication', 'Application Name is required and only set from developer')
    t.deepEqual(errorsOf(given), [], 'no error message')
    delete process.env.PINPOINT_AGENT_ID
    delete process.env.PINPOINT_AGENT_NAME
    delete process.env.PINPOINT_APPLICATION_NAME

    t.end()
})

test('Agent Name validation', (t) => {
    t.plan(6)

    // too long (256 chars)
    process.env.PINPOINT_AGENT_ID = 'agent-valid'
    process.env.PINPOINT_APPLICATION_NAME = 'application-valid'
    process.env.PINPOINT_AGENT_NAME = 'a'.repeat(256)
    let given = namesAndIdsOf(v3Json)
    t.notDeepEqual(errorsOf(given), [], 'agent name over 255 disables agent')
    t.equal(errorsOf(given)[0], 'Agent Name is too long (max 255 characters). See https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#3-configuration-with-environment-variables')

    // invalid characters
    process.env.PINPOINT_AGENT_NAME = 'agent?name'
    given = namesAndIdsOf(v3Json)
    t.notDeepEqual(errorsOf(given), [], 'agent name with invalid chars disables agent')
    t.equal(errorsOf(given)[0], 'Agent Name has invalid characters; allowed [a-zA-Z0-9._-]. Value: agent?name. See https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#3-configuration-with-environment-variables')

    // empty allowed (optional)
    process.env.PINPOINT_AGENT_NAME = ''
    given = namesAndIdsOf(v3Json)
    t.deepEqual(errorsOf(given), [], 'empty agent name is allowed')
    t.equal(given.agentName, 'agent-valid', 'empty agent name falls back to agent ID')

    delete process.env.PINPOINT_AGENT_ID
    delete process.env.PINPOINT_APPLICATION_NAME
    delete process.env.PINPOINT_AGENT_NAME
})

test('Agent ID and Application Name multiple errors', (t) => {
    process.env.PINPOINT_AGENT_ID = 'agentIdagentIdagentIdageE' // 25 chars -> too long
    process.env.PINPOINT_APPLICATION_NAME = 'a'.repeat(254) + '?' // 255 chars with invalid char

    const given = namesAndIdsOf(v3Json)
    t.notDeepEqual(errorsOf(given), [], 'config disabled when multiple id/app errors')
    t.ok(errorsOf(given).length >= 2, 'aggregates multiple errors')
    t.equal(errorsOf(given)[0], 'Agent ID is too long (max 24 characters). See https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#3-configuration-with-environment-variables')
    t.equal(errorsOf(given)[1], 'Application Name is too long (max 254 characters). See https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#3-configuration-with-environment-variables')
    t.equal(errorsOf(given)[2], `Application Name has invalid characters; allowed [a-zA-Z0-9._-]. Value: ${'a'.repeat(254)}?. See https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#3-configuration-with-environment-variables`)

    delete process.env.PINPOINT_AGENT_ID
    delete process.env.PINPOINT_APPLICATION_NAME

    t.end()
})


test('ConfigBuilder replaces the v4 names and ids with the final values', (t) => {
    process.env.PINPOINT_APPLICATION_NAME = 'env-app'
    const config = configOf({ agentId: 'node.app', applicationName: 'json-app', serviceName: 'my-svc' })
    delete process.env.PINPOINT_APPLICATION_NAME

    t.match(config.agentId, generatedAgentIdPattern, 'agentId is the generated v4 agentId')
    t.equal(config.agentName, config.agentId, 'agentName falls back to the agentId')
    t.equal(config.applicationName, 'env-app', 'applicationName is the env value')
    t.equal(config.serviceName, 'my-svc', 'serviceName')
    t.equal(config.collector.protocolVersion, 'v4', 'protocolVersion')
    t.equal(config.enable, true, 'valid names and ids keep the agent enabled')
    t.end()
})

test('ConfigBuilder removes serviceName for v3', (t) => {
    const config = configOf({ ...v3Json, agentId: 'agentId', applicationName: 'appName', serviceName: 'my-svc' })

    t.equal(config.agentId, 'agentId', 'v3 agentId is the configured agentId')
    t.equal(config.serviceName, undefined, 'v3 has no serviceName')
    t.equal(config.collector.protocolVersion, 'v3', 'protocolVersion')
    t.end()
})

test('ConfigBuilder disables the agent and appends the names and ids messages after the pinpoint-config.json warns', (t) => {
    const config = new ConfigBuilder({ agentId: 'node.app', applicationName: '~' }).setUserDefinedJson({ messages: { warns: ['pinpoint-config.json warn'] } }).build()

    const link = 'https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#3-configuration-with-environment-variables'
    t.equal(config.enable, false, 'names and ids errors disable the agent')
    t.deepEqual(config.messages.warns, [
        'pinpoint-config.json warn',
        'Agent ID node.app is ignored; collector.protocolVersion v4 always generates the Agent ID. Set collector.protocolVersion to v3 to use a configured Agent ID.',
    ], 'the names and ids warn is appended after the pinpoint-config.json warn')
    t.deepEqual(config.messages.errors, [
        `Application Name has invalid characters; allowed [a-zA-Z0-9._-]. Value: ~. See ${link}`,
        `Service Name is required. See ${link}`,
    ], 'invalid applicationName and missing serviceName')
    t.end()
})

test('non-string names in json are errors instead of crashes', (t) => {
    const given = namesAndIdsOf({ applicationName: 1, serviceName: 123 })

    const link = 'https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#3-configuration-with-environment-variables'
    t.deepEqual(errorsOf(given), [
        `Application Name must be a string. Value: 1. See ${link}`,
        `Service Name must be a string. Value: 123. See ${link}`,
    ], 'non-string applicationName and serviceName are errors')
    t.end()
})

test('non-string agentName in json is an error instead of falling back to agentId', (t) => {
    const given = namesAndIdsOf({ agentName: 123, applicationName: 'appName', serviceName: 'serviceName' })

    t.deepEqual(errorsOf(given), ['Agent Name must be a string. Value: 123. See https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#3-configuration-with-environment-variables'], 'non-string agentName is an error')
    t.end()
})

test('non-string agentId in json is a v3 error and a v4 ignored warn', (t) => {
    const v3 = namesAndIdsOf({ ...v3Json, agentId: 123, applicationName: 'appName' })
    t.deepEqual(errorsOf(v3), ['Agent ID must be a string. Value: 123. See https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#3-configuration-with-environment-variables'], 'v3 non-string agentId is an error')
    t.equal(v3.agentId, 123, 'v3 does not generate an agentId for a non-string agentId')

    const v4 = namesAndIdsOf({ agentId: 123, applicationName: 'appName', serviceName: 'serviceName' })
    t.deepEqual(warnsOf(v4), ['Agent ID 123 is ignored; collector.protocolVersion v4 always generates the Agent ID. Set collector.protocolVersion to v3 to use a configured Agent ID.'], 'v4 warns about the ignored non-string agentId')
    t.match(v4.agentId, generatedAgentIdPattern, 'v4 generates the agentId')
    t.end()
})

test('v4 warns that a configured agentId is ignored', (t) => {
    const given = namesAndIdsOf({ agentId: 'node.app', applicationName: 'appName', serviceName: 'serviceName' })

    t.deepEqual(warnsOf(given), ['Agent ID node.app is ignored; collector.protocolVersion v4 always generates the Agent ID. Set collector.protocolVersion to v3 to use a configured Agent ID.'], 'v4 warns about the ignored agentId')
    t.end()
})

test('v4 does not warn without a configured agentId, and v3 uses it', (t) => {
    const withoutAgentId = namesAndIdsOf({ applicationName: 'appName', serviceName: 'serviceName' })
    t.deepEqual(warnsOf(withoutAgentId), [], 'v4 without agentId has no warns')

    const v3WithAgentId = namesAndIdsOf({ ...v3Json, agentId: 'node.app', applicationName: 'appName' })
    t.deepEqual(warnsOf(v3WithAgentId), [], 'v3 uses the configured agentId without warns')
    t.end()
})

test('PINPOINT_CONTAINER=false follows the container environment detection', (t) => {
    process.env.PINPOINT_CONTAINER = 'false'
    const given = namesAndIdsOf(v3Json)
    delete process.env.PINPOINT_CONTAINER

    t.equal(given.features.container, isContainerEnvironment(), 'PINPOINT_CONTAINER=false does not force container')
    t.end()
})

function namesAndIdsOf(json) {
    return new NamesAndIdsConfigHandler().handle(json)
}

function errorsOf(namesAndIds) {
    return namesAndIds.messages?.errors ?? []
}

function warnsOf(namesAndIds) {
    return namesAndIds.messages?.warns ?? []
}

function configOf(json) {
    return new ConfigBuilder(json).setUserDefinedJson({}).build()
}
