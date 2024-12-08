/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const MethodDescriptorBuilder = require('../../../context/method-descriptor-builder')
const InstrumentArrowFunction = require('../../instrument-arrow-function')
const ExpressLayerInterceptor = require('./express-layer-interceptor')
class ExpressUseInterceptor {
    constructor(traceContext) {
        this.traceContext = traceContext
        this.methodDescriptorBuilder = new MethodDescriptorBuilder('use')
           .setClassName('Router')
           .setFileNameIndex(5)
    }

    prepareAfterTrace(router, args, returnedValue, context) {
        const fn = args && args[1]
        if (fn && fn.name !== 'router' && router.stack && router.stack.length) {
            const layer = router.stack[router.stack.length - 1]
            if (!layer) {
                return
            }
            InstrumentArrowFunction.make(layer, 'handle', this.traceContext).addScopedInterceptor(new ExpressLayerInterceptor(context.getMethodDescriptorBuilder()))
        }
    }
}

module.exports = ExpressUseInterceptor