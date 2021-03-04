/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */
const grpc = require('@grpc/grpc-js')
'use strict'

class GrpcServer {
    constructor(portNumber = 0) {
        this.server = new grpc.Server()
        this.portNumber = portNumber
    }

    addService(service, implementation) {
        this.server.addService(service, implementation)
    }

    startup(callback) {    
        this.server.bindAsync(`localhost:${this.portNumber}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
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

    tryShutdown(callback) {
        this.server.tryShutdown((error) => {
            if (callback) {
                callback(error)
            }
        })
    }
}

module.exports = GrpcServer