/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class DisableSpanRecorder {
    constructor() {
        this.enricher = enricherNullObject
    }

    recordServiceType() {}

    recordApiId() {}

    recordApi() {}

    setApiId0() {}

    recordAttribute() {}

    recordRpc() {}

    recordEndPoint() {}

    recordRemoteAddress() {}

    recordException() {}

    recordAcceptorHost() {}

    recordParentApplication() {}

    recordEnricher(moduleName, ...args) {
        this.enricher.record(moduleName, ...args)
    }
}

const enricherNullObject = Object.freeze({
    record() {

    }
})

module.exports = DisableSpanRecorder