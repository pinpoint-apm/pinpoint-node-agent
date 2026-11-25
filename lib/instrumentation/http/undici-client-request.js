/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class UndiciClientRequest {
    constructor(request) {
        this.request = request

        // undici Request keeps the scheme and host in `origin`, the path and query in `path`
        const url = new URL(request.origin + request.path)
        this.host = url.host
        this.pathname = url.pathname
    }

    setHeader(name, value) {
        this.request.addHeader?.(name, value)
    }

    getHost() {
        return this.host
    }

    getMethod() {
        return this.request.method
    }

    getHostWithPathname() {
        return this.getHost() + this.pathname
    }
}

module.exports = UndiciClientRequest
