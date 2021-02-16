/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */


const test = require('tape')
const grpc = require('@grpc/grpc-js')
const services = require('../../lib/data/grpc/Service_grpc_pb')
const { log } = require('../test-helper')
const GrpcDataSender = require('../../lib/client/grpc-data-sender')

let actualsPingSession
let endAction
// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/server.ts
function pingSession(call) {
    actualsPingSession.serverDataCount = 0
    call.on('data', (ping) => {
        actualsPingSession.serverDataCount++
        log.debug(`pingSession in data: ${JSON.stringify(ping.toObject())}`)
        call.write(ping)
        actualsPingSession.t.true(actualsPingSession.serverDataCount <= actualsPingSession.dataCount, 'dataCount is not matching')
        if (actualsPingSession.serverDataCount == actualsPingSession.dataCount) {
            endAction()
        }
    })
    actualsPingSession.serverEndCount = 0
    call.on('end', () => {
        actualsPingSession.serverEndCount++
        call.end()
        if (actualsPingSession.serverEndCount == 2) {
            actualsPingSession.t.equal(actualsPingSession.serverEndCount, actualsPingSession.endCount, 'bidirectional stream end count match')
        }
    })
}

test('when ping stream write throw a error, gRPC bidirectional stream Ping end ex) Deadline exceeded error case', function (t) {
    actualsPingSession = {}
    const server = new GrpcServer()

    server.addService(services.AgentService, {
        pingSession: pingSession
    })
    server.startup((port) => {
        actualsPingSession.endCount = 2
        actualsPingSession.dataCount = 2
        actualsPingSession.t = t

        this.grpcDataSender = new GrpcDataSender('localhost', port, port, port, {
            'agentid': '12121212',
            'applicationname': 'applicationName',
            'starttime': Date.now()
        })
      
        t.equal(this.grpcDataSender.pingStream.constructor.name, 'GrpcBidirectionalStream', `pingStream is the GrpcBidirectionalStream`)

        this.grpcDataSender.sendPing()

        this.grpcDataSender.pingStream.stream.write = (data) => {
            actualsPingSession.actualsData = data
            t.equal(actualsPingSession.actualsData.constructor.name, '', 'ping data equality')
            throw new Error('Deadline exceeded')
        }

        const originEnd = this.grpcDataSender.pingStream.stream.end
        this.grpcDataSender.pingStream.stream.end = () => {
            this.grpcDataSender.pingStream.actualEnded = true
            originEnd()
        }

        t.equal(this.grpcDataSender.pingStream.stream.constructor.name, 'ClientDuplexStreamImpl', 'when previous throw Deadline exceeded')
        this.grpcDataSender.sendPing()
        t.false(this.grpcDataSender.pingStream.stream, 'after throw Deadline exceeded, ')
        t.true(this.grpcDataSender.pingStream.actualEnded, 'when throw Deadline exceeded, ended')

        const originConnectStream = this.grpcDataSender.pingStream.connectStream
        this.grpcDataSender.pingStream.connectStream = () => {
            this.grpcDataSender.pingStream.actualConnectedStream = true
            originConnectStream.call(this.grpcDataSender.pingStream)
        }
        t.true(this.grpcDataSender.pingStream.stream === null, 'stream is null')
        t.false(this.grpcDataSender.pingStream.actualConnectedStream, 'stream not reconnected stream')
        this.grpcDataSender.sendPing()
        t.true(this.grpcDataSender.pingStream.stream, 'after sendPing, stream is an instance')
        
        endAction = () => {
            this.grpcDataSender.pingStream.end()
            setTimeout(() => {
                t.end()
                server.shutdown()
            }, 0)
        }
    })
})

function pingSessionServer(call) {
    actualsPingSessionServer.serverDataCount = 0
    call.on('data', (ping) => {
        actualsPingSessionServer.serverDataCount++
        actualsPingSessionServer.t.true(actualsPingSessionServer.serverDataCount <= actualsPingSessionServer.sendPingCount, 'server data count matches')
        call.write(ping)
    })
    actualsPingSession.serverEndCount = 0
    call.on('end', () => {
        endAction()
        call.end()
    })
}

let actualsPingSessionServer
test('Server end(), error, data Test', function (t) {
    t.plan(2)
    actualsPingSessionServer = {}
    const server = new GrpcServer()

    server.addService(services.AgentService, {
        pingSession: pingSessionServer
    })
    server.startup((port) => {
        actualsPingSessionServer.endCount = 2
        actualsPingSessionServer.t = t
        actualsPingSessionServer.sendPingCount = 0

        this.grpcDataSender = new GrpcDataSender('localhost', port, port, port, {
            'agentid': '12121212',
            'applicationname': 'applicationName',
            'starttime': Date.now()
        })

        let clientReceiveDataCount = 0
        const originData = this.grpcDataSender.pingStream.stream.listeners('data')[0]
        this.grpcDataSender.pingStream.stream.on('data', (data) => {
            clientReceiveDataCount++
            t.true(clientReceiveDataCount <= actualsPingSessionServer.sendPingCount, 'client receive data count')
            originData(data)
        })

        actualsPingSessionServer.sendPingCount++
        this.grpcDataSender.sendPing()

        this.grpcDataSender.pingStream.end()

        endAction = () => {
            setTimeout(() => {
                t.end()
                server.shutdown()
            }, 0)
        }
    })
})

class GrpcServer {
    constructor() {
        this.server = new grpc.Server()
    }

    addService(service, implementation) {
        this.server.addService(service, implementation)
    }

    startup(callback) {    
        this.server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (err, port) => {
            this.server.start()

            if (err) {
                throw new Error('this.server.bindAsync error')
            }
        
            if (callback) {
                callback(port)
            }
        })
    }
    
    shutdown() {
        this.server.forceShutdown()
    }
}