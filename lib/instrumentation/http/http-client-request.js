/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

// ref: DefaultRequestTraceWriter.java
/**
 * In Node.js, an HTTP request is created using the `http.ClientRequest` object.
 * The `ClientRequest` class provides methods such as `getHeader` and `setHeader`
 * to access and modify HTTP request headers.
 */
class HttpClientRequest {
    constructor(request) {
        this.request = request

        // GET / HTTP/1.1
        // Host: example.com:500
        // 'host' header from the request, which includes the hostname and port (e.g., localhost:5000).
        this.host = this.getHeader('host')
    }

    setHeader(name, value) {
        this.request.setHeader?.(name, value)
    }

    getHeader(name) {
        return this.request.getHeader?.(name)
    }

    getHost() {
        return this.host
    }

    getMethod() {
        return this.request.method
    }

    /**
     * Extracts the pathname portion of the request URL, excluding any query string.
     *
     * This method constructs a full URL using the request's protocol, host, and path,
     * then uses the URL parser to safely extract only the pathname.
     *
     * Note: `http.ClientRequest.path` includes both the pathname and query string
     * (e.g., `/api/user?id=123`). Therefore, using `URL().pathname` ensures the result
     * excludes query parameters (e.g., `/api/user`), which is useful for routing or logging.
     *
     * @returns {string} The pathname portion of the request URL.
     */
    getHostWithPathname() {
        // Guard clause to prevent `new URL` from throwing an error
        // if `host` or `protocol` is undefined.
        if (!this.getHost() || !this.request.protocol) {
            return
        }

        return this.getHost() + new URL(`${this.request.protocol}//${this.getHost()}${this.request.path}`).pathname
    }
}

module.exports = HttpClientRequest