/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class StreamCallback {
    static span = new StreamCallback()

    addCallback(callback) {
        this.callback = callback
    }

    grpcCallback(err, response) {
        this.callback?.(err, response)
    }
}

module.exports = StreamCallback