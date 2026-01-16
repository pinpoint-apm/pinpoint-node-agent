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
    }

    prepareAfterTrace(router, args) {
        const fn = args && args[1]
        if (fn && fn.name !== 'router' && router.stack && router.stack.length) {
            const layer = router.stack[router.stack.length - 1]
            if (!layer) {
                return
            }
            const builder = new MethodDescriptorBuilder('use').setClassName('Router')
            InstrumentArrowFunction.make(layer, 'handle', this.traceContext).addScopedInterceptor(new ExpressLayerInterceptor(this.traceContext, builder))
        }
    }
}

module.exports = ExpressUseInterceptor