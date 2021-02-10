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

function pingSession(call) {
    call.on('data', (ping) => {
        log.debug(`[pingSession] Write: ${JSON.stringify(ping.toObject())}`)
        call.write(ping)
    })
}

test('gRPC bidirectional stream Ping', function (t) {
    const server = new GrpcServer()

    server.addService(services.AgentService, {
        pingSession: pingSession
    })
    server.startup((port) => {
        this.grpcDataSender = new GrpcDataSender('localhost', port, port, port, {
            'agentid': '12121212',
            'applicationname': 'applicationName',
            'starttime': Date.now()
        })
    })
    
    setTimeout((error) => {
        t.false(error, 'server graceful shutdown')
        t.end()
        server.shutdown()
    }, 0)
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
    
    shutdown(callback) {
        this.server.tryShutdown((error) => {
            if (callback) {
                callback(error)
            }
        })
    }
}