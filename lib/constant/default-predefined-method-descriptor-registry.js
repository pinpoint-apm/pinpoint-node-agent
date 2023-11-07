/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const MethodDescriptorBuilder = require('../context/method-descriptor-builder')
const MethodType = require('./method-type')

// DefaultPredefinedMethodDescriptorRegistry.java
// Node Server Process SpanEvent.apiId predefined values
class DefaultPredefinedMethodDescriptorRegistry {
  registryMethodDescriptor(apiMetaService) {
    const nodeServerProcessBuilder = new MethodDescriptorBuilder().setType(MethodType.WEB_REQUEST).setApiDescriptor('Node Server Process')
    const asyncInvocationBuilder = new MethodDescriptorBuilder().setType(MethodType.INVOCATION).setApiDescriptor('Asynchronous Invocation')
    this.nodeServerProcessDescriptor = apiMetaService.cacheApiWithBuilder(nodeServerProcessBuilder)
    this.asyncInvocationDescriptor = apiMetaService.cacheApiWithBuilder(asyncInvocationBuilder)
  }

  get nodeServerMethodDescriptor() {
    return this.nodeServerProcessDescriptor
  }

  get asyncInvocationMethodDescriptor() {
    return this.asyncInvocationDescriptor
  }
}

module.exports = new DefaultPredefinedMethodDescriptorRegistry()
