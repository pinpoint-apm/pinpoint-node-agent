/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const rewire = require('rewire')
const instManager = rewire('../../lib/instrumentation/inst-manager')

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

    const modules = instManager.__get__('MODULES')
    t.equal(modules.length, 9, 'the numbers of support modules are 9')

    instManager.init(agent)

    t.end()
})