/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const AgentInfo = require('../../lib/data/dto/agent-info')
const ApiMetaInfo = require('../../lib/data/dto/api-meta-info')
const StringMetaInfo = require('../../lib/data/dto/string-meta-info')
const Span = require('../../lib/context/span')
const SpanChunk = require('../../lib/context/span-chunk')
const DataSender = require('../../lib/client/data-sender')
const MockGrpcDataSender = require('../client/mock-grpc-data-sender')
const SqlMetaData = require('../../lib/client/sql-meta-data')

class MockDataSender extends DataSender {
  constructor(config, dataSender) {
    super(config, dataSender)
    this.mockAPIMetaInfos = []
    this.mockSpanChunks = []
    this.mockSpans = []
  }

  send(data) {
    super.send(data)
    if (data instanceof AgentInfo) {
      this.mockAgentInfo = data
    } else if (data instanceof ApiMetaInfo) {
      this.mockAPIMetaInfos.push(data)
    } else if (data instanceof StringMetaInfo) {
      this.mockMetaInfo = data
    } else if (data instanceof Span) {
      this.mockSpan = data
      this.mockSpans.push(data)
    } else if (data instanceof SpanChunk) {
      this.mockSpanChunks.push(data)
    } else if (data instanceof SqlMetaData) {
      this.mockSqlMetaData = data
    }
  }

  findSpanChunk(asyncId) {
    return this.mockSpanChunks.find(spanChunk => spanChunk.localAsyncId.asyncId === (asyncId.asyncId || asyncId))
  }
  findSpanEvent(apiId) {
    return this.mockSpan.spanEventList.find(event => event.apiId === apiId)
  }
}

const dataSender = () => {
  return new MockDataSender({
    enabledDataSending: true,
  }, new MockGrpcDataSender('', 0, 0, 0, {
    agentId: 'agent',
    applicationName: 'applicationName',
    agentStartTime: 1234344
  }))
}

module.exports = dataSender