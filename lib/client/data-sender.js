/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const log = require('../utils/log/logger')
const AgentInfo = require('../data/dto/agent-info')
const ApiMetaInfo = require('../data/dto/api-meta-info')
const StringMetaInfo = require('../data/dto/string-meta-info')
const SqlMetaData = require('./sql-meta-data')
const SqlUidMetaData = require('./sql-uid-meta-data')

class DataSender {
  constructor(config, dataSender) {
    this.config = config
    this.dataSender = dataSender
  }

  close() {
    this.dataSender.close()
  }

  send(data) {
    try {
      if (data && this.config.isDataSendingEnabled()) {
        this.sendByDataType(data)
      }
    } catch (error) {
      if (error) {
        log.error(`error: ${error}`)
      }
    }
  }

  sendByDataType(data) {
    if (data instanceof AgentInfo) {
      this.dataSender.sendAgentInfo(data)
    } else if (data instanceof ApiMetaInfo) {
      this.dataSender.sendApiMetaInfo(data)
    } else if (data instanceof StringMetaInfo) {
      this.dataSender.sendStringMetaInfo(data)
    } else if (data?.isSpan?.()) {
      this.dataSender.sendSpan(data)
    } else if (data?.isSpanChunk?.()) {
      this.dataSender.sendSpanChunk(data)
    } else if (data instanceof SqlMetaData) {
      this.dataSender.sendSqlMetaInfo(data)
    } else if (data instanceof SqlUidMetaData) {
      this.dataSender.sendSqlUidMetaData(data)
    } else if (data?.isExceptionMetaData?.()) {
      this.dataSender.sendExceptionMetaData(data)
    }
  }

  sendSupportedServicesCommand() {
    if (this.config.isDataSendingEnabled()) {
      this.dataSender.sendSupportedServicesCommand()
    }
  }

  sendPing() {
    if (this.config.isDataSendingEnabled()) {
      this.dataSender.sendPing()
    }
  }

  sendStat(stats) {
    if (this.config.isDataSendingEnabled()) {
      this.dataSender.sendStat(stats)
    }
  }

  // TODO Remove it after implementing grpc
  sendActiveThreadCountRes() {

  }
}

module.exports = DataSender
