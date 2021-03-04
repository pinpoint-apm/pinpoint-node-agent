/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const rewire = require('rewire')
const instManager = rewire('../../lib/instrumentation/inst-manager')

test('initialize https module', (t) => {
    const agent = {
        modules: [],
        includedModules: function(name) {
            this.modules.push(name)
        },
        setModules: function(name) {

        }
    }

    instManager.init(agent)
    
    var loadModule = instManager.__get__('loadModule')
    loadModule('https', agent)
    loadModule('kmkm', agent)
    t.true(agent.modules.includes('https'), 'https module contains load module')
    t.equal(agent.modules.length, 1, 'module shuld be registed')

    t.end()
})