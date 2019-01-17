'use strict'

const shimmer = require('shimmer')
const log = require('../utils/logger')

const MODULES = [
  'express',
  'http',
  'koa',
  'koa-router',
  'redis',
  'ioredis',
  'mongodb-core',
]

function init(agent) {
  try {
    var Module = require('module')
    shimmer.wrap(Module, '_load', function (original) {
      return function (name) {
        const m = original.apply(this, arguments)
        if (MODULES.includes(name) && agent.includedModules(name)) {
          // todo. versioning Logic add On
          const version = '2.5.6'
          try {
            console.log('loader=>', name)

            require('./module/' + name)(agent, version, m)
            agent.setModules(name)
          } catch (e) {
            log.error('fail to load:', e)
          }
        }
        return m
      }
    })
  } catch (e) {
    log.error('error occurred', e)
  }
}


function bindEmitter(emitter) {
  const ins = this
  const methods = [
      'on',
      'addListener',
      'prependListener'
  ]

    // if (semver.satisfies(process.versions.node, '>=6')) {
  //   methods.push('prependListener')
  // }
  shimmer.massWrap(emitter, methods, (original) => function(name, handler) {
    return original.call(this, name, ins.bindFunction(handler))
  })
}

function bindFunction (original) {
    if (typeof original !== 'function') return original
    //
    // const ins = this
    //

  return original
}

module.exports = {
  init,
  bindEmitter,
  bindFunction,
}
