const { fixture, util } = require('../test-helper')
module.exports = () => {
    const enableDataSending = require('../test-helper').enableDataSending
    enableDataSending()
    const Agent = require('../../lib/agent')
    
    class MockPinpointClient {
      constructor(config, agentInfo) {
        this.mockConfig = config
        this.mockAgentInfo = agentInfo
        this.dataSender = {
          sendApiMetaInfo: function() {
    
          },
          sendSpan: function() {
    
          },
        }
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