'use strict'

const grpc = require('grpc')
// const service = require('../../data/grpc/service')
const services = require('../../data/grpc/Service_grpc_pb')
const statMessages = require('../../data/grpc/Stat_pb')
// const message = require('../../data/grpc/Stat_pb')
const log = require('../../utils/logger')

class GrpcSender {
  constructor (config) {
    if (!config) {
      throw new Error()
    }
    this.collectorIp = config.collectorIp
    this.collectorTcpPort = config.collectorTcpPort
    this.collectorStatPort = config.collectorStatPort
    this.collectorSpanPort = config.collectorSpanPort

    this.enabledDataSending = config.enabledDataSending

    console.log('config.agentStartTime', config)

    const interceptor = function(options, nextCall) {
        return new grpc.InterceptingCall(nextCall(options), {
                start: function(metadata, listener, next) {
                        metadata.add('agentid', config.agentId);
                        metadata.add('applicationname', config.applicationName);
                        metadata.add('starttime', Date.now()+ "");
                        next(metadata, listener, next);
                }
        });
    };

    const options = {interceptors: [interceptor]}

    this.agentClient = new services.AgentClient(
        '***REMOVED***:9991',
        grpc.credentials.createInsecure(),
        options,
    )


    // this.tcpClient = new TcpClient(this.collectorIp, this.collectorTcpPort)

    // if (this.tcpClient) {
    //   this.socketStateCode = SocketStateCode.RUN_WITHOUT_HANDSHAKE
    // }

    // this.spanUdpClient = new UdpClient(this.collectorIp, this.collectorSpanPort)
    // this.statUdpClient = new UdpClient(this.collectorIp, this.collectorStatPort)
  }

  sendAgentInfo (agentInfo) {
    if (agentInfo && this.enabledDataSending) {

      const pAgentInfo = new statMessages.PAgentInfo(agentInfo)
      this.agentClient.requestAgentInfo(pAgentInfo, (err, response) => {
        console.log('err', err)
        console.log('response', response)
      })
    }
  }
}

module.exports = GrpcSender
