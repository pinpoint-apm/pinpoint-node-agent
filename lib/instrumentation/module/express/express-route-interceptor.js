/**
 * Pinpoint Node.js Agent
 * Copyright 2023-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const MethodDescriptorBuilder = require('../../../context/method-descriptor-builder')
const patchLayer = require('./patch-layer')

class ExpressRouteInterceptor {
    constructor() {
        this.methodDescriptorBuilder = MethodDescriptorBuilder.makeRuntimeDetectionMethodDescriptorBuilder()
            .setClassName('Router')
            .setFileNameIndex(3)
    }
    
    prepareAfterTrace(router, args, returnedValue, wrapFunctionThis, context) {
        if (wrapFunctionThis.stack && wrapFunctionThis.stack.length) {
            const layer = wrapFunctionThis.stack[wrapFunctionThis.stack.length - 1]
            if (!layer) {
                return
            }
            patchLayer(layer, context)
        }
    }
}

module.exports = ExpressRouteInterceptor