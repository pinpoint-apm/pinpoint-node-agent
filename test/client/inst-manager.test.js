/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const ModuleHook = require('../../lib/instrumentation/inst-manager')

test('load modules with versions', (t) => {
    const agent = {
        loadedModule: [],
        includedModules: function(name) {
            return !this.loadedModule.includes(name)
        },
        setModules: function(name) {
            this.loadedModule.push(name)
        }
    }
    const moduleHook = new ModuleHook(agent)
    const originLoadModule = moduleHook.loadModule
    let loadModuleCount = {}
    moduleHook.loadModule = (name, agent, m) => {
        if (!loadModuleCount[name]) {
            loadModuleCount[name] = 0
        }
        loadModuleCount[name]++
        originLoadModule.call(name, agent, m)
    }

    const http1 = require('http')
    const http2 = require('http')
    t.equal(http1, http2, 'Hook modules caches http')
    t.equal(loadModuleCount['http'], 1, 'HTTP module hook')

    const redis1 = require('redis')
    const redis2 = require('redis')
    t.equal(redis1, redis2, 'Hook modules caches redis')
    t.equal(loadModuleCount['redis'], 1, 'redis module hook')

    t.end()
})