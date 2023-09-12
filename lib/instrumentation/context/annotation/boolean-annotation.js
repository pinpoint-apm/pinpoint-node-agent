/**
 * Pinpoint Node.js Agent
 * Copyright 2023-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const annotationMessages = require('../../../data/v1/Annotation_pb.js')

class BooleanAnnotation {
    constructor(key, value) {
        this.key = key
        this.value = value
    }

    getKey() {
        return this.key
    }

    getValue() {
        return this.value
    }

    toString() {
        return `BooleanAnnotation{${this.key}=${this.value}}`
    }

    pAnnotation() {
        const pAnnotation = new annotationMessages.PAnnotation()
        pAnnotation.setKey(this.key)
        return pAnnotation
    }
}

module.exports = BooleanAnnotation