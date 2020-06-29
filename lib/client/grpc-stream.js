'use strict'

const log = require('../utils/logger')

class GrpcStream {
    constructor(name, newStream) {
        this.newStream = newStream
        this.name = name

        this.connectStream()
    }

    connectStream() {
        this.stream = this.newStream()
        this.stream.on('data', (data) => {
            log.debug(`GrpcStream ${this.name} on(data): ${data}`)
        })
        this.stream.on('end', () => {
            log.debug(`GrpcStream ${this.name} on(end)`)
        })
        this.stream.on('error', (e) => {
            log.debug(`GrpcStream ${this.name} on(error): ${JSON.stringify(e)}`)
        })
        this.stream.on('status', (status) => {
            log.debug(`GrpcStream ${this.name} on(status): ${JSON.stringify(status)}`)
        })
    }

    write(data) {
        if (!this.stream) {
            this.stream = this.newStream()
        }
        this.stream.write(data)
    }

    end() {
        this.stream.end()
        this.stream = null
    }
}

module.exports = GrpcStream