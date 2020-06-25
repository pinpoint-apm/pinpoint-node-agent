'use strict'

const { fixture, util, log } = require('../test-helper')
const AgentInfo = require('../../lib/data/dto/agent-info')
const ApiMetaInfo = require('../../lib/data/dto/api-meta-info')
const StringMetaInfo = require('../../lib/data/dto/string-meta-info')
const Span = require('../../lib/context/span')
const SpanChunk = require('../../lib/context/span-chunk')

const dataSender = () => {
  return {
    sendApiMetaInfo: function (apiMetaInfo) {
      this.mockAPIMetaInfo = apiMetaInfo
    },
    sendSpan: function (span) {
      this.mockSpan = span
    },
    sendSpanChunk: function (spanChunk) {
      this.mockSpanChunk = spanChunk
    },
    sendStringMetaInfo: function (metaInfo) {
      this.mockMetaInfo = metaInfo
    },
    sendAgentInfo: function(agentInfo) {
      this.mockAgentInfo = agentInfo
    },
    send: function (data) {
      if (data instanceof AgentInfo) {
        this.sendAgentInfo(data)
      } else if (data instanceof ApiMetaInfo) {
        this.sendApiMetaInfo(data)
      } else if (data instanceof StringMetaInfo) {
        this.sendStringMetaInfo(data)
      } else if (data instanceof Span) {
        this.sendSpan(data)
      } else if (data instanceof SpanChunk) {
        this.sendSpanChunk(data)
      }
    },
    sendPing: function() {
    }
  }
}

module.exports = dataSender