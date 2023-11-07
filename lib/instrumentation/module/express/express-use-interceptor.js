/**
 * Pinpoint Node.js Agent
 * Copyright 2023-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const MethodDescriptorBuilder2 = require("../../../context/method-descriptor-builder2")
const patchLayer = require("./patch-layer")

class ExpressUseInterceptor {
    constructor() {
        this.methodDescriptorBuilder = new MethodDescriptorBuilder2('use')
           .setClassName('Router')
           .setFileNameIndex(5)
    }

    prepareAfterTrace(router, args, returnedValue, wrapFunctionThis, context) {
        const fn = args && args[1]
        if (fn && fn.name !== 'router' && wrapFunctionThis.stack && wrapFunctionThis.stack.length) {
            const layer = wrapFunctionThis.stack[wrapFunctionThis.stack.length - 1]
            if (!layer) {
                return
            }
            patchLayer(layer, context)
        }
    }
}

module.exports = ExpressUseInterceptor