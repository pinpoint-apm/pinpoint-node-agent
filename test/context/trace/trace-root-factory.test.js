/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const { ConfigBuilder } = require('../../../lib/config-builder')
const TraceRootFactory = require('../../../lib/context/trace/trace-root-factory')
const TraceIdBuilder = require('../../../lib/context/trace/trace-id-builder')

test('TraceRootFactory makes TraceRoots that record the URI template when uriStats is on', (t) => {
    const config = new ConfigBuilder().build()
    const traceRootFactory = new TraceRootFactory(config, Date.now())

    const newTraceRoot = traceRootFactory.newTraceRoot('1')
    const disableTraceRoot = traceRootFactory.newDisableTraceRoot('2')
    const continueTraceRoot = traceRootFactory.continueTraceRoot(new TraceIdBuilder(config.getAgentId(), Date.now(), '9').build(), '3')
    newTraceRoot.getShared().setUriTemplate('/users/:id', false)
    disableTraceRoot.getShared().setUriTemplate('/users/:id', false)
    continueTraceRoot.getShared().setUriTemplate('/users/:id', false)

    t.equal(newTraceRoot.getEnricher('uriStats.uriTemplate'), '/users/:id', 'a new TraceRoot records the URI template')
    t.equal(disableTraceRoot.getEnricher('uriStats.uriTemplate'), '/users/:id', 'an unsampled TraceRoot records the URI template')
    t.equal(continueTraceRoot.getEnricher('uriStats.uriTemplate'), '/users/:id', 'a continued TraceRoot records the URI template')
    t.end()
})

test('TraceRootFactory makes TraceRoots that record no URI template when uriStats is off', (t) => {
    process.env.PINPOINT_FEATURES_URI_STATS = 'false'
    t.teardown(() => delete process.env.PINPOINT_FEATURES_URI_STATS)
    const config = new ConfigBuilder().build()
    const traceRootFactory = new TraceRootFactory(config, Date.now())

    const newTraceRoot = traceRootFactory.newTraceRoot('1')
    const disableTraceRoot = traceRootFactory.newDisableTraceRoot('2')
    const continueTraceRoot = traceRootFactory.continueTraceRoot(new TraceIdBuilder(config.getAgentId(), Date.now(), '9').build(), '3')
    newTraceRoot.getShared().setUriTemplate('/users/:id', false)
    disableTraceRoot.getShared().setUriTemplate('/users/:id', false)
    continueTraceRoot.getShared().setUriTemplate('/users/:id', false)

    t.equal(newTraceRoot.getEnricher('uriStats.uriTemplate'), undefined, 'a new TraceRoot records no URI template')
    t.equal(disableTraceRoot.getEnricher('uriStats.uriTemplate'), undefined, 'an unsampled TraceRoot records no URI template')
    t.equal(continueTraceRoot.getEnricher('uriStats.uriTemplate'), undefined, 'a continued TraceRoot records no URI template')
    t.end()
})
