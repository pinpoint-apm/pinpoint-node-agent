'use strict'

const MethodDescriptor = require('../context/method-descriptor')
const AsyncMethodDescriptor = require('../context/async-method-descriptor')
const MethodType = require('./method-type').MethodType

const GeneralMethodDescriptor = {
  SERVER_REQUEST: new MethodDescriptor('http', 'Server', 'request', MethodType.WEB_REQUEST, 'Node Server Process'),
  AsyncInvocation: new AsyncMethodDescriptor(MethodType.INVOCATION, "Asynchronous Invocation")
}

module.exports = {
  GeneralMethodDescriptor,
}
