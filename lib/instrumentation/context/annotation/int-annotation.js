/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const annotationMessages = require('../../../data/v1/Annotation_pb.js')

class IntAnnotation {
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
        return `IntAnnotation{ ${this.key}=${this.value} }`
    }

    pAnnotation() {
        const pAnnotation = new annotationMessages.PAnnotation()
        pAnnotation.setKey(this.key)

        const pAnnotationValue = new annotationMessages.PAnnotationValue()
        pAnnotationValue.setIntvalue(this.value)
        pAnnotation.setValue(pAnnotationValue)
        return pAnnotation
    }
}

module.exports = IntAnnotation