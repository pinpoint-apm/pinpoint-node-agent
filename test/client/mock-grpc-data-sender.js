/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'
const GrpcDataSender = require('../../lib/client/grpc-data-sender')
const GrpcUnaryRPC = require('../../lib/client/grpc-unary-rpc')

class MockgRPCDataSender extends GrpcDataSender {
  initializeClients(agentInfo, collectorIp, collectorTcpPort, collectorStatPort, collectorSpanPort) {
    let self = this
    this.agentClient = {
      requestAgentInfo: function (pAgentInfo) {
        self.actualAgentInfo = pAgentInfo
      }
    }
    this.requestAgentInfo = new GrpcUnaryRPC('requestAgentInfo', this.agentClient, this.agentClient.requestAgentInfo, 0, 0)

    this.metadataClient = {
      requestApiMetaData: function (pApiMetaData) {
        self.actualApiMetaData = pApiMetaData
      },
      requestStringMetaData: function (pStringMetaData) {
        self.actualStringMetaData = pStringMetaData
      }
    }
    this.requestApiMetaData = new GrpcUnaryRPC('requestApiMetaData', this.metadataClient, this.metadataClient.requestApiMetaData, 0, 0)
  }

  initializeSpanStream() {
    let self = this
    this.spanStream = {
      write: function (span) {
        self.actualSpan = span
      },
      end: function () {

      }
    }
  }

  initializeProfilerStream() {
    let self = this
    this.profilerStream = {
      write: function (pmessage) {
        self.actualPCmdMessage = pmessage
      },
      end: function () {

      },
      on: function (eventName, callback) {

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
      on: function (eventName, callback) {

      }
    }
  }

  initializePingStream() {

  }
}

module.exports = MockgRPCDataSender