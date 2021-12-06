/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class ExpressMethodDescriptorBuilder {
    static make(builder, objectName, layerName, handlerArgumentsLength) {
        if (!builder) {
            return
        }

        if (objectName === 'middleware') {
            if (typeof handlerArgumentsLength === 'number' && handlerArgumentsLength != 4) {
                if (layerName === '<anonymous>') {
                    return builder.setParameterDescriptor(`(req, res, next)`)
                }
                return builder.setParameterDescriptor(`(${layerName})`)
            } else {
                return builder.setParameterDescriptor(`(err, req, res, next)`)
            }
        }

        return builder.setParameterDescriptor('(path, callback)')
    }
}

module.exports = ExpressMethodDescriptorBuilder