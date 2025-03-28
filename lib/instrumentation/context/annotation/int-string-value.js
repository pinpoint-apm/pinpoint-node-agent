/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const annotationMessages = require('../../../data/v1/Annotation_pb.js')
const wrappers = require('google-protobuf/google/protobuf/wrappers_pb')

class IntStringValue {
    constructor(intValue, stringValue) {
        this.intValue = intValue
        this.stringValue = stringValue
    }

    getIntValue() {
        return this.intValue
    }

    getStringValue() {
        return this.stringValue
    }

    toString() {
        return `IntStringValue{intValue=${this.intValue}, stringValue='${this.stringValue}'}`
    }

    // call from DataTypeAnnotation.pAnnotationValue()
    pAnnotationValue() {
        const pIntStringValue = this.pIntStringValue()

        const pAnnotationValue = new annotationMessages.PAnnotationValue()
        pAnnotationValue.setIntstringvalue(pIntStringValue)
        return pAnnotationValue
    }

    pIntStringValue() {
        const pIntStringValue = new annotationMessages.PIntStringValue()
        pIntStringValue.setIntvalue(this.intValue)

        const stringValue = new wrappers.StringValue()
        stringValue.setValue(this.stringValue)
        pIntStringValue.setStringvalue(stringValue)
        return pIntStringValue
    }
}

module.exports = IntStringValue