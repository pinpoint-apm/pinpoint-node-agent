/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const { Hook } = require('require-in-the-middle')

test(`hook.unhook() for require-in-the-middle learning test`, (t) => {
    const hook = Hook(['http'], function (exports, name, basedir) {
        t.fail('should no call')
    })
    hook.unhook()
    require('http')
    t.end()
})

test(`all modules for require-in-the-middle learning test`, (t) => {
    t.plan(6)

    let n = 1

    const hook = new Hook(function (exports, name, basedir) {
        switch (n) {
            case 1:
                t.equal(name, 'http')
                break
            case 2:
                t.equal(name, 'net')
                break
            default:
                t.ok(false)
        }

        exports.foo = n++

        return exports
    })

    t.on('end', function () {
        hook.unhook()
    })

    const http = require('http')
    const net = require('net')

    t.equal(http.foo, 1)
    t.equal(net.foo, 2)
    t.equal(require('http').foo, 1)
    t.equal(n, 3)
})
