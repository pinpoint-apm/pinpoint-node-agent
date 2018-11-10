const MethodType = require('constant/method-type').MethodType

class MethodDescriptor {
  constructor (fullName, apiId, type) {
    this.fullName = fullName || null
    this.apiId = apiId || 0
    this.type = type || MethodType.WEB_REQUEST
  }
}

module.exports = MethodDescriptor
