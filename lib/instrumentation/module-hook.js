/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { Hook } = require('require-in-the-middle')
const { undiciHook } = require('./module/undici')
const log = require('../utils/log/logger')
const path = require('path')
const fs = require('fs')

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
        this.versionCache = new Map()
    }

    start() {
        for (const module of modules) {
            let requireId, hook
            if (module.hook) {
                requireId = module.requireId
                hook = path.resolve(__dirname, module.hook)
            } else {
                requireId = module.requireId ?? typeof module === 'string' ? module : null
                if (!requireId) {
                    log.error(`Invalid module configuration: ${module}`)
                    continue
                }
                hook = path.resolve(__dirname, 'module', requireId + (requireId.endsWith('.js') ? '' : '.js'))
            }

            this.hookRegistry.registry(requireId, hook, module.moduleName)
        }

        this.requireHook = new Hook(this.hookRegistry.requireModules(), (exports, requireId, basedir) => {
            requireId = this.normalizePathSeparators(requireId)

            let version
            if (!basedir) {
                version = process.versions.node
            } else {
                version = this.getPackageVersion(basedir)
                if (version === undefined) {
                    log.warn(`Could not determine version for module: ${requireId} in basedir: ${basedir}`)
                    return exports
                }
            }

            return this.hookModule(exports, requireId, version)
        })

        if (typeof undiciHook.instrument === 'function') {
            undiciHook.instrument(this.agent)
        }
    }

    normalizePathSeparators(requireId) {
        return path.sep !== '/' ? requireId.split(path.sep).join('/') : requireId
    }

    getPackageVersion(basedir) {
        if (this.versionCache.has(basedir)) {
            return this.versionCache.get(basedir)
        }

        try {
            const version = JSON.parse(fs.readFileSync(path.join(basedir, 'package.json'))).version
            if (typeof version !== 'string') {
                throw new Error(`Invalid version type for module in basedir: ${basedir}`)
            }
            this.versionCache.set(basedir, version)
            return version
        } catch (error) {
            log.error(`Failed to read package.json in basedir: ${basedir}`, error)
            return undefined
        }
    }

    hookModule(exports, requireId, version) {
        const hooks = this.hookRegistry.getHooks(requireId)
        for (let hook of hooks) {
            if (typeof hook === 'string') {
                if (hook[0] === '/') {
                    hook = path.resolve(process.cwd(), hook)
                }
                hook = require(hook)
            }

            if (typeof hook !== 'function') {
                log.error(`Hook for ${requireId} is not a function:`, hook)
                continue
            }

            hook(this.agent, version, exports)
        }
        return exports
    }

    stop() {
        this.requireHook?.unhook()
        this.requireHook = null
        undiciHook.cancelInstrumentUndici()
    }
}

class HookRegistry {
    constructor() {
        this.hooks = {}
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

    requireModules() {
        const modules = new Set()
        const hasModExt = /\.(js|cjs|mjs|json)$/
        Object.keys(this.hooks).forEach((requireId) => {
            const moduleName = this.moduleNameFromRequireId(requireId)
            if (requireId === moduleName) {
                modules.add(requireId)
            } else {
                if (hasModExt.test(requireId)) {
                    modules.add(moduleName)
                } else {
                    modules.add(requireId)
                }
            }
        })

        return Array.from(modules)
    }

    getHooks(requireId) {
        return this.hooks[requireId]?.hooks ?? []
    }
}

module.exports = {
    ModuleHook
}