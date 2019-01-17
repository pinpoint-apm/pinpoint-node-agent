'use strict'

const MethodDescriptor = require('../context/method-descriptor')

const HttpMethodDescritpor = {
  SERVER_REQUEST: new MethodDescriptor("http.Server.request", "http.Server.request", 1),
}

const ExpressMethodDescritpor = {
  HANDLE: new MethodDescriptor("express.Routers.handle", "express.Routers.handle", 0),
  GET: new MethodDescriptor("express.Routers.get", "express.Routers.get", 0),
  POST: new MethodDescriptor("express.Routers.post", "express.Routers.post", 0),
  PUT: new MethodDescriptor("express.Routers.put", "express.Routers.put", 0),
  PATCH: new MethodDescriptor("express.Routers.patch", "express.Routers.patch", 0),
  DELETE: new MethodDescriptor("express.Routers.delete", "express.Routers.delete", 0),
}

const MethodDescriptors = [
  HttpMethodDescritpor,
  ExpressMethodDescritpor
]

module.exports = {
  MethodDescriptors,
  HttpMethodDescritpor,
  ExpressMethodDescritpor,
}
