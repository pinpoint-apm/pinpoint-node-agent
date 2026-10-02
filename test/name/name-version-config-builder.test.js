/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const grpc = require('@grpc/grpc-js')
const services = require('../../lib/data/v1/Service_grpc_pb')
const spanMessages = require('../../lib/data/v1/Span_pb')
const makeAgentInformationMetadataInterceptor = require('../../lib/client/interceptor/make-agent-information-metadata-interceptor')
const { ConfigBuilder } = require('../../lib/config-builder')
const AgentInfo = require('../../lib/data/dto/agent-info')
const { NameVersionConfigBuilder } = require('../../lib/name/name-version-config-builder')

function configOf(json) {
    return new ConfigBuilder(Object.assign({ agentId: 'agentId', applicationName: 'appName' }, json)).setUserDefinedJson({}).build()
}

test('uid version from json config', (t) => {
    const cases = [
        [undefined, 'v4', '400'],
        ['V3', 'v3', '100'],
        ['v3', 'v3', '100'],
        ['v4', 'v4', '400'],
        ['x', 'v4', '400'],
        ['', 'v4', '400'],
    ]
    for (const [given, version, protocolVersion] of cases) {
        const json = given === undefined ? {} : { uidVersion: given }
        const actual = new NameVersionConfigBuilder(configOf(json)).build()
        t.equal(actual.getVersion(), version, `json ${JSON.stringify(given)} → ${version}`)
        t.equal(actual.getProtocolVersion(), protocolVersion, `json ${JSON.stringify(given)} → protocol.version ${protocolVersion}`)
    }
    t.end()
})

test('uid version from env overrides json config', (t) => {
    process.env.PINPOINT_UID_VERSION = 'V3'
    let actual = new NameVersionConfigBuilder(configOf({ uidVersion: 'v4' })).build()
    t.equal(actual.getVersion(), 'v3', 'env V3 overrides json v4')

    process.env.PINPOINT_UID_VERSION = 'v4'
    actual = new NameVersionConfigBuilder(configOf({ uidVersion: 'v3' })).build()
    t.equal(actual.getVersion(), 'v4', 'env v4 overrides json v3')
    delete process.env.PINPOINT_UID_VERSION
    t.end()
})

test('applicationName up to 254 characters regardless of uid version', (t) => {
    for (const version of ['v3', 'v4']) {
        let given = configOf({ applicationName: 'a'.repeat(254), uidVersion: version })
        t.true(given.enable, `${version}: 254 characters applicationName is enabled`)

        given = configOf({ applicationName: 'a'.repeat(255), uidVersion: version })
        t.false(given.enable, `${version}: 255 characters applicationName disables agent`)
    }
    t.end()
})

test('collector receives protocol.version metadata per uid version', (t) => {
    const received = []
    const server = new grpc.Server()
    server.addService(services.MetadataService, {
        requestApiMetaData: (call, callback) => {
            received.push(call.metadata.get('protocol.version'))
            const result = new spanMessages.PResult()
            result.setSuccess(true)
            callback(null, result)
        }
    })
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
        const request = (version) => new Promise((resolve, reject) => {
            const config = configOf({ uidVersion: version })
            const agentInfo = AgentInfo.make(config, new NameVersionConfigBuilder(config).build())
            const client = new services.MetadataClient(`localhost:${port}`, grpc.credentials.createInsecure(), {
                interceptors: [makeAgentInformationMetadataInterceptor(agentInfo)]
            })
            client.requestApiMetaData(new spanMessages.PApiMetaData(), (err) => {
                client.close()
                err ? reject(err) : resolve()
            })
        })

        request('v3')
            .then(() => request('v4'))
            .then(() => {
                t.deepEqual(received[0], ['100'], 'v3 sends protocol.version 100')
                t.deepEqual(received[1], ['400'], 'v4 sends protocol.version 400')
            })
            .catch((err) => t.fail(err))
            .finally(() => {
                server.forceShutdown()
                t.end()
            })
    })
})
