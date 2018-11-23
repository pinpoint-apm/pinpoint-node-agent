const shimmer = require('shimmer')

const MODULES = [
  'express',
  'http',
  'koa-router'
]

function init(agent) {
  try {
    var Module = require('module')
    shimmer.wrap(Module, '_load', function (original) {
      return function (name) {
        const m = original.apply(this, arguments)
        if (MODULES.includes(name) && agent.includedModules(name)) {
          console.log('load module:', name)
          // todo. versioning Logic add On
          const version = '1.0.0'
          try {
            require('./module/' + name)(agent, version, m)
            agent.setModules(name)
          } catch (e) {
            console.error('fail to load:', e)
          }
        }
        return m
      }
    })
  } catch (e) {
    console.error('error occurred', e)
  }
}

module.exports = {
  init
}
