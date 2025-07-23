/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const { Hook } = require('require-in-the-middle')
const Module = require('module')

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

test('monkey-patched require', function (t) {
    Module.prototype.require = new Proxy(Module.prototype.require, {
        apply(target, thisArg, argArray) {
            if (argArray[0] === '@testcontainers/postgresql') {
                return {
                    version: '1.0.0'
                }
            } else {
                return Reflect.apply(target, thisArg, argArray)
            }
        }
    })

    const postgresql = require('@testcontainers/postgresql')
    t.equal(postgresql.version, '1.0.0', 'version is patched')
    t.end()
})

test('process.getBuiltinModule should be patched', { skip: typeof process.getBuiltinModule !== 'function' }, function (t) {
    let numOnRequireCalls = 0

    const hook = new Hook(['http'], function (exports, name, basedir) {
        numOnRequireCalls++
        return exports
    })

    const a = process.getBuiltinModule('http')
    t.equal(numOnRequireCalls, 1)

    const b = require('http')
    t.equal(numOnRequireCalls, 1)

    t.strictEqual(a, b, 'modules are the same')
    t.end()
    hook.unhook()
})

test('hook internal API', function (t) {
    let numOnRequireCalls = 0
    const hook = new Hook(['next', 'next/dist/server/next-server.js'], (exports, name, basedir) => {
        exports.hookName = name
        numOnRequireCalls++
        return exports
    })
    const next = require('next')
    t.equal(numOnRequireCalls, 1)
    t.equal(next.hookName, 'next', 'hookName is set')

    const nextServer = require('next/dist/server/next-server.js')
    t.equal(numOnRequireCalls, 2)
    t.equal(nextServer.hookName, 'next/dist/server/next-server.js', 'hookName is set')
    t.end()
    hook.unhook()
})