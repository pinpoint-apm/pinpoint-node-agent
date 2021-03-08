/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const fs = require('fs')
const path = require('path')
const findNodeModules = require('find-node-modules')

const log = require('../utils/logger')
const Hook = require('require-in-the-middle')
const nodeModules = findNodeModules({ relative: false })
const MODULES = [
  'express',
  'http',
  'https',
  // 'koa',
  'koa-router',
  'redis',
  'ioredis',
  'mongodb-core',
  'elasticsearch',
  'request',
  // 'bluebird',
]

class ModuleHook {
  constructor(agent) {
    try {
      this.loadedModules = []
      const self = this
      this.hook = Hook(MODULES, function (exports, name) {
        self.loadModule(name, agent, exports)
        return exports
      })
    } catch (e) {
      log.error('error occurred', e)
    }
  }

  loadModule(name, agent, m) {
    if (MODULES.includes(name) && this.needLoadModules(name)) {
      try {
        const version = this._getModuleVersion(name)
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

  _getModuleVersion(name) {
    let version
    nodeModules.some((nodePath) => {
      const pkg = path.join(`${nodePath}/${name}/`, 'package.json')
      try {
        if (fs.existsSync(pkg)) {
          const json = JSON.parse(fs.readFileSync(pkg))
          version = json.version
        }
      } catch (e) {
        log.error('error occurred', e)
      }
    })
    if (!version) {
      version = process.versions.node
    }
    return version
  }

  needLoadModules(name) {
    return !this.loadedModules.find(moduleObj => moduleObj.name == name)
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
}

module.exports = ModuleHook