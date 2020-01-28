'use strict'

const log = require('../utils/logger')
const AgentInfo = require('../data/dto/agent-info')
const ApiMetaInfo = require('../data/dto/api-meta-info')
const StringMetaInfo = require('../data/dto/string-meta-info')
const Span = require('../context/span')
const BasicDataSender = require('./basic-data-sender')

class DataSender {
  constructor (config, dataSender) {
    this.enabledDataSending = config.enabledDataSending
    this.dataSender = dataSender

    // TODO Remove it after implementing all grpc specs
    if (dataSender instanceof BasicDataSender) {
      this.basicDataSender = dataSender
    } else {
      this.basicDataSender = new BasicDataSender(
        config.collectorIp,
        config.collectorTcpPort,
        config.collectorStatPort,
        config.collectorSpanPort,
        dataSender.agentInfo
      )
    }
  }

  send (data) {
    if (data && this.enabledDataSending) {
      log.debug('send data:', data)
      this.sendByDataType(data)
    }
  }

  sendByDataType (data) {
    if (data instanceof AgentInfo) {
      this.dataSender.sendAgentInfo(data)
    } else if (data instanceof ApiMetaInfo) {
      this.dataSender.sendApiMetaInfo(data)
    } else if (data instanceof StringMetaInfo) {
      this.dataSender.sendStringMetaInfo(data)
    } else if (data instanceof Span) {
      this.dataSender.sendSpan(data)
    }
  }

  // TODO Remove it after implementing grpc
  sendControlHandshake (params) {
    if (this.enabledDataSending) {
      this.basicDataSender.sendControlHandshake(params)
    }
  }

  // TODO Remove it after implementing grpc
  sendPing () {
    if (this.enabledDataSending) {
      this.basicDataSender.sendPing()
    }
  }

  // TODO Remove it after implementing grpc
  sendSpanChunk (spanChunk) {
    if (this.enabledDataSending) {
      this.basicDataSender.sendSpanChunk(spanChunk)
    }
  }

  // TODO Remove it after implementing grpc
  sendStats (stats) {
    if (this.enabledDataSending) {
      this.basicDataSender.sendStats(stats)
    }
  }

  // TODO Remove it after implementing grpc
  sendActiveThreadCountRes (streamChannelId, activeTrace) {
    if (this.enabledDataSending) {
      this.basicDataSender.sendActiveThreadCountRes(streamChannelId, activeTrace)
    }
  }
}

module.exports = DataSender
