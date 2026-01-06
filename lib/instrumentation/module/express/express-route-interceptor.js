/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const MethodDescriptorBuilder = require('../../../context/method-descriptor-builder')
const InstrumentArrowFunction = require('../../instrument-arrow-function')
const ExpressLayerInterceptor = require('./express-layer-interceptor')

class ExpressRouteInterceptor {
    constructor(traceContext) {
        this.traceContext = traceContext
    }

    prepareAfterTrace(router) {
        if (router.stack && router.stack.length) {
            const layer = router.stack[router.stack.length - 1]
            if (!layer) {
                return
            }
            const builder = new MethodDescriptorBuilder('route').setClassName('Router')
            InstrumentArrowFunction.make(layer, 'handle', this.traceContext).addScopedInterceptor(new ExpressLayerInterceptor(builder))
        }
    }
}

module.exports = ExpressRouteInterceptor