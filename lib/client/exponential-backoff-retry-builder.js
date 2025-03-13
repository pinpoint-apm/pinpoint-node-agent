/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const retryStartState = {
    canRetry: function () {
        return false
    }
}

const retryReadyState = {
    canRetry: function () {
        return true
    }
}

class ExponentialBackoffRetry {
    constructor(maxAttempts, initialBackoff, backoffMultiplier, maxBackoff) {
        this.maxAttempts = maxAttempts
        this.initialBackoff = initialBackoff
        this.backoffMultiplier = backoffMultiplier
        this.maxBackoff = maxBackoff
        this.nextRetryBackoffMilliSeconds = this.initialBackoff
        this.attempts = 0
        this.retryState = retryReadyState
    }

    retry() {
        if (this.retryState.canRetry() === false) {
            return
        }

        if (this.completed) {
            return
        }

        this.attempts += 1
        if (this.attempts > this.maxAttempts) {
            this.completed = true
            return
        }

        const retryDelayMilliSeconds = this.nextRetryBackoffMilliSeconds
        this.nextRetryBackoffMilliSeconds = Math.min(this.maxBackoff, this.nextRetryBackoffMilliSeconds * this.backoffMultiplier)
        this.retryState = retryStartState
        setTimeout(() => {
            this.retryState = retryReadyState
            if (this.completed) {
                return
            }

            this.retryCallback()
        }, retryDelayMilliSeconds)
    }

    stop() {
        this.completed = true
    }

    availableRetry() {
        return this.completed === true
    }
}

class ExponentialBackoffRetryBuilder {
    constructor({ maxAttempts, initialBackoff, backoffMultiplier, maxBackoff }) {
        this.maxAttempts = maxAttempts
        this.initialBackoff = initialBackoff
        this.backoffMultiplier = backoffMultiplier
        this.maxBackoff = maxBackoff
    }

    setRetryCallback(retryCallback) {
        this.retryCallback = retryCallback
        return this
    }

    build() {
        const backoffRetry = new ExponentialBackoffRetry(this.maxAttempts, this.initialBackoff, this.backoffMultiplier, this.maxBackoff)
        backoffRetry.retryCallback = this.retryCallback
        return backoffRetry
    }
}

module.exports = ExponentialBackoffRetryBuilder