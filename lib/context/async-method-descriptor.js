'use strict'

class AsyncMethodDescriptor {
    constructor(type, apiDescriptor, lineNumber) {
        this.type = type
        this.apiDescriptor = apiDescriptor
        this.apiId = 0
        this.lineNumber = lineNumber || -1
    }
}

module.exports = AsyncMethodDescriptor