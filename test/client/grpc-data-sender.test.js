const test = require('tape')
const axios = require('axios')

const { log, fixture, util, enableDataSending } = require('../test-helper')
enableDataSending()

const AgentInfo = require('../../lib/data/dto/agent-info')
const ApiMetaInfo = require('../../lib/data/dto/api-meta-info')
const MethodDescriptor = require('../../lib/context/method-descriptor')
const MethodType = require('../../lib/constant/method-type').MethodType
const dataSenderFactory = require('../../lib/client/data-sender-factory')

test('Should send agent info', function (t) {
  t.plan(1)

  const agentInfo = AgentInfo.create(fixture.config, Date.now())
  const dataSender = dataSenderFactory.create(fixture.config, agentInfo)
  dataSender.send(agentInfo)

  t.ok(true)
})

test('Should send api meta info', function (t) {
  t.plan(1)

  const methodDescriptor = new MethodDescriptor('http', 'Server', 'request', MethodType.WEB_REQUEST, 'Node Server Process')

  const agentInfo = AgentInfo.create(fixture.config, Date.now())
  const dataSender = dataSenderFactory.create(fixture.config, agentInfo)

  const apiMetaInfo = ApiMetaInfo.create(agentInfo, methodDescriptor)
  dataSender.send(apiMetaInfo)

  t.ok(true)
})
