/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const TraceRootBuilder = require('../../../lib/context/trace-root-builder')
const { UriStatsConfigBuilder } = require('../../../lib/metric/uri/uri-stats-config-builder')
const { UriStatsShared, emptyUriStatsShared } = require('../../../lib/metric/uri/uri-stats-shared')

test('UriStatsShared keeps the first route URI template of a request', (t) => {
    const traceRoot = new TraceRootBuilder('agent', 1).setUriStatsShared(new UriStatsShared(uriStatsConfig({ httpMethod: true, useUserInput: true }))).build()

    traceRoot.getShared().setUriTemplate('/users/:id', false)
    traceRoot.getShared().setUriTemplate('/users', false)

    t.equal(traceRoot.getEnricher('uriStats.uriTemplate'), '/users/:id', 'a later route URI template does not replace the first one')
    t.end()
})

test('UriStatsShared lets the user input URI template replace the route URI template when useUserInput is on', (t) => {
    const traceRoot = new TraceRootBuilder('agent', 1).setUriStatsShared(new UriStatsShared(uriStatsConfig({ useUserInput: true }))).build()

    traceRoot.getShared().setUriTemplate('/users/:id', false)
    traceRoot.getShared().setUriTemplate('/user/input', true)

    t.equal(traceRoot.getEnricher('uriStats.uriTemplate'), '/user/input', 'the user input URI template replaces the route URI template')
    t.end()
})

test('UriStatsShared ignores the user input URI template when useUserInput is off', (t) => {
    const traceRoot = new TraceRootBuilder('agent', 1).setUriStatsShared(new UriStatsShared(uriStatsConfig({ useUserInput: false }))).build()

    traceRoot.getShared().setUriTemplate('/users/:id', false)
    traceRoot.getShared().setUriTemplate('/user/input', true)

    t.equal(traceRoot.getEnricher('uriStats.uriTemplate'), '/users/:id', 'the route URI template stays')
    t.end()
})

test('UriStatsShared ignores an empty or missing URI template', (t) => {
    const traceRoot = new TraceRootBuilder('agent', 1).setUriStatsShared(new UriStatsShared(uriStatsConfig({ useUserInput: true }))).build()

    traceRoot.getShared().setUriTemplate('', false)
    traceRoot.getShared().setUriTemplate(undefined, true)

    t.equal(traceRoot.getEnricher('uriStats.uriTemplate'), undefined, 'no URI template is recorded')
    t.end()
})

test('UriStatsShared records the HTTP method when httpMethod is on', (t) => {
    const traceRoot = new TraceRootBuilder('agent', 1).setUriStatsShared(new UriStatsShared(uriStatsConfig({ httpMethod: true }))).build()

    traceRoot.getShared().setUriHttpMethod('GET')

    t.equal(traceRoot.getEnricher('uriStats.method'), 'GET', 'the HTTP method is recorded')
    t.end()
})

test('UriStatsShared does not record the HTTP method when httpMethod is off', (t) => {
    const traceRoot = new TraceRootBuilder('agent', 1).setUriStatsShared(new UriStatsShared(uriStatsConfig({ httpMethod: false }))).build()

    traceRoot.getShared().setUriHttpMethod('GET')

    t.equal(traceRoot.getEnricher('uriStats.method'), undefined, 'no HTTP method is recorded')
    t.end()
})

test('emptyUriStatsShared records neither a URI template nor an HTTP method', (t) => {
    const traceRoot = new TraceRootBuilder('agent', 1).setUriStatsShared(emptyUriStatsShared).build()

    traceRoot.getShared().setUriTemplate('/users/:id', false)
    traceRoot.getShared().setUriTemplate('/user/input', true)
    traceRoot.getShared().setUriHttpMethod('GET')

    t.equal(traceRoot.getEnricher('uriStats.uriTemplate'), undefined, 'no URI template is recorded')
    t.equal(traceRoot.getEnricher('uriStats.method'), undefined, 'no HTTP method is recorded')
    t.end()
})

test('a TraceRoot built without UriStatsShared records no URI template', (t) => {
    const traceRoot = new TraceRootBuilder('agent', 1).build()

    traceRoot.getShared().setUriTemplate('/users/:id', false)

    t.equal(traceRoot.getEnricher('uriStats.uriTemplate'), undefined, 'the TraceRoot uses emptyUriStatsShared')
    t.end()
})

function uriStatsConfig(uriStats) {
    return new UriStatsConfigBuilder({ features: { uriStats } }).build()
}
