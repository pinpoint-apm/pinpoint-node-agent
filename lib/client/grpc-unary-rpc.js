/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const log = require('../utils/logger')

// DEFAULT_CLIENT_REQUEST_TIMEOUT in GrpcTransportConfig.java
const DEFAULT_CLIENT_REQUEST_TIMEOUT = 6000
class GrpcUnaryRPC {
    constructor(name, client, unaryRPCFunction, retryInterval, retryTimes) {
        this.name = name
        this.client = client
        this.unaryRPCFunction = unaryRPCFunction
        this.retryInterval = retryInterval
        this.retryTimes = retryTimes
    }

    request(data, callback, timesOfRetry = 1) {
        const deadline = this.getDeadline()
        const name = this.name
        const self = this
        this.unaryRPCFunction.call(this.client, data, { deadline }, (err, response) => {
            if (name && err) {
                log.error(`${name} err: ${err}`)
            }

            if (err && timesOfRetry < self.retryTimes) {
                setTimeout(() => {
                    const times = timesOfRetry + 1
                    self.request(data, callback, times)
                }, self.retryInterval)
            } else if (callback) {
                callback(err, response)
            }
        })
    }

    getDeadline() {
        const deadline = new Date()
        deadline.setMilliseconds(deadline.getMilliseconds() + DEFAULT_CLIENT_REQUEST_TIMEOUT)
        return deadline
    }
}

module.exports = GrpcUnaryRPC