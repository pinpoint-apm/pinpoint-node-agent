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
        this.stream.on('end', function () {
            log.debug(`${this.name} on(end)`)
        })
        this.stream.on('error', function (e) {
            log.debug(`${this.name} on(error): ${JSON.stringify(e)}`)
        })
        this.stream.on('status', function (status) {
            log.debug(`${this.name} on(status): ${JSON.stringify(status)}`)
        })
    }

    write(data) {
        this.stream.write(data)
    }

    end() {
        this.stream.end()
    }
}

module.exports = GrpcStream