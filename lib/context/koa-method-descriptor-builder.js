/**
 * Pinpoint Node.js Agent
 * Copyright 2022-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class KoaMethodDescriptorBuilder {
    static make(builder) {
        if (!builder) {
            return
        }
        return builder.setParameterDescriptor('(ctx, next)')
    }
}

module.exports = KoaMethodDescriptorBuilder