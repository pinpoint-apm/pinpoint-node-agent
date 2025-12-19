/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const AgentInfo = require('../../lib/data/dto/agent-info')
const ApiMetaInfo = require('../../lib/data/dto/api-meta-info')
const StringMetaInfo = require('../../lib/data/dto/string-meta-info')
const DataSender = require('../../lib/client/data-sender')
const MockGrpcDataSender = require('../client/mock-grpc-data-sender')
const SqlMetaData = require('../../lib/client/sql-meta-data')
const GrpcDataSender = require('../../lib/client/grpc-data-sender')
const SqlUidMetaData = require('../../lib/client/sql-uid-meta-data')
const { ConfigBuilder } = require('../../lib/config-builder')

class MockDataSender extends DataSender {
  constructor(config, dataSender) {
    super(config, dataSender)
    this.mockAPIMetaInfos = []
    this.mockSpanChunks = []
    this.mockSpans = []
    this.mockSqlMetadata = []
    this.mockSqlUidMetadata = []
  }

  send(data) {
    if (this.closed) {
      return
    }

    if (data instanceof AgentInfo) {
      this.mockAgentInfo = data
    } else if (data instanceof ApiMetaInfo) {
      this.mockAPIMetaInfos.push(data)
    } else if (data instanceof StringMetaInfo) {
      this.mockMetaInfo = data
    } else if (data instanceof SqlMetaData) {
      this.mockSqlMetadata.push(data)
    } else if (data?.isSpanChunk?.()) {
      this.mockSpanChunks.push(data)
    } else if (data?.isSpan?.()) {
      this.mockSpan = data
      this.mockSpans.push(data)
    } else if (data instanceof SqlUidMetaData) {
      this.mockSqlUidMetadata.push(data)
    }
    super.send(data)
  }

  findSpanChunk(asyncId) {
    return this.mockSpanChunks.find(spanChunk => spanChunk.localAsyncId.asyncId === (asyncId.asyncId || asyncId))
  }

  findSpanChunks(asyncId) {
    return this.mockSpanChunks.filter(spanChunk => spanChunk.localAsyncId.asyncId === (asyncId.asyncId || asyncId))
  }

  findSpanEvent(apiId) {
    return this.mockSpan.spanEventList.find(event => event.apiId === apiId)
  }

  clear() {
    this.mockAPIMetaInfos = []
    this.mockSpanChunks = []
    this.mockSpans = []
    this.mockSqlMetadata = []
    this.mockSqlUidMetadata = []
  }

  close() {
    super.close()
    this.closed = true
  }

  getSpan(traceRoot) {
    return this.mockSpans.find(span => span.traceRoot === traceRoot)
  }

  getSpanChunk(traceRoot) {
    return this.mockSpanChunks.find(spanChunk => spanChunk.traceRoot === traceRoot)
  }
}

const dataSender = (conf, agentInfoOrGrpcDataSender, grpcDataSender) => {
  if (typeof agentInfoOrGrpcDataSender?.sendAgentInfo === 'function') {
    return new MockDataSender(conf, agentInfoOrGrpcDataSender)
  }
  if (grpcDataSender) {
    return new MockDataSender(conf, grpcDataSender)
  }
  if (conf?.collector.spanPort > 0) {
    return new MockDataSender(conf, new GrpcDataSender(conf.collector.ip, conf.collector.spanPort, conf.collector.statPort, conf.collector.tcpPort, agentInfoOrGrpcDataSender, conf))
  }
  const config = new ConfigBuilder({
    agentId: 'agent',
    applicationName: 'applicationName',
    agentStartTime: 1234344
  }).build()
  const agentInfo = AgentInfo.make(config)
  return new MockDataSender(conf, new MockGrpcDataSender('', 0, 0, 0, agentInfo, config))
}

module.exports = dataSender