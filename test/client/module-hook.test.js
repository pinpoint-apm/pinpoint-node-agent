/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const agent = require('../support/agent-singleton-mock')
const { ModuleHook } = require('../../lib/instrumentation/module-hook')

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
    t.equal(koa1, koa2, 'Hook modules caches koa')
    const koaModule = agent.moduleHook.hookRegistry.getHooks('koa-router')[0]
    t.true(koaModule.endsWith('module/koa-router.js'), 'module koa-router hook path matches')

    t.end()
})

test.skip('load module with hook', (t) => {
    const dut = agent.moduleHook2
    const hooks = dut.hookRegistry.hooks
    t.equal(hooks['@koa/router'].moduleName, '@koa/router', 'Hook for @koa/router is registered')
    t.true(hooks['@koa/router'].hooks[0].endsWith('lib/instrumentation/module/koa-router.js'), 'Hook for @koa/router points to koa-router.js')
    t.equal(hooks['next'].moduleName, 'next', 'Hook for next is registered')
    t.true(hooks['next'].hooks[0].endsWith('lib/instrumentation/module/next.js'), 'Hook for next points to next.js')
    t.equal(hooks['next/dist/server/next-server.js'].moduleName, 'next', 'Hook for next/dist/server/next-server.js is registered')
    t.true(hooks['next/dist/server/next-server.js'].hooks[0].endsWith('lib/instrumentation/module/next/dist/server/next-server.js'), 'Hook for next/dist/server/next-server.js points to next-server.js')
    t.end()
})

test.skip('requireId and hook path resolution', (t) => {
    const dut = agent.moduleHook2
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
    t.true(modules.includes('next'), 'next is included in require modules')
    t.false(modules.includes('next/dist/server/next-server.js'), 'next/dist/server/next-server.js is not included in require modules')
    t.equal(dut.hookRegistry.hooks['next/dist/server/next-server.js'].moduleName, 'next', 'next/dist/server/next-server.js module name matches')
    t.true(dut.hookRegistry.hooks['next/dist/server/next-server.js'].hooks[0].endsWith('lib/instrumentation/module/next/dist/server/next-server.js'), 'next/dist/server/next-server.js hook path matches')

    const requireHook = dut.requireHook
    dut.stop()
    t.true(requireHook._unhooked, 'requireHook is unhooked after stop')
    t.end()
})

test.skip('hook next.js internals', (t) => {
    const dut = agent.moduleHook2
    dut.stop()
    t.end()
})