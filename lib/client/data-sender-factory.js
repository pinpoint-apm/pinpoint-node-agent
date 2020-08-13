/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const GrpcDataSender = require('./grpc-data-sender')
const DataSender = require('./data-sender')

const create = (config, agentInfo) => {
  return new DataSender(config, new GrpcDataSender(
    config.collectorIp,
    config.collectorTcpPort,
    config.collectorStatPort,
    config.collectorSpanPort,
    agentInfo
  ))
}

module.exports = {
  create
}
