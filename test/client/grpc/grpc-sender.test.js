const test = require('tape')
const axios = require('axios')

const os = require('os');
const internalIp = require('internal-ip');

const { log, fixture, util, enableDataSending } = require('../../test-helper')
enableDataSending()

const GrpcSender = require('../../../lib/client/grpc/grpc-sender')
const grpcSender = new GrpcSender(fixture.config)

test('Should send agent info', function (t) {
  t.plan(1)

  const createAgentInfo = (config, agentStartTime) => {
    return {
      agentId: config.agentId,
      applicationName: config.applicationName,
      serviceType: config.serviceType,
      applicationServiceType: config.serviceType,
      startTimestamp: agentStartTime,
      agentStartTime: agentStartTime,
      agentVersion: { version : "1.8.5" },
      hostname: os.hostname(),
      ip: internalIp.v4.sync(),
      pid: process.pid,
      ports: '',
      vmVerson: '',
      container: config.container,
    }
  }

  grpcSender.sendAgentInfo(createAgentInfo(fixture.config, Date.now()))

  t.ok(grpcSender)
})

