'use strict'

class GrpcStream {
    constructor(streamFactory, name) {
        this.stream = streamFactory((err, response) => {
            if (err) {
                log.error(err)
            }
        })
        this.stream.on('end', function () {
            log.debug(`${name} on(end)`)
        })
        this.stream.on('error', function (e) {
            log.debug(`${name} on(error): ${JSON.stringify(e)}`)
        })
        this.stream.on('status', function (status) {
            log.debug(`${name} on(status): ${JSON.stringify(status)}`)
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