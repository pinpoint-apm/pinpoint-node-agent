/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'
const GrpcDataSender = require('../../lib/client/grpc-data-sender')
const GrpcUnaryRPC = require('../../lib/client/grpc-unary-rpc')

class MockgRPCDataSender extends GrpcDataSender {
  initializeClients() {
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
      },
      requestSqlMetaData: function (pSqlMetaData) {
        self.actualSqlMetaData = pSqlMetaData
      },
      requestSqlUidMetaData: function (pSqlUidMetaData) {
        self.actualSqlUidMetaData = pSqlUidMetaData
      }
    }
    this.requestApiMetaData = new GrpcUnaryRPC('requestApiMetaData', this.metadataClient, this.metadataClient.requestApiMetaData, 0, 0)
    this.requestStringMetaData = new GrpcUnaryRPC('requestStringMetaData', this.metadataClient, this.metadataClient.requestStringMetaData, 0, 0)
    this.requestSqlMetaData = new GrpcUnaryRPC('requestSqlMetaData', this.metadataClient, this.metadataClient.requestSqlMetaData, 0, 0)
    this.requestSqlUidMetaData = new GrpcUnaryRPC('requestSqlUidMetaData', this.metadataClient, this.metadataClient.requestSqlUidMetaData, 0, 0)
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

  

  initializeProfilerStream() {
    let self = this
    this.profilerStream = {
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
}

module.exports = MockgRPCDataSender