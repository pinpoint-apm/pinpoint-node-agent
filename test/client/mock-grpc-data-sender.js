/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'
const GrpcDataSender = require('../../lib/client/grpc-data-sender')

class MockGrpcStream {
  constructor(stream) {
    this.grpcStream = stream
  }

  write(data) {
    this.grpcStream.write(data)
  }

  push(data) {
    this.grpcStream.push(data)
  }

  end() {
  }
}

class MockGrpcDataSender extends GrpcDataSender {
  initializeClients() {
    let self = this
    this.agentClient = {
      requestAgentInfo: function (pAgentInfo) {
        self.actualAgentInfo = pAgentInfo
      },
      close: function () {
      }
    }

    this.metadataClient = {
      requestApiMetaData: function (pApiMetaData) {
        self.actualApiMetaData = pApiMetaData
      },
      requestStringMetaData: function (pStringMetaData) {
        self.actualStringMetaData = pStringMetaData
      },
      requestSqlMetaData: function (pSqlMetaData) {
        self.actualSqlMetaData = pSqlMetaData
      },
      requestSqlUidMetaData: function (pSqlUidMetaData) {
        self.actualSqlUidMetaData = pSqlUidMetaData
      },
      close: function () {
      }
    }
    this.actualSpans = []
  }

  get actualSpan() {
    return this.actualSpans[this.actualSpans.length - 1]
  }

  initializeMetadataClients(collectorIp, collectorTcpPort) {
  }

  initializeSpanStream() {
    let self = this
    this.spanStream = new MockGrpcStream({
      push: function (span) {
        self.actualSpans.push(span)
      },
      end: function () {

      }
    })
  }

  initializeProfilerClients() {
    let self = this
    this.commandStream = new MockGrpcStream({
      write: function (pmessage) {
        self.actualPCmdMessage = pmessage
      },
      end: function () {

      },
      on: function () {

      }
    })
  }

  initializeStatStream() {
    let self = this
    this.statStream = new MockGrpcStream({
      push: function (pmessage) {
        self.actualPStatMessage = pmessage
      },
      end: function () {

      },
      on: function () {

      }
    })
  }

  initializePingStream() {
    let self = this
    this.pingStream = new MockGrpcStream({
      push: function (pmessage) {
        self.actualPingMessage = pmessage
      },
      write: function (pmessage) {
        self.actualPingMessage = pmessage
      },
      end: function () {

      },
      on: function () {

      }
    })
  }

  initializeAgentInfoScheduler() {

  }

  sendSupportedServicesCommand() {
  }
}

module.exports = MockGrpcDataSender