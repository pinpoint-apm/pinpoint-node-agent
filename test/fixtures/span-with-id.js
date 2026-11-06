/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const SpanBuilder = require('../../lib/context/span-builder')
const RemoteTraceRootBuilder = require('../../lib/context/remote-trace-root-builder')

function spanWithId(transactionId) {
    return new SpanBuilder(new RemoteTraceRootBuilder('agentId', '1', transactionId).build()).build()
}

function spanMessageWithId(spanId) {
    return spanWithId(spanId).toProtocolBuffer()
}

module.exports = {
    spanWithId,
    spanMessageWithId,
}
