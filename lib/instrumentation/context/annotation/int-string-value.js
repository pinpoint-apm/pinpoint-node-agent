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

    pAnnotationValue() {
        const pIntAnnotationValue = new annotationMessages.PIntStringValue()
        pIntAnnotationValue.setIntvalue(this.intValue)

        const stringValue = new wrappers.StringValue()
        stringValue.setValue(this.stringValue)
        pIntAnnotationValue.setStringvalue(stringValue)

        const pAnnotationValue = new annotationMessages.PAnnotationValue()
        pAnnotationValue.setIntstringvalue(pIntAnnotationValue)
        return pAnnotationValue
    }
}

module.exports = IntStringValue