/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const annotationKey = require('../constant/annotation-key')

class DisableSpanRecorder {
    constructor(traceRoot, config) {
        this.traceRoot = traceRoot
        this.httpStatusCodeErrors = config.getHttpStatusCodeErrors()
    }

    recordServiceType() {}

    recordApiId() {}

    recordApi() {}

    setApiId0() {}

    recordAttribute(key, value) {
        if (key === annotationKey.HTTP_STATUS_CODE && this.httpStatusCodeErrors.isErrorCode(value)) {
            this.traceRoot.getShared().maskErrorCode(1)
        }
    }

    recordRpc() {}

    recordEndPoint() {}

    recordRemoteAddress() {}

    recordException(error, markError = true) {
        if (markError && error) {
            this.traceRoot.getShared().maskErrorCode(1)
        }
    }

    recordAcceptorHost() {}

    recordParentApplication() {}

    recordEnricher() {}
}

class NullDisableSpanRecorder {
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
    recordEnricher() {}
}

DisableSpanRecorder.nullObject = new NullDisableSpanRecorder()

module.exports = DisableSpanRecorder
