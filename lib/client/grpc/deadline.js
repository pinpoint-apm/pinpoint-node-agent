/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

// DEFAULT_CLIENT_REQUEST_TIMEOUT in GrpcTransportConfig.java
const DEFAULT_CLIENT_REQUEST_TIMEOUT = 6000
class Deadline {
    getDeadline() {
        const deadline = new Date()
        deadline.setMilliseconds(deadline.getMilliseconds() + DEFAULT_CLIENT_REQUEST_TIMEOUT)
        return deadline
    }
}

module.exports = Deadline