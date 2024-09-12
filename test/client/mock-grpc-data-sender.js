/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'
const GrpcDataSender = require('../../lib/client/grpc-data-sender')

class MockGrpcDataSender extends GrpcDataSender {
  initializeClients() {
    let self = this
    this.agentClient = {
      requestAgentInfo: function (pAgentInfo) {
        self.actualAgentInfo = pAgentInfo
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
      }
    }
    this.actualSpans = []
  }

  get actualSpan () {
    return this.actualSpans[this.actualSpans.length - 1]
  }

  initializeMetadataClients(collectorIp, collectorTcpPort) {
  }

  initializeSpanStream() {
    let self = this
    this.spanStream = {
      write: function (span) {
        self.actualSpans.push(span)
      },
      end: function () {

      }
    }
  }

  initializeProfilerClients() {
    let self = this
    this.commandStream = {
      write: function (pmessage) {
        self.actualPCmdMessage = pmessage
      },
      end: function () {

      },
      on: function () {

      }
    }
  }

  initializeStatStream() {
    let self = this
    this.statStream = {
      write: function (pmessage) {
        self.actualPStatMessage = pmessage
      },
      end: function () {

      },
      on: function () {

      }
    }
  }

  initializePingStream() {

  }

  initializeAgentInfoScheduler() {
    
  }

  sendSupportedServicesCommand() {
  }
}

module.exports = MockGrpcDataSender