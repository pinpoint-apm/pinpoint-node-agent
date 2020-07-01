'use strict'
const GrpcDataSender = require('../../lib/client/grpc-data-sender')

class MockgRPCDataSender extends GrpcDataSender {
    initializeClients(agentInfo, collectorIp, collectorTcpPort, collectorStatPort, collectorSpanPort) {
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