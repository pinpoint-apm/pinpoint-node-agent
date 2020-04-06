const { fixture, util } = require('../test-helper')
const instManager = require('../../lib/instrumentation/inst-manager')

module.exports = () => {
  const enableDataSending = require('../test-helper').enableDataSending
  enableDataSending()
  const Agent = require('../../lib/agent')
  const dataSenderMock = require('../support/data-sender-mock')
  
  class MockPinpointClient {
    constructor(config, agentInfo) {
      this.mockConfig = config
      this.mockAgentInfo = agentInfo
      this.dataSender = dataSenderMock()
    }
  }
  
  class MockAgent extends Agent {
    createAgentInfo(config, agentStartTime) {
      this.mockAgentInfo = super.createAgentInfo(config, agentStartTime)
      return this.mockAgentInfo
    }
    
    startSchedule(agentId, agentStartTime) {
      this.mockAgentId = agentId
      this.mockAgentStartTime = agentStartTime
    }
  
    initializePinpointClient(agentInfo) {
      this.pinpointClient = new MockPinpointClient(this.config, agentInfo)
    }

    initailizeSupportModules() {
      this.loadedModule = [];
    }
  }
  return new MockAgent(fixture.config)
}