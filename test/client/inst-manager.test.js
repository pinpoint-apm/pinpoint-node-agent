/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const agent = require('../support/agent-singleton-mock')

test('load modules with versions', (t) => {
    const http1 = require('http')
    const http2 = require('http')
    t.equal(http1, http2, 'Hook modules caches http')
    t.true(agent.moduleHook.isLoadedModule('http'), 'isLoadedModule(http) is true')
    t.false(agent.moduleHook.needLoadModules('http'), 'needLoadModules(http) is false')

    const redis1 = require('redis')
    const redis2 = require('redis')
    t.equal(redis1, redis2, 'Hook modules caches redis')
    t.true(agent.moduleHook.isLoadedModule('redis'), 'isLoadedModule(redis) is true')
    t.false(agent.moduleHook.needLoadModules('redis'), 'needLoadModules(redis) is false')

    t.end()
})