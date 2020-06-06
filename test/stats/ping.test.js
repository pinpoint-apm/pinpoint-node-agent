const test = require('tape')
const PinpointClient = require('../../lib/client/pinpoint-client')
const dataSenderMock = require(`../support/data-sender-mock`)
const { fixture, log } = require('../test-helper')
const DataSender = require('../../lib/client/data-sender')
const {PacketType} = require('../../lib/client/packet/packet-type')
const PingPacket = require('../../lib/client/packet/ping-packet')
const agent = require('../support/agent-singleton-mock')

test(`send ping interval`, async (t) => {
    t.plan(1)

    const config = fixture.config
    const client = new PinpointClient(config, {
        agentId: config.agentId
    })
    client.dataSender = dataSenderMock()
    t.true(client.dataSender.pingCount > 0, `agent ping schedule`)
    client.ping.scheduler.stop()
})

test(`sendStringMetaInfo, sendAgentInfo, sendApiMetaInfo`, (t) => {
    agent.bindHttp()
    
    const config = fixture.config
    const dataSender = new DataSender(config)
    t.plan(3)

    dataSender.tcpClient.send = () => {
        t.true(true, `sendAgentInfo use send method`)
    }
    dataSender.sendAgentInfo(agent.mockAgentInfo)

    dataSender.tcpClient.send = () => {
        t.true(true, `sendStringMetaInfo use send method`)
    }
    dataSender.sendStringMetaInfo({})

    dataSender.tcpClient.send = () => {
        t.true(true, `sendApiMetaInfo use send method`)
    }
    dataSender.sendApiMetaInfo({})
})

test(`Ping packet type`, (t) => {
    t.plan(1)
    const packet = new PingPacket()
    t.equal(packet.getPacketType(), PacketType.CONTROL_PING_PAYLOAD, 'packet type is payload')
})