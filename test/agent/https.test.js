/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const ModuleHook = require('../../lib/instrumentation/inst-manager')

test('initialize https module', (t) => {
    const agent = {
        modules: [],
        includedModules: function(name) {
            this.modules.push(name)
        },
        setModules: function(name) {

        }
    }

    const moduleHook = new ModuleHook(agent)
    
    var loadModule = moduleHook.loadModule
    loadModule('https', agent)
    loadModule('kmkm', agent)
    t.true(agent.modules.includes('https'), 'https module contains load module')
    t.equal(agent.modules.length, 1, 'module shuld be registed')

    t.end()
})