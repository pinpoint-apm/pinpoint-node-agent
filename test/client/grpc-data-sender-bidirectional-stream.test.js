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

let actuals
let endCount = 0
let dataCount = 0
let endAction
// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/server.ts
function pingSession(call) {
    call.on('data', (ping) => {
        dataCount++
        log.debug(`pingSession in data: ${JSON.stringify(ping.toObject())}`)
        call.write(ping)
        actuals.t.true(dataCount <= actuals.dataCount, 'dataCount is not matching')
        if (dataCount == actuals.dataCount) {
            endAction()
        }
    })
    call.on('end', (arg1) => {
        endCount++
        log.debug(`pingSession in end: ${JSON.stringify(arg1)}`)
        call.end()
        if (endCount == 2) {
            actuals.t.equal(endCount, actuals.endCount, 'bidirectional stream end count match')
        }
    })
}

test('when ping stream write throw a error, gRPC bidirectional stream Ping end ex) Deadline exceeded error case', function (t) {
    actuals = {}
    const server = new GrpcServer()

    server.addService(services.AgentService, {
        pingSession: pingSession
    })
    server.startup((port) => {
        actuals.endCount = 2
        actuals.dataCount = 2
        actuals.t = t

        this.grpcDataSender = new GrpcDataSender('localhost', port, port, port, {
            'agentid': '12121212',
            'applicationname': 'applicationName',
            'starttime': Date.now()
        })
      
        t.equal(this.grpcDataSender.pingStream.constructor.name, 'GrpcBidirectionalStream', `pingStream is the GrpcBidirectionalStream`)

        this.grpcDataSender.sendPing()

        this.grpcDataSender.pingStream.stream.write = (data) => {
            actuals.actualsData = data
            t.equal(actuals.actualsData.constructor.name, '', 'ping data equality')
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