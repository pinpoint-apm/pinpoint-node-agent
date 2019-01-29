'use strict'

const MethodType = require('../constant/method-type').MethodType

class MethodDescriptor {
  constructor (moduleName, objectPath, methodName, apiId, type) {
    this.moduleName = moduleName
    this.objectPath = objectPath
    this.methodName = methodName
    this.apiId = apiId || 0
    this.type = type || MethodType.DEFAULT

    this.apiDescriptor = this.getDescriptor()
  }

  static create (moduleName, objectPath, methodName) {
    return new MethodDescriptor(moduleName, objectPath, methodName)
  }

  getDescriptor() {
    return [this.moduleName, this.objectPath, this.methodName]
      .filter(v => v)
      .join('.')
  }
}

module.exports = MethodDescriptor
