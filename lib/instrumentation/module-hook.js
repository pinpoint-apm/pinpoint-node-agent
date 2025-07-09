/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const fs = require('fs')
const path = require('path')

const log = require('../utils/logger')
const { Hook } = require('require-in-the-middle')
const { undiciHook } = require('./module/undici')

const MODULES = [
  'express',
  'http',
  'https',
  'koa-router',
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
    try {
      this.loadedModules = []
      const self = this
      this.hook = new Hook(MODULES, function (exports, name, basedir) {
        self.loadModule(name, agent, exports, basedir)
        return exports
      })
    } catch (e) {
      log.error('error occurred', e)
    }
  }

  loadModule(name, agent, m, basedir) {
    if (MODULES.includes(name) && this.needLoadModules(name)) {
      try {
        const version = this._getModuleVersion(basedir)
        require('./module/' + name)(agent, version, m)
        this.setModules({
          name: name,
          version: version
        })
        if (log.isInfo()) {
          log.info('loader ==> %s (%s)', name, version)
        }
      } catch (e) {
        log.error('fail to load:', e)
      }
    }
  }

  _getModuleVersion(basedir) {
    let version

    if (basedir) {
      const pkg = path.join(basedir, 'package.json')
      try {
        version = JSON.parse(fs.readFileSync(pkg)).version
      } catch (error) {
        log.error('error occurred', error)
      }
    }

    if (!version) {
      version = process.versions.node
    }
    return version
  }

  needLoadModules(name) {
    return !this.moduleObj(name)
  }

  moduleObj(name) {
    return this.loadedModules.find(moduleObj => moduleObj.name == name)
  }

  setModules(moduleObj) {
    this.loadedModules.push(moduleObj)
  }

  unhook() {
    try {
      this.hook.unhook()
    } catch (error) {
      if (error) {
        log.error(error)
      }
    }
  }

  loadGlobalFunction(agent) {
    if (typeof undiciHook.instrument === 'function') {
      undiciHook.instrument(agent)
    }
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

module.exports = ModuleHook