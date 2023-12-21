/**
 * Pinpoint Node.js Agent
 * Copyright 2023-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class HookFunctionArguments {
    constructor(target, methodName, original) {
        this.target = target
        this.methodName = methodName
        this.original = original
    }

    getTarget() {
        return this.target
    }

    getMethodName() {
        return this.methodName
    }

    getOriginal() {
        return this.original
    }
}

module.exports = HookFunctionArguments