'use strict'

const GrpcDataSender = require('./grpc-data-sender')
const DataSender = require('./data-sender')

const create = (config, agentInfo) => {
  return new DataSender(config, new GrpcDataSender(
    config.grpcCollectorIp,
    config.grpcCollectorTcpPort,
    config.grpcCollectorStatPort,
    config.grpcCollectorSpanPort,
    agentInfo
  ))
}

module.exports = {
  create
}
