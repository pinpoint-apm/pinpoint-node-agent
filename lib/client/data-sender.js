/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const log = require('../utils/logger')
const AgentInfo = require('../data/dto/agent-info')
const ApiMetaInfo = require('../data/dto/api-meta-info')
const StringMetaInfo = require('../data/dto/string-meta-info')
const Span = require('../context/span')
const SpanChunk = require('../context/span-chunk')
const SqlMetaData = require('./sql-meta-data')
const SqlUidMetaData = require('./sql-uid-meta-data')

class DataSender {
  constructor(config, dataSender) {
    this.config = config
    this.enabledDataSending = config.enabledDataSending
    this.dataSender = dataSender
  }

  close() {
    this.dataSender.close()
  }

  send(data) {
    try {
      if (data && this.enabledDataSending) {
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
    } else if (data instanceof Span) {
      this.dataSender.sendSpan(data)
    } else if (data?.isSpan?.()) {
      this.dataSender.sendSpan(data)
    } else if (data instanceof SpanChunk) {
      this.dataSender.sendSpanChunk(data)
    } else if (data?.isAsyncSpanChunk?.()) {
      this.dataSender.sendSpanChunk(data)
    } else if (data instanceof SqlMetaData) {
      this.dataSender.sendSqlMetaInfo(data)
    } else if (data instanceof SqlUidMetaData) {
      this.dataSender.sendSqlUidMetaData(data)
    }
  }

  sendSupportedServicesCommand() {
    if (this.enabledDataSending) {
      this.dataSender.sendSupportedServicesCommand()
    }
  }

  sendPing() {
    if (this.enabledDataSending) {
      this.dataSender.sendPing()
    }
  }

  sendStat(stats) {
    if (this.enabledDataSending) {
      this.dataSender.sendStat(stats)
    }
  }

  // TODO Remove it after implementing grpc
  sendActiveThreadCountRes() {

  }
}

module.exports = DataSender
