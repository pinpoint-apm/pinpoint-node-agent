/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const TraceHeaderBuilder = require('./trace-header-builder')

class HttpRequestTrace {
    constructor(rpcName, traceFactory) {
        this.rpcName = rpcName
        this.traceFactory = traceFactory
    }

    makeTrace() {
        return this.traceFactory()
    }
}

// RequestTraceReader.java
class HttpRequestTraceBuilder {
    constructor(traceContext, request) {
        this.traceContext = traceContext
        this.request = request
    }

    build() {
        const url = new URL(`http://${process.env.HOST ?? 'localhost'}${this.request.url}`)
        const requestTrace = this.makeRequestTrace(url.pathname)
        return requestTrace
    }

    // read method in java agent
    makeRequestTrace(rpcName) {
        const traceHeader = new TraceHeaderBuilder(this.request).build()
        if (traceHeader.isDisable()) {
            return new HttpRequestTrace(rpcName, () => {
                return this.traceContext.disableSampling()
            })
        }
    
        if (traceHeader.isNewTrace()) {
            return new HttpRequestTrace(rpcName, () => {
                return this.traceContext.newTraceObject2()
            })
        }
    
        return new HttpRequestTrace(rpcName, () => {
            return this.traceContext.continueTraceObject()
        })
    }
}

module.exports = HttpRequestTraceBuilder