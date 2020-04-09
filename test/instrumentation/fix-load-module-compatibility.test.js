'use strict'

const test = require('tape')
const mockAgent = require('../support/agent-singleton-mock')
const Hook = require('require-in-the-middle')

test(`hook.unhook() for require-in-the-middle learning test`, (t) => {
    t.plan(0)

    const hook = Hook(['http'], function (exports, name, basedir) {
        t.fail('should no call')
    })
    hook.unhook()
    require('http')
    t.end()
})