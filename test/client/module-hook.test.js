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
    t.true(agent.moduleHook.hookRegistry.getHooks('http').length > 0, 'Hook for http is registered')

    const http = agent.moduleHook.hookRegistry.getHooks('http')[0]
    t.true(http.endsWith('module/http.js'), 'module http name matches')

    const redis1 = require('redis')
    const redis2 = require('redis')
    t.equal(redis1, redis2, 'Hook modules caches redis')
    t.true(agent.moduleHook.hookRegistry.getHooks('redis').length > 0, 'Hook for redis is registered')

    const redis = agent.moduleHook.hookRegistry.getHooks('redis')[0]
    t.true(redis.endsWith('module/redis.js'), 'module redis hook path matches')

    const koa1 = require('koa-router')
    const koa2 = require('koa-router')
    const koa3 = require('@koa/router')
    t.equal(koa1, koa2, 'Hook modules caches koa')
    t.notEqual(koa2, koa3, 'Hook modules does not cache @koa/router')
    const koaModule = agent.moduleHook.hookRegistry.getHooks('koa-router')[0]
    t.true(koaModule.endsWith('module/koa-router.js'), 'module koa-router hook path matches')
    const koa3Module = agent.moduleHook.hookRegistry.getHooks('@koa/router')[0]
    t.true(koa3Module.endsWith('module/koa-router.js'), 'module @koa/router hook path matches')

    const react = require('react')
    const versionCache = Array.from(agent.moduleHook.versionCache.entries()).find(([key]) => key.endsWith('react'))
    t.true(react, 'react module is loaded')
    t.false(versionCache, 'hook does not cache react module')
    t.end()
})

test('load module with hook', (t) => {
    const dut = agent.moduleHook
    const hooks = dut.hookRegistry.hooks
    t.equal(hooks['@koa/router'].moduleName, '@koa/router', 'Hook for @koa/router is registered')
    t.true(hooks['@koa/router'].hooks[0].endsWith('lib/instrumentation/module/koa-router.js'), 'Hook for @koa/router points to koa-router.js')
    t.end()
})

test('requireId and hook path resolution', (t) => {
    const dut = agent.moduleHook
    const modules = dut.hookRegistry.requireModules()
    t.true(modules.includes('express'), 'express is included in require modules')
    t.true(modules.includes('http'), 'http is included in require modules')
    t.true(modules.includes('koa-router'), 'koa-router is included in require modules')
    t.true(modules.includes('@koa/router'), '@koa/router is included in require modules')
    t.true(modules.includes('redis'), 'redis is included in require modules')
    t.true(modules.includes('ioredis'), 'ioredis is included in require modules')
    t.true(modules.includes('mysql'), 'mysql is included in require modules')
    t.true(modules.includes('mysql2'), 'mysql2 is included in require modules')
    t.true(modules.includes('mongodb'), 'mongodb is included in require modules')
    t.true(modules.includes('pg'), 'pg is included in require modules')
    t.true(modules.includes('undici'), 'undici is included in require modules')
    t.false(modules.includes('next'), 'next is included in require modules')
    t.false(modules.includes('next/dist/server/next-server.js'), 'next/dist/server/next-server.js is not included in require modules')

    t.end()
})
