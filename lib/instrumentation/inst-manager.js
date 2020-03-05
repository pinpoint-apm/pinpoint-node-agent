'use strict'

const fs = require('fs')
const path = require('path')
const findNodeModules = require('find-node-modules');
const shimmer = require('shimmer')

const log = require('../utils/logger')

const nodeModules = findNodeModules({relative: false })
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

function init(agent) {
  try {
    const Module = require('module')
    shimmer.wrap(Module, '_load', function (original) {
      return function (name) {
        const m = original.apply(this, arguments)
        loadModule(name, agent, m);
        return m
      }
    })
  } catch (e) {
    log.error('error occurred', e)
  }
}

function loadModule(name, agent, m) {
  if (MODULES.includes(name) && agent.includedModules(name)) {
    try {
      const version = _getModuleVersion(name);
      require('./module/' + name)(agent, version, m);
      agent.setModules(name);
      log.info('loader ==> %s (%s)', name, version);
    }
    catch (e) {
      log.error('fail to load:', e);
    }
  }
}

function _getModuleVersion(name) {
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

module.exports = {
  init,
}
