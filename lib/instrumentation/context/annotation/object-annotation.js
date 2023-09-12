/**
 * Pinpoint Node.js Agent
 * Copyright 2023-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const annotationMessages = require('../../../data/v1/Annotation_pb.js')

class ObjectAnnotation {
    constructor(key, value) {
        this.key = key
        this.value = value.toString()
    }

    getKey() {
        return this.key
    }

    getValue() {
        return this.value
    }

    toString() {
        return `ObjectAnnotation{${this.key}=${this.value}}`
    }

    pAnnotation() {
        const pAnnotation = new annotationMessages.PAnnotation()
        pAnnotation.setKey(this.key)

        const pAnnotationValue = new annotationMessages.PAnnotationValue()
        pAnnotationValue.setStringvalue(this.value)
        pAnnotation.setValue(pAnnotationValue)
        return pAnnotation
    }
}

module.exports = ObjectAnnotation