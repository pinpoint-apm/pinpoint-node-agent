const test = require('tape')
const axios = require('axios')

const { log, fixture, util, enableDataSending } = require('../../test-helper')
enableDataSending()

const AgentInfo = require('../../../lib/data/dto/agent-info')
const GrpcSender = require('../../../lib/client/grpc-data-sender')
const dataSenderFactory = require('../../../lib/client/data-sender-factory')

test('Should send agent info', function (t) {
  t.plan(1)

  const agentInfo = AgentInfo.create(fixture.config, Date.now())
  const dataSender = dataSenderFactory.create(fixture.config, agentInfo)
  dataSender.send(agentInfo)

  t.ok(true)
})

