/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const GrpcDataSender = require('./grpc-data-sender')
const DataSender = require('./data-sender')

const create = (config, agentInfo) => {
  const collector = config.getCollector()
  return new DataSender(config, new GrpcDataSender(
    collector.ip,
    collector.tcpPort,
    collector.statPort,
    collector.spanPort,
    agentInfo,
    config
  ))
}

module.exports = {
  create,
}
