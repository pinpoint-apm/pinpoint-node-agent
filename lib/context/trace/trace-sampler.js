/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const AntPathMatcher = require('../../utils/ant-path-matcher')
const SequenceGenerator = require('../sequence-generator')
const { nextTransactionId, nextContinuedTransactionId, nextDisabledId, nextContinuedDisabledId } = require('./id-generator')
const TraceRootBuilder = require('../trace-root-builder')
const RemoteTraceRootBuilder = require('../remote-trace-root-builder')

class TraceSampler {
    constructor(agentInfo, config) {
        this.agentInfo = agentInfo
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

        this.countingSampler = {
            counter: new SequenceGenerator(0, config.getSamplingRate() * 100000000),
            isSampling: function() {
                if (config.getSamplingRate() === 1) {
                    return true
                }
                if (config.getSamplingRate() < 1) {
                    return false
                }
                return this.counter.getAndIncrement() % config.getSamplingRate() === 0
            }
        }

        this.localTraceRootBuilder = new TraceRootBuilder(agentInfo.getAgentId())
    }

    makeContinueDisableTraceRoot() {
        const nextId = this.continueDisableState.nextId()
        return this.localTraceRootBuilder.make(nextId).build()
    }

    makeNewTraceRoot(urlPath) {
        const state = this.newState(urlPath)
        if (!state.isSampled()) {
            return this.localTraceRootBuilder.make(state.nextId()).build()
        }
        return new RemoteTraceRootBuilder(this.agentInfo, state.nextId()).build()
    }

    getContinueSuccessState() {
        return this.continueSuccessState
    }

    makeContinueTraceRoot(traceId) {
        const nextId = this.continueSuccessState.nextId()
        const builder = new RemoteTraceRootBuilder(this.agentInfo, nextId)
        builder.setTraceId(traceId)
        return builder.build()
    }

    getContinueDisabledState() {
        return this.continueDisableState
    }

    newState(urlPath) {
        if (!this.config.sampling) {
            return this.newDisableState
        }

        if (this.pathMatcher.matchPath(urlPath)) {
            return this.newDisableState
        }

        // isNewSampled in BasicTraceSampler.java
        if (!this.isSampling()) {
            return this.newDisableState
        }
        return this.newSuccessState
    }

    isSampling() {
        return this.countingSampler.isSampling()
    }
}

module.exports = TraceSampler