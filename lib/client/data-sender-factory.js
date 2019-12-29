'use strict'

const GrpcDataSender = require('./grpc-data-sender')
const BasicDataSender = require('./basic-data-sender')
const DataSender = require('./data-sender')

const create = (config, agentInfo) => {
  let dataSender
  if (config.grpcEnable) {
    dataSender = new GrpcDataSender(
      config.grpcCollectorIp,
      config.grpcCollectorTcpPort,
      config.grpcCollectorStatPort,
      config.grpcCollectorSpanPort,
      agentInfo
    )
  } else {
    dataSender = new BasicDataSender(
      config.collectorIp,
      config.collectorTcpPort,
      config.collectorStatPort,
      config.collectorSpanPort,
      agentInfo
    )
  }

  return new DataSender(config, dataSender)
}

module.exports = {
  create
}
