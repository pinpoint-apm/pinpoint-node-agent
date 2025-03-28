/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class UndiciClientRequest {
    constructor(request) {
        this.request = request

        const url = new URL(request.origin)
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

    // https://github.com/nodejs/undici/blob/981636f5fb882ff684c11177a3bfc8b1cf061f3a/lib/core/request.js#L137C54-L137C59
    getHostWithPathname() {
        return this.getHost() + (this.pathname ?? '')
    }
}

module.exports = UndiciClientRequest