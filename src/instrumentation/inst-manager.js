const shimmer = require('shimmer')

const MODULES = [
  'express'
]

function init(agent) {
  try {
    var Module = require('module')
    shimmer.wrap(Module, '_load', function (original) {
      return function (name) {
        const m = original.apply(this, arguments)
        if (MODULES.includes(name)) {
          console.log('load module:', name)
          try {
            require('./module/' + name)(agent, m)
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
