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

const generatedAgentIdPattern = /^[A-Za-z0-9_-]{22}$/
const v3Json = { collector: { protocolVersion: 'v3' } }

test('collector.protocolVersion from json config', (t) => {
    let actual = handleNamesAndIds({ collector: {} })
    t.equal(actual.collector.protocolVersion, 'v4', 'no protocolVersion defaults to v4')

    actual = handleNamesAndIds({ collector: { protocolVersion: 'v3' } })
    t.equal(actual.collector.protocolVersion, 'v3', 'v3 is v3')

    actual = handleNamesAndIds({ collector: { protocolVersion: 'V3' } })
    t.equal(actual.collector.protocolVersion, 'v3', 'V3 is case-insensitive v3')
    t.end()
})

test('PINPOINT_PROTOCOL_VERSION overrides json config', (t) => {
    process.env.PINPOINT_PROTOCOL_VERSION = 'V3'
    let actual = handleNamesAndIds({ collector: { protocolVersion: 'v4' } })
    t.equal(actual.collector.protocolVersion, 'v3', 'env V3 overrides json v4')

    process.env.PINPOINT_PROTOCOL_VERSION = 'v4'
    actual = handleNamesAndIds({ collector: { protocolVersion: 'v3' } })
    t.equal(actual.collector.protocolVersion, 'v4', 'env v4 overrides json v3')
    delete process.env.PINPOINT_PROTOCOL_VERSION
    t.end()
})

test('v4 without serviceName has an error', (t) => {
    const given = handleNamesAndIds({ applicationName: 'appName' })

    t.equal(given.collector.protocolVersion, 'v4', 'default version is v4')
    t.deepEqual(readErrors(given), ['Service Name is required. See https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#agent-identification-v4-and-v3'], 'serviceName is required for v4')
    t.end()
})

test('v4 serviceName from 3 to 254 characters with [a-zA-Z0-9._-]', (t) => {
    const tooShort = handleNamesAndIds({ applicationName: 'appName', serviceName: 'ab' })
    t.deepEqual(readErrors(tooShort), ['Service Name is too short (min 3 characters). See https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#agent-identification-v4-and-v3'], '2 characters serviceName is too short')
    t.equal(tooShort.enable, false, 'too short serviceName disables the agent')

    const minLength = handleNamesAndIds({ applicationName: 'appName', serviceName: 'abc' })
    t.deepEqual(readErrors(minLength), [], '3 characters serviceName is valid')

    const maxLength = handleNamesAndIds({ applicationName: 'appName', serviceName: 'a'.repeat(254) })
    t.deepEqual(readErrors(maxLength), [], '254 characters serviceName is valid')
    t.equal(maxLength.serviceName, 'a'.repeat(254), 'serviceName is kept')

    const tooLong = handleNamesAndIds({ applicationName: 'appName', serviceName: 'a'.repeat(255) })
    t.deepEqual(readErrors(tooLong), ['Service Name is too long (max 254 characters). See https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#agent-identification-v4-and-v3'], '255 characters serviceName is too long')

    const invalid = handleNamesAndIds({ applicationName: 'appName', serviceName: '~~~' })
    t.deepEqual(readErrors(invalid), ['Service Name has invalid characters; allowed [a-zA-Z0-9._-]. Value: ~~~. See https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#agent-identification-v4-and-v3'], 'invalid characters in serviceName')
    t.end()
})

test('v3 ignores serviceName', (t) => {
    const withoutServiceName = handleNamesAndIds({ ...v3Json, applicationName: 'appName' })
    t.deepEqual(readErrors(withoutServiceName), [], 'v3 does not require serviceName')

    const invalidServiceName = handleNamesAndIds({ ...v3Json, applicationName: 'appName', serviceName: '~' })
    t.deepEqual(readErrors(invalidServiceName), [], 'v3 does not validate serviceName')
    t.end()
})

test('PINPOINT_SERVICE_NAME overrides json serviceName', (t) => {
    process.env.PINPOINT_SERVICE_NAME = 'service-from-env'
    const given = handleNamesAndIds({ applicationName: 'appName', serviceName: 'service-from-json' })
    delete process.env.PINPOINT_SERVICE_NAME

    t.equal(given.serviceName, 'service-from-env', 'env overrides json')
    t.end()
})

test('v4 ignores the configured agentId and always generates one', (t) => {
    const byJson = handleNamesAndIds({ agentId: 'agentId', applicationName: 'appName', serviceName: 'serviceName' })
    t.notEqual(byJson.agentId, 'agentId', 'v4 ignores json agentId')
    t.match(byJson.agentId, generatedAgentIdPattern, 'v4 agentId is a 22-char base64 UUIDv7')

    process.env.PINPOINT_AGENT_ID = 'agentIdagentIdagentIdageE'
    const byEnv = handleNamesAndIds({ applicationName: 'appName', serviceName: 'serviceName' })
    delete process.env.PINPOINT_AGENT_ID
    t.match(byEnv.agentId, generatedAgentIdPattern, 'v4 ignores PINPOINT_AGENT_ID')
    t.deepEqual(readErrors(byEnv), [], 'v4 does not validate the ignored agentId')
    t.end()
})

test('v4 agentName up to 254 characters', (t) => {
    const maxLength = handleNamesAndIds({ agentName: 'a'.repeat(254), applicationName: 'appName', serviceName: 'serviceName' })
    t.deepEqual(readErrors(maxLength), [], '254 characters agentName is valid')

    const tooLong = handleNamesAndIds({ agentName: 'a'.repeat(255), applicationName: 'appName', serviceName: 'serviceName' })
    t.deepEqual(readErrors(tooLong), ['Agent Name is too long (max 254 characters). See https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#agent-identification-v4-and-v3'], '255 characters agentName is too long for v4')
    t.end()
})

test('agentName falls back to agentId', (t) => {
    const v4WithoutAgentName = handleNamesAndIds({ applicationName: 'appName', serviceName: 'serviceName' })
    t.equal(v4WithoutAgentName.agentName, v4WithoutAgentName.agentId, 'v4 without agentName uses the generated agentId')

    const v4WithAgentName = handleNamesAndIds({ agentName: 'agentName', applicationName: 'appName', serviceName: 'serviceName' })
    t.equal(v4WithAgentName.agentName, 'agentName', 'v4 with agentName uses agentName')

    const v3WithoutAgentName = handleNamesAndIds({ ...v3Json, agentId: 'agentId', applicationName: 'appName' })
    t.equal(v3WithoutAgentName.agentName, 'agentId', 'v3 without agentName uses agentId')

    const v3EmptyAgentName = handleNamesAndIds({ ...v3Json, agentId: 'agentId', agentName: '', applicationName: 'appName' })
    t.deepEqual(readErrors(v3EmptyAgentName), [], 'empty agentName is allowed')
    t.equal(v3EmptyAgentName.agentName, 'agentId', 'v3 with an empty agentName uses agentId')
    t.end()
})

test('PINPOINT_CONTAINER true and json features.container true mark the container', (t) => {
    process.env.PINPOINT_CONTAINER = 'true'
    const byEnv = handleNamesAndIds(v3Json)
    delete process.env.PINPOINT_CONTAINER
    t.true(byEnv.features.container, 'PINPOINT_CONTAINER true')

    const byJson = handleNamesAndIds({ ...v3Json, features: { container: true } })
    t.true(byJson.features.container, 'json features.container true')
    t.end()
})

test('KUBERNETES_SERVICE_HOST is detected as a container', (t) => {
    process.env.KUBERNETES_SERVICE_HOST = 'aaa'
    const given = handleNamesAndIds(v3Json)
    delete process.env.KUBERNETES_SERVICE_HOST

    t.true(given.features.container, 'Kubernetes environment is a container')
    t.end()
})

test('PINPOINT_AGENT_ID overrides json agentId', function (t) {
    t.plan(1)

    process.env.PINPOINT_AGENT_ID = 'id-from-env'

    const conf = handleNamesAndIds({ ...v3Json, agentId: 'id-from-json' })
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
test('v3 Agent ID up to 24, Application Name up to 254 and Agent Name up to 255 characters', (t) => {
    const maxLength = handleNamesAndIds({ ...v3Json, agentId: 'a'.repeat(24), applicationName: 'a'.repeat(254), agentName: 'a'.repeat(255) })
    t.deepEqual(readErrors(maxLength), [], 'max length agentId, applicationName and agentName are valid')

    const tooLong = handleNamesAndIds({ ...v3Json, agentId: 'a'.repeat(25), applicationName: 'a'.repeat(255), agentName: 'a'.repeat(256) })
    const link = 'https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#agent-identification-v4-and-v3'
    t.deepEqual(readErrors(tooLong), [
        `Agent ID is too long (max 24 characters). See ${link}`,
        `Application Name is too long (max 254 characters). See ${link}`,
        `Agent Name is too long (max 255 characters). See ${link}`,
    ], 'one character over the max length is too long')
    t.end()
})

test('v3 without agentId generates one', (t) => {
    const given = handleNamesAndIds({ ...v3Json, applicationName: 'appName' })

    t.deepEqual(readErrors(given), [], 'agentId is optional')
    t.match(given.agentId, generatedAgentIdPattern, 'generated agentId is a 22-char base64 UUIDv7')
    t.end()
})

test('ConfigBuilder replaces the v4 names and ids with the final values', (t) => {
    process.env.PINPOINT_APPLICATION_NAME = 'env-app'
    const config = buildConfig({ agentId: 'node.app', applicationName: 'json-app', serviceName: 'my-svc' })
    delete process.env.PINPOINT_APPLICATION_NAME

    t.match(config.agentId, generatedAgentIdPattern, 'agentId is the generated v4 agentId')
    t.equal(config.agentName, config.agentId, 'agentName falls back to the agentId')
    t.equal(config.applicationName, 'env-app', 'applicationName is the env value')
    t.equal(config.serviceName, 'my-svc', 'serviceName')
    t.equal(config.collector.protocolVersion, 'v4', 'protocolVersion')
    t.equal(config.enable, true, 'valid names and ids keep the agent enabled')
    t.end()
})

test('ConfigBuilder disables the agent and appends the names and ids messages after the pinpoint-config.json warns', (t) => {
    const config = new ConfigBuilder({ agentId: 'node.app', applicationName: '~' }).setUserDefinedJson({ messages: { warns: ['pinpoint-config.json warn'] } }).build()

    const link = 'https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#agent-identification-v4-and-v3'
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
    const given = handleNamesAndIds({ applicationName: 1, serviceName: 123 })

    const link = 'https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#agent-identification-v4-and-v3'
    t.deepEqual(readErrors(given), [
        `Application Name must be a string. Value: 1. See ${link}`,
        `Service Name must be a string. Value: 123. See ${link}`,
    ], 'non-string applicationName and serviceName are errors')
    t.end()
})

test('non-string agentName in json is an error instead of falling back to agentId', (t) => {
    const given = handleNamesAndIds({ agentName: 123, applicationName: 'appName', serviceName: 'serviceName' })

    t.deepEqual(readErrors(given), ['Agent Name must be a string. Value: 123. See https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#agent-identification-v4-and-v3'], 'non-string agentName is an error')
    t.end()
})

test('non-string agentId in json is a v3 error and a v4 ignored warn', (t) => {
    const v3 = handleNamesAndIds({ ...v3Json, agentId: 123, applicationName: 'appName' })
    t.deepEqual(readErrors(v3), ['Agent ID must be a string. Value: 123. See https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#agent-identification-v4-and-v3'], 'v3 non-string agentId is an error')
    t.equal(v3.agentId, 123, 'v3 does not generate an agentId for a non-string agentId')

    const v4 = handleNamesAndIds({ agentId: 123, applicationName: 'appName', serviceName: 'serviceName' })
    t.deepEqual(readWarns(v4), ['Agent ID 123 is ignored; collector.protocolVersion v4 always generates the Agent ID. Set collector.protocolVersion to v3 to use a configured Agent ID.'], 'v4 warns about the ignored non-string agentId')
    t.match(v4.agentId, generatedAgentIdPattern, 'v4 generates the agentId')
    t.end()
})

test('v4 does not warn without a configured agentId, and v3 uses it', (t) => {
    const withoutAgentId = handleNamesAndIds({ applicationName: 'appName', serviceName: 'serviceName' })
    t.deepEqual(readWarns(withoutAgentId), [], 'v4 without agentId has no warns')

    const v3WithAgentId = handleNamesAndIds({ ...v3Json, agentId: 'node.app', applicationName: 'appName' })
    t.deepEqual(readWarns(v3WithAgentId), [], 'v3 uses the configured agentId without warns')
    t.end()
})

test('PINPOINT_CONTAINER=false follows the container environment detection', (t) => {
    process.env.PINPOINT_CONTAINER = 'false'
    const given = handleNamesAndIds(v3Json)
    delete process.env.PINPOINT_CONTAINER

    t.equal(given.features.container, isContainerEnvironment(), 'PINPOINT_CONTAINER=false does not force container')
    t.end()
})

function handleNamesAndIds(json) {
    return new NamesAndIdsConfigHandler().handle(json)
}

function readErrors(namesAndIds) {
    return namesAndIds.messages?.errors ?? []
}

function readWarns(namesAndIds) {
    return namesAndIds.messages?.warns ?? []
}

function buildConfig(json) {
    return new ConfigBuilder(json).setUserDefinedJson({}).build()
}
