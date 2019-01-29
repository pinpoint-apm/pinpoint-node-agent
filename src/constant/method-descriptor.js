'use strict'

const MethodDescriptor = require('../context/method-descriptor')

const HttpMethodDescritpor = {
  SERVER_REQUEST: new MethodDescriptor("http.Server.request", "http.Server.request", 1),
}

const MethodDescriptors = [
  HttpMethodDescritpor,
]

module.exports = {
  MethodDescriptors,
  HttpMethodDescritpor,
}
