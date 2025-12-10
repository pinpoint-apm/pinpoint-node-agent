/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const localStorage = require('./context/local-storage')
const apiMetaService = require('../context/api-meta-service')
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
            let builder
            if (typeof wrapper.makeMethodDescriptorBuilder === 'function') {
                builder = wrapper.makeMethodDescriptorBuilder(this.interceptor.methodDescriptorBuilder)
            } else {
                builder = this.interceptor.methodDescriptorBuilder
            }

            if (typeof wrapper.prepareBeforeTrace === 'function') {
                wrapper.prepareBeforeTrace()
            }

            const trace = localStorage.getStore()
            if (trace && builder.isDetectedFunctionName()) {
                recorder = trace.traceBlockBegin()

                if (this.interceptor.serviceType) {
                    recorder.recordServiceType(this.interceptor.serviceType)
                }

                const methodDescriptor = apiMetaService.cacheApiWithBuilder(builder)
                if (methodDescriptor) {
                    recorder.recordApi(methodDescriptor)
                }

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
                wrapper.prepareAfterTrace()
            }

            if (recorder && typeof wrapper.doInAfterTrace === 'function') {
                wrapper.doInAfterTrace(recorder, result)
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