/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const {
  fixture,
  util
} = require('../test-helper')
const instManager = require('../../lib/instrumentation/inst-manager')

module.exports = () => {
  const enableDataSending = require('../test-helper').enableDataSending
  enableDataSending()
  const Agent = require('../../lib/agent')
  const dataSenderMock = require('../support/data-sender-mock')

  class MockAgent extends Agent {
    startSchedule(agentId, agentStartTime) {
      this.mockAgentId = agentId
      this.mockAgentStartTime = agentStartTime
    }

    initializeDataSender() {
      this.dataSender = dataSenderMock()
      this.dataSender.send(this.agentInfo)
    }

    initailizeSupportModules() {
      this.loadedModule = [];
    }
  }
  return new MockAgent(fixture.config)
}