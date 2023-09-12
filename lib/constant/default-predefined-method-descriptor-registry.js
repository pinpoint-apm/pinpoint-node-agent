/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const MethodDescriptorBuilder2 = require('../context/method-descriptor-builder2')
const MethodType = require('./method-type')

// DefaultPredefinedMethodDescriptorRegistry.java
// Node Server Process SpanEvent.apiId predefined values
class DefaultPredefinedMethodDescriptorRegistry {
  registryMethodDescriptor(apiMetaService) {
    const nodeServerProcessBuilder = new MethodDescriptorBuilder2().setType(MethodType.WEB_REQUEST).setApiDescriptor('Node Server Process')
    const asyncInvocationBuilder = new MethodDescriptorBuilder2().setType(MethodType.INVOCATION).setApiDescriptor('Asynchronous Invocation')
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
