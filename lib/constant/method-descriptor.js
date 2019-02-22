'use strict'

const MethodDescriptor = require('../context/method-descriptor')
const MethodType = require('./method-type').MethodType

const GeneralMethodDescriptor = {
  SERVER_REQUEST: new MethodDescriptor('http', 'Server', 'request', MethodType.WEB_REQUEST, 'Node Server Process'),
}

module.exports = {
  GeneralMethodDescriptor,
}
