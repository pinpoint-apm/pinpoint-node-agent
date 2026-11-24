/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { ExceptionChain } = require('./exception-chain')
const { ExceptionMetaData } = require('./exception-meta-data')
const { LongAnnotation } = require('../../instrumentation/context/annotation/long-annotation')
const annotationKey = require('../../constant/annotation-key')

const maxAggregatedErrors = 10

// DefaultExceptionRecorder.java with the NEW/CONTINUED rule of ExceptionRecordingState.java and the sending of
// BufferedExceptionStorage.java: one per trace.
// An error whose chain is recorded, or that has the outermost error of a recorded chain in its cause chain, continues that chain.
// Java compares only with the chain it is recording; here the exceptions are built when the error is recorded,
// so every recorded chain is looked up.
class ExceptionRecorder {
    constructor(traceRoot, dataSender, maxDepth) {
        this.traceRoot = traceRoot
        this.dataSender = dataSender
        this.maxDepth = maxDepth
        this.chains = new Map()
    }

    recordException(spanEventBuilder, error) {
        const exceptionId = this.store(error, spanEventBuilder.getStartTime())
        spanEventBuilder.addAnnotation(new LongAnnotation(annotationKey.EXCEPTION_CHAIN_ID.getCode(), exceptionId))
    }

    store(error, startTime) {
        const chain = this.findContinuedChain(error)
        if (!chain) {
            return this.addChain(error, startTime)
        }
        this.set(chain.valueOf(error, startTime))
        this.addAggregatedErrors(error, chain.outermost.error, startTime)
        return chain.exceptionId
    }

    findContinuedChain(error) {
        let current = error
        let depth = 0
        while (current && depth < this.maxDepth) {
            for (const chain of this.chains.values()) {
                if (chain.outermost.error === current) {
                    return chain
                }
            }
            current = current.cause
            depth++
        }
    }

    addChain(error, startTime) {
        const chain = ExceptionChain.make(error, startTime, this.maxDepth)
        this.set(chain)
        this.addAggregatedErrors(error, null, startTime)
        return chain.exceptionId
    }

    // A chain with the exceptionId of a recorded chain takes its place
    set(chain) {
        this.chains.set(chain.exceptionId, chain)
    }

    // Each error in AggregateError.errors starts its own exception chain
    addAggregatedErrors(error, until, startTime) {
        this.aggregatedErrors(error, until).forEach(aggregatedError => {
            this.set(ExceptionChain.make(aggregatedError, startTime, this.maxDepth))
        })
    }

    aggregatedErrors(error, until) {
        const collected = this.errorsInChain(error, until, maxAggregatedErrors)
        const pending = [...collected]
        while (pending.length > 0 && collected.length < maxAggregatedErrors) {
            const errors = this.errorsInChain(pending.shift(), null, maxAggregatedErrors - collected.length)
            collected.push(...errors)
            pending.push(...errors)
        }
        return collected
    }

    errorsInChain(error, until, maxErrors) {
        const errors = []
        let current = error
        let depth = 0
        while (current && current !== until && depth < this.maxDepth && errors.length < maxErrors) {
            if (current instanceof AggregateError && Array.isArray(current.errors)) {
                const aggregatedErrors = current.errors.filter(aggregatedError => typeof aggregatedError?.name === 'string')
                errors.push(...aggregatedErrors.slice(0, maxErrors - errors.length))
            }
            current = current.cause
            depth++
        }
        return errors
    }

    close() {
        if (this.chains.size === 0) {
            return
        }

        const exceptions = [...this.chains.values()].flatMap(chain => chain.exceptions)
        this.chains = new Map()
        const uriTemplate = this.traceRoot.getEnricher('uriStats.uriTemplate') || 'NULL'
        this.dataSender.send(new ExceptionMetaData(this.traceRoot, exceptions, uriTemplate))
    }
}

const exceptionRecorderNullObject = Object.freeze({
    recordException() {},
    close() {}
})

module.exports = {
    ExceptionRecorder,
    exceptionRecorderNullObject
}
