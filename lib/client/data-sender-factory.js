/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const GrpcDataSender = require('./grpc-data-sender')
const DataSender = require('./data-sender')

let dataSender
const create = (config, agentInfo) => {
  dataSender = new DataSender(config, new GrpcDataSender(
    config.collectorIp,
    config.collectorTcpPort,
    config.collectorStatPort,
    config.collectorSpanPort,
    agentInfo,
    config
  ))
  return dataSender
}

const setDataSender = (sender) => {
  dataSender = sender
}

module.exports = {
  create,
  setDataSender
}
