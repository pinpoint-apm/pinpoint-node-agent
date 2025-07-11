/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { Hook } = require('require-in-the-middle')
const { undiciHook } = require('./module/undici')
const log = require('../utils/logger')
const path = require('path')

const modules = [
    'express',
    'http',
    'https',
    'koa-router',
    { requireId: '@koa/router', hook: './module/koa-router.js' },
    'redis',
    'ioredis',
    'mysql',
    'mysql2',
    'mongodb',
    'pg',
    'undici',
]

class ModuleHook {
    constructor(agent) {
        this.agent = agent
        this.hookRegistry = new HookRegistry()
    }

    start() {
        for (const module of modules) {
            let requireId, hook, moduleName
            if (typeof module === 'string') {
                requireId = module
                hook = path.resolve(__dirname, 'module', requireId + (requireId.endsWith('.js') ? '' : '.js'))
            }
            this.hookRegistry.registry(requireId, hook, moduleName)
        }
        this.hook = new Hook(modules, function (exports, requireId, basedir) {
            return exports
        })
    }
}

class HookRegistry {
    constructor() {
        this.hooks = []
    }

    /**
     * Add a hook to the registry.
     *
     * @param {string} requireId https://nodejs.org/api/modules.html#requireid
     * @param {Function} hook
     * @param {string} moduleName
     */
    registry(requireId, hook, moduleName) {
        if (!(requireId in this.hooks)) {
            this.hooks[requireId] = {
                hooks: [hook],
                moduleName: moduleName ?? this.moduleNameFromRequireId(requireId),
            }
        } else {
            const hook = this.hooks[requireId]
            if (moduleName && moduleName !== hook.moduleName) {
                log.error(`Module name mismatch for ${requireId}: expected ${hook.moduleName}, got ${moduleName}`)
                return
            }
            hook.hooks.push(hook)
        }
    }

    /**
     * Get hooks for a specific requireId.
     *
     * @param {string} requireId https://nodejs.org/api/modules.html#requireid
     * @returns {string} moduleName
     * requireId                          moduleName
     * ---------                          ------------
     * mongodb                            mongodb
     * mongodb/lib/foo.js                 mongodb
     * @elastic/elasticsearch             @elastic/elasticsearch
     * @redis/client/dist/lib/client.js   @redis/client
     */
    moduleNameFromRequireId(requireId) {
        if (requireId.startsWith('/')) {
            return requireId
        } else if (requireId.startsWith('@')) {
            return requireId.split('/', 2).join('/')
        } else {
            return requireId.split('/', 1)[0]
        }
    }
}

module.exports = {
    ModuleHook
}