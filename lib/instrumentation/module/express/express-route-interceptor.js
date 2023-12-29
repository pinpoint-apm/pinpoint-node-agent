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
    constructor() {
        this.methodDescriptorBuilder = MethodDescriptorBuilder.makeRuntimeDetectionMethodDescriptorBuilder()
            .setClassName('Router')
            .setFileNameIndex(3)
    }
    
    prepareAfterTrace(router, args, returnedValue, context) {
        if (router.stack && router.stack.length) {
            const layer = router.stack[router.stack.length - 1]
            if (!layer) {
                return
            }
            InstrumentArrowFunction.make(layer, 'handle').addScopedInterceptor(new ExpressLayerInterceptor(context.getMethodDescriptorBuilder()))
        }
    }
}

module.exports = ExpressRouteInterceptor