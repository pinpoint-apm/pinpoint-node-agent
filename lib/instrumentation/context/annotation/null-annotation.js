/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const annotationMessages = require('../../../data/v1/Annotation_pb.js')
class NullAnnotation {
    constructor(key) {
        this.key = key
    }

    getKey() {
        return this.key
    }

    getValue() {
        return null
    }

    toString() {
        return `NullAnnotation{ ${this.key} }`
    }

    pAnnotation() {
        const pAnnotation = new annotationMessages.PAnnotation()
        pAnnotation.setKey(this.key)
        return pAnnotation
    }
}

module.exports = NullAnnotation