/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const {
  fixture,
  util,
  log
} = require('../test-helper')
const AgentInfo = require('../../lib/data/dto/agent-info')
const ApiMetaInfo = require('../../lib/data/dto/api-meta-info')
const StringMetaInfo = require('../../lib/data/dto/string-meta-info')
const Span = require('../../lib/context/span')
const SpanChunk = require('../../lib/context/span-chunk')
const DataSender = require('../../lib/client/data-sender')
const MockgRPCDataSender = require('../client/mock-grpc-data-sender')

class MockDataSender extends DataSender {
  send(data) {
    if (data instanceof AgentInfo) {
      this.mockAgentInfo = data
      this.dataSender.sendAgentInfo(data)
    } else if (data instanceof ApiMetaInfo) {
      this.mockAPIMetaInfo = data
      this.dataSender.sendApiMetaInfo(data)
    } else if (data instanceof StringMetaInfo) {
      this.mockMetaInfo = data
      this.dataSender.sendStringMetaInfo(data)
    } else if (data instanceof Span) {
      this.mockSpan = data
      this.dataSender.sendSpan(data)
    } else if (data instanceof SpanChunk) {
      this.mockSpanChunk = data
      this.dataSender.sendSpanChunk(data)
    }
  }
}

const dataSender = () => {
  return new MockDataSender({
    enabledDataSending: true,
  }, new MockgRPCDataSender('', 0, 0, 0, {
    agentId: 'agent',
    applicationName: 'applicationName',
    agentStartTime: 1234344
  }))
}

module.exports = dataSender