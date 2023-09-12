/**
 * Pinpoint Node.js Agent
 * Copyright 2023-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const annotationMessages = require('../../../data/v1/Annotation_pb.js')
const wrappers = require('google-protobuf/google/protobuf/wrappers_pb')

class StringStringValue {
    constructor(stringValue1, stringValue2) {
        this.stringValue1 = stringValue1
        this.stringValue2 = stringValue2
    }

    getStringValue1() {
        return this.stringValue1
    }

    getStringValue2() {
        return this.stringValue2
    }

    isDataType() {
        return true
    }

    toString() {
        return `StringStringValue{stringValue1='${this.stringValue1}', stringValue2='${this.stringValue2}'}`
    }

    pAnnotationValue() {
        const pStringStringAnnotationValue = new annotationMessages.PStringStringValue()

        const stringValue1 = new wrappers.StringValue()
        stringValue1.setValue(this.stringValue1)
        pStringStringAnnotationValue.setStringvalue1(stringValue1)

        const stringValue2 = new wrappers.StringValue()
        stringValue2.setValue(this.stringValue2)
        pStringStringAnnotationValue.setStringvalue2(stringValue2)

        const pAnnotationValue = new annotationMessages.PAnnotationValue()
        pAnnotationValue.setStringstringvalue(pStringStringAnnotationValue)
        return pAnnotationValue
    }
}

module.exports = StringStringValue