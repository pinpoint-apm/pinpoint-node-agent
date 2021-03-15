/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const AgentInfo = require('../data/dto/agent-info')
const ApiMetaInfo = require('../data/dto/api-meta-info')
const StringMetaInfo = require('../data/dto/string-meta-info')
const Span = require('../context/span')
const SpanChunk = require('../context/span-chunk')

class DataSender {
  constructor(config, dataSender) {
    this.enabledDataSending = config.enabledDataSending
    this.dataSender = dataSender
  }

  send(data) {
    if (data && this.enabledDataSending) {
      this.sendByDataType(data)
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
    } else if (data instanceof SpanChunk) {
      this.dataSender.sendSpanChunk(data)
    }
  }

  sendControlHandshake(params) {
    if (this.enabledDataSending) {
      this.dataSender.sendControlHandshake(params)
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
