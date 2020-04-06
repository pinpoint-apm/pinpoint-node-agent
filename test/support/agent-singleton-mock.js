'use strict'

const { fixture, util } = require('../test-helper')
const instManager = require('../../lib/instrumentation/inst-manager')

const enableDataSending = require('../test-helper').enableDataSending
enableDataSending()
const Agent = require('../../lib/agent')
const dataSenderMock = require('./data-sender-mock')

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
}

const agent = new MockAgent(fixture.config)
module.exports = agent