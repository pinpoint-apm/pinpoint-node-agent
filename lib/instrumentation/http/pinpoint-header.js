/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class Header {
    static traceId = 'Pinpoint-TraceID'
    static spanId = 'Pinpoint-SpanID'
    static parentSpanId = 'Pinpoint-pSpanID'
    static sampled = 'Pinpoint-Sampled'
    static flags = 'Pinpoint-Flags'
    static parentApplicationName = 'Pinpoint-pAppName'
    static parentApplicationType = 'Pinpoint-pAppType'
    static parentApplicationNamespace = 'Pinpoint-pAppNamespace'
    static host = 'Pinpoint-Host'
}

module.exports = Header