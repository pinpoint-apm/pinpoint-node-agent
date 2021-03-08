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
    t.false(agent.moduleHook.needLoadModules('http'), 'needLoadModules(http) is false')

    const http = agent.moduleHook.moduleObj('http')
    t.equal(http.name, 'http', 'module http name matches')
    t.equal(http.version, process.versions.node, 'module http version matches with node version')

    const redis1 = require('redis')
    const redis2 = require('redis')
    t.equal(redis1, redis2, 'Hook modules caches redis')
    t.false(agent.moduleHook.needLoadModules('redis'), 'needLoadModules(redis) is false')

    const redis = agent.moduleHook.moduleObj('redis')
    t.equal(redis.name, 'redis', 'module redis name matches')
    t.equal(redis.version, '2.8.0', 'module redis version matches with package dependency version')

    t.end()
})