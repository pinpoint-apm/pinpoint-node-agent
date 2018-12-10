'use strict'

const MethodType = require('constant/method-type').MethodType

class MethodDescriptor {
  constructor (fullName, descriptor, apiId, type) {
    this.fullName = fullName || null
    this.descriptor = descriptor
    this.apiInfo = descriptor
    this.apiId = apiId || 0
    this.type = type || MethodType.WEB_REQUEST
  }
}

module.exports = MethodDescriptor
