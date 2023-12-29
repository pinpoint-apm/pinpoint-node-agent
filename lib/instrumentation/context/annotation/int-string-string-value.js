/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const annotationMessages = require('../../../data/v1/Annotation_pb.js')
const wrappers = require('google-protobuf/google/protobuf/wrappers_pb')

// ref: IntStringStringValue.java in pinpoint
class IntStringStringValue {
    constructor(intValue, stringValue1, stringValue2) {
        this.intValue = intValue
        this.stringValue1 = stringValue1
        this.stringValue2 = stringValue2
    }

    getIntValue() {
        return this.intValue
    }

    getStringValue1() {
        return this.stringValue1
    }

    getStringValue2() {
        return this.stringValue2
    }

    toString() {
        return `IntStringStringValue{intValue=${this.intValue}, stringValue1='${this.stringValue1}', stringValue2='${this.stringValue2}'}`
    }

    pAnnotationValue() {
        const pIntStringStringAnnotationValue = new annotationMessages.PIntStringStringValue()
        pIntStringStringAnnotationValue.setIntvalue(this.intValue)

        const stringValue1 = new wrappers.StringValue()
        stringValue1.setValue(this.stringValue1)
        pIntStringStringAnnotationValue.setStringvalue1(stringValue1)

        const stringValue2 = new wrappers.StringValue()
        stringValue2.setValue(this.stringValue2)
        pIntStringStringAnnotationValue.setStringvalue2(stringValue2)

        const pAnnotationValue = new annotationMessages.PAnnotationValue()
        pAnnotationValue.setIntstringstringvalue(pIntStringStringAnnotationValue)
        return pAnnotationValue
    }
}

module.exports = IntStringStringValue