/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class AsyncMethodDescriptor {
    constructor(type, apiDescriptor, lineNumber) {
        this.type = type
        this.apiDescriptor = apiDescriptor
        this.apiId = 0
        this.lineNumber = lineNumber || -1
    }

    getLineNumber() {
        return this.lineNumber
    }

    getLocation() {
        return this.location
    }
}

module.exports = AsyncMethodDescriptor