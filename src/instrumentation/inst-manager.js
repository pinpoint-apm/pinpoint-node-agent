const shimmer = require('shimmer')

const MODULES = [
  'express',
  'http'
]

const testMap = new Map()

function init(agent) {
  try {
    var Module = require('module')
    shimmer.wrap(Module, '_load', function (original) {
      return function (name) {
        const m = original.apply(this, arguments)
        if (MODULES.includes(name)) {
          console.log('load module:', name)
          try {
            // console.log('name='+name+'/->'+getLoadTest(name))
            // if (!getLoadTest(name)) {
            //   setLoadTest(name)
              require('./module/' + name)(agent, m)
            // }
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

function getLoadTest (name) {
  return testMap.get(name)
}

function setLoadTest (name) {
  testMap.set(name, true)
}

module.exports = {
  init
}
