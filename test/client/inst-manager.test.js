/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */


const test = require('tape')
const { log } = require('../test-helper')
const instManager = require('../../lib/instrumentation/inst-manager')
const rewire = require('rewire')

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
    instManager.init(agent)

    t.end()
})