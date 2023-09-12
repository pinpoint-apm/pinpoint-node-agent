/**
 * Pinpoint Node.js Agent
 * Copyright 2023-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

// ExecutionPolicy.java in Java Agent
class ExecutionPolicy {
    static ALWAYS = new ExecutionPolicy('ALWAYS')
    static BOUNDARY = new ExecutionPolicy('BOUNDARY')
    static INTERNAL = new ExecutionPolicy('INTERNAL')

    constructor(name) {
        this.name = name
    }

    isAlways() {
        return this === ExecutionPolicy.ALWAYS
    }

    isBoundary() {
        return this === ExecutionPolicy.BOUNDARY
    }

    isInternal() {
        return this === ExecutionPolicy.INTERNAL
    }
}

module.exports = ExecutionPolicy