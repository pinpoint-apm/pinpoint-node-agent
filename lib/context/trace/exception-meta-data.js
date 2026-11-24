/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'
const spanMessages = require('../../data/v1/Span_pb')

class ExceptionMetaData {
    constructor(traceRoot, exceptions, uriTemplate) {
        this.traceRoot = traceRoot
        this.exceptions = exceptions
        this.uriTemplate = uriTemplate
    }

    isExceptionMetaData() {
        return true
    }

    valueOfProtocolBuffer() {
        const pExceptionMetaData = new spanMessages.PExceptionMetaData()
        pExceptionMetaData.setTransactionid(this.traceRoot.getTraceId().toProtocolBuffer())
        pExceptionMetaData.setSpanid(this.traceRoot.getTraceId().getSpanId())
        pExceptionMetaData.setUritemplate(this.uriTemplate)

        const pExceptions = this.exceptions.map(exception => {
            return exception.toProtocolBuffer()
        })
        pExceptionMetaData.setExceptionsList(pExceptions)
        return pExceptionMetaData
    }
}

module.exports = {
    ExceptionMetaData
}