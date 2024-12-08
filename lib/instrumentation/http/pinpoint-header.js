/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class Header {
    static traceId = 'Pinpoint-TraceID'.toLowerCase()
    static spanId = 'Pinpoint-SpanID'.toLowerCase()
    static parentSpanId = 'Pinpoint-pSpanID'.toLowerCase()
    static sampled = 'Pinpoint-Sampled'.toLowerCase()
    static flags = 'Pinpoint-Flags'.toLowerCase()
    static parentApplicationName = 'Pinpoint-pAppName'.toLowerCase()
    static parentApplicationType = 'Pinpoint-pAppType'.toLowerCase()
    static parentApplicationNamespace = 'Pinpoint-pAppNamespace'.toLowerCase()
    static host = 'Pinpoint-Host'.toLowerCase()
}

module.exports = Header