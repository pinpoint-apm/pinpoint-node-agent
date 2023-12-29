/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

// DefaultInterceptorScopeInvocation.java in Java Agent
class DefaultInterceptorScopeInvocation {
    constructor(name) {
        this.name = name
        this.depth = 0
        this.skippedBoundary = 0
    }

    tryEnter(policy) {
        if (policy.isAlways()) {
            this.depth++
            return true
        }

        if (policy.isBoundary()) {
            if (this.isActive()) {
                this.skippedBoundary++
                return false
            } else {
                this.depth++
                return true
            }
        }

        return false
    }    

    isActive() {
        return this.depth > 0
    }

    leave(policy) {
        if (policy.isAlways()) {
            this.depth--
            return
        }

        if (policy.isBoundary()) {
            if (this.isActive()) {
                this.depth--
                return
            } else {
                this.skippedBoundary--
                return
            }
        }
    }
    
}

module.exports = DefaultInterceptorScopeInvocation