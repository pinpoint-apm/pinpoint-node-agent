const MethodDescriptor = require('context/method-descriptor')

const HttpMethodDescritpor = {
  HANDLE: new MethodDescriptor("express.Routers.handle", "express.Routers.handle", 0),
}

const ExpressMethodDescritpor = {
  HANDLE: new MethodDescriptor("express.Routers.handle", "express.Routers.handle", 0),
}

const MethodDescriptors = [
  ExpressMethodDescritpor,
]

module.exports = {
  ExpressMethodDescritpor,
  MethodDescriptors
}
