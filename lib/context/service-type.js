/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const serviceTypeConstant = require('../constant/service-type')
const ServiceTypeProperty = serviceTypeConstant.ServiceTypeProperty

class ServiceType {
  static undefinedServiceType = new ServiceType(-1, 'UNDEFINED')
  static unknown = new ServiceType(1, 'UNKNOWN')
  static async = new ServiceType(100, 'ASYNC')
  static node = new ServiceType(1400, 'NODE')
  static nodeMethod = new ServiceType(1401, 'NODE_METHOD')
  static express = new ServiceType(6600, 'EXPRESS')
  static koa = new ServiceType(6610, 'KOA')
  static mongodb = new ServiceType(2650, 'MONGODB')
  static redis = new ServiceType(8200, 'REDIS')
  static ioredis = new ServiceType(8202, 'IOREDIS')
  static asyncHttpClient = new ServiceType(9056, 'ASYNC_HTTP_CLIENT')
  static asyncHttpClientInternal = new ServiceType(9057, 'ASYNC_HTTP_CLIENT_INTERNAL')

  constructor(code, name, ...properties) {
    this.code = code
    this.name = name
    this.terminal = false
    this.queue = false
    this.recordStatistics = false
    this.includeDestinationId = false

    this.setProperties(properties)
  }

  getCode() {
    return this.code
  }

  setProperties(properties = []) {
    properties.forEach(p => {
      switch (p) {
        case ServiceTypeProperty.TERMINAL:
          this.terminal = true
          break
        case ServiceTypeProperty.QUEUE:
          this.queue = true
          break
        case ServiceTypeProperty.RECORD_STATISTICS:
          this.recordStatistics = true
          break
        case ServiceTypeProperty.INCLUDE_DESTINATION_ID:
          this.includeDestinationId = true
          break
      }
    })
  }
}

module.exports = ServiceType
