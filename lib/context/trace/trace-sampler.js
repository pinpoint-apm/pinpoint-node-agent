/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const AntPathMatcher = require('../../utils/ant-path-matcher')
const { nextTransactionId, nextContinuedTransactionId, nextDisabledId, nextContinuedDisabledId } = require('./id-generator')

class TraceSampler {
    constructor(config) {
        this.config = config

        this.newSuccessState = {
            isSampled() {
                return true
            },
            nextId() {
                return nextTransactionId()
            }
        }

        this.newDisableState = {
            isSampled() {
                return false
            },
            nextId() {
                return nextDisabledId()
            }
        }

        this.continueSuccessState = {
            isSampled() {
                return true
            },
            nextId() {
                return nextContinuedTransactionId()
            }
        }

        this.continueDisableState = {
            isSampled() {
                return false
            },
            nextId() {
                return nextContinuedDisabledId()
            }
        }

        this.pathMatcher = new AntPathMatcher(config)
    }

    getContinueSuccessState() {
        return this.continueSuccessState
    }

    getContinueDisabledState() {
        return this.continueDisableState
    }

    newState(urlPath) {
        if (this.pathMatcher.matchPath(urlPath)) {
            return this.newDisableState
        }
        return this.newSuccessState
    }
}

module.exports = TraceSampler