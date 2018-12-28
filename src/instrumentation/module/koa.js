'use strict'

const shimmer = require('shimmer')
const semver = require('semver')

const ServiceTypeCode = require('constant/service-type').ServiceTypeCode

module.exports = function(agent, version, koa) {

    // Test 1. emit handdle
    shimmer.wrap(koa.prototype, 'emit', function(original) {
        return function (evt, err, ctx) {
            const trace = agent.traceContext.currentTraceObject()
            let spanEventRecorder
            if (evt === 'error' & ctx) {
                spanEventRecorder = trace.traceBlockBegin()
                spanEventRecorder.recordServiceType(ServiceTypeCode.koa)
                spanEventRecorder.recordApi(ExpressMethodDescritpor.HANDLE) //todo. HANDLE 이 맞나?
                spanEventRecorder.recordException(err, true)
                trace.traceBlockEnd(spanEventRecorder)
                return original.apply(this, arguments)
            }
            if (trace) {
                spanEventRecorder = trace.traceBlockBegin()
                spanEventRecorder.recordServiceType(ServiceTypeCode.koa)
                spanEventRecorder.recordApi(ExpressMethodDescritpor.HANDLE)
            }
            const result = original.apply(this, arguments)
            if (trace) {
                trace.traceBlockEnd(spanEventRecorder)
            }
            return result
        }
    })
    // Test 2. middleware mount

    // Test 3. createContext

    // Test 4.


    return koa
}
