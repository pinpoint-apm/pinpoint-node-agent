/**
 * Pinpoint Node.js Agent
 * Copyright 2023-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const annotationMessages = require('../../../data/v1/Annotation_pb.js')

class DataTypeAnnotation {
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
        return `DataTypeAnnotation{${this.key}=${this.value}}`
    }

    pAnnotation() {
        const pAnnotation = new annotationMessages.PAnnotation()
        pAnnotation.setKey(this.key)

        if (typeof this.value === 'object' && typeof this.value.pAnnotationValue === 'function') {
            const annotationValue = this.value.pAnnotationValue()
            if (annotationValue) {
                pAnnotation.setValue(annotationValue)
            }
        }
        return pAnnotation
    }
}

module.exports = DataTypeAnnotation