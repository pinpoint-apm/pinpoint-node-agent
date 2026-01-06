/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const localStorage = require('./context/local-storage')
const log = require('../utils/log/logger')

class InterceptorRunner {
    constructor(interceptor, hookFunctionArguments, callSiteConstructorOpt) {
        this.interceptor = interceptor
        this.original = hookFunctionArguments.getOriginal()
        this.callSiteConstructorOpt = callSiteConstructorOpt
    }

    run(wrapper, thisArg, argsArray) {
        let recorder
        try {
            if (typeof wrapper.prepareBeforeTrace === 'function') {
                wrapper.prepareBeforeTrace()
            }

            const trace = localStorage.getStore()
            if (trace) {
                recorder = trace.traceBlockBegin()

                if (typeof wrapper.doInBeforeTrace === 'function') {
                    wrapper.doInBeforeTrace(recorder)
                }
            }
        } catch (error) {
            // TODO: INTERNAL ERROR logger
            log.error(error)
        }

        const result = this.original.apply(thisArg, argsArray)

        try {
            if (typeof wrapper.prepareAfterTrace === 'function') {
                wrapper.prepareAfterTrace(thisArg, argsArray, result)
            }

            if (recorder && typeof wrapper.doInAfterTrace === 'function') {
                wrapper.doInAfterTrace(recorder, thisArg, argsArray, result)
            }

            const trace = localStorage.getStore()
            if (trace && recorder) {
                trace.traceBlockEnd(recorder)
            }
        } catch (error) {
            // TODO: INTERNAL ERROR logger
            log.error(error)
        }
        return result
    }
}

module.exports = InterceptorRunner