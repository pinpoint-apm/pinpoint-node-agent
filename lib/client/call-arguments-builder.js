/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const grpc = require('@grpc/grpc-js')

class CallArguments {
    constructor(callback) {
        this.callback = callback
    }

    getCallback() {
        return this.callback
    }

    getMetadata() {
        return this.metadata
    }

    getOptions() {
        const options = this.options
        if (this.deadlineMilliseconds) {
            const deadline = new Date()
            deadline.setMilliseconds(deadline.getMilliseconds() + this.deadlineMilliseconds)
            options.deadline = deadline
        }
        return options
    }
}

const DEFAULT_CLIENT_REQUEST_TIMEOUT = 6000
class CallArgumentsBuilder {
    static emptyCallArguments() {
        return new CallArgumentsBuilder().build()
    }

    constructor(callback) {
        this.callback = callback
        this.metadata = new grpc.Metadata()
        this.options = {}
    }

    setDeadlineMilliseconds(deadlineMilliseconds) {
        this.deadlineMilliseconds = deadlineMilliseconds
        return this
    }

    setMetadata(key, value) {
        this.metadata.set(key, value)
        return this
    }

    build() {
        const callArguments = new CallArguments(this.callback)
        callArguments.metadata = this.metadata
        callArguments.options = this.options
        callArguments.deadlineMilliseconds = this.deadlineMilliseconds ?? DEFAULT_CLIENT_REQUEST_TIMEOUT
        return callArguments
    }
}

module.exports = CallArgumentsBuilder