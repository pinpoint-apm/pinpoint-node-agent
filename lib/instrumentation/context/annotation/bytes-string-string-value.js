/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const annotationMessages = require('../../../data/v1/Annotation_pb.js')
const wrappers = require('google-protobuf/google/protobuf/wrappers_pb')

class BytesStringStringValue {
    constructor(bytesValue, stringValue1, stringValue2) {
        this.bytesValue = bytesValue
        this.stringValue1 = stringValue1
        this.stringValue2 = stringValue2
    }

    getBytesValue() {
        return this.bytesValue
    }

    getStringValue1() {
        return this.stringValue1
    }

    getStringValue2() {
        return this.stringValue2
    }

    toString() {
        return `BytesStringStringValue{bytesValue=${this.bytesValue}, stringValue1='${this.stringValue1}', stringValue2='${this.stringValue2}'}`
    }

    pAnnotationValue() {
        const pBytesStringStringAnnotationValue = new annotationMessages.PBytesStringStringValue()
        pBytesStringStringAnnotationValue.setBytesvalue(this.bytesValue)

        const stringValue1 = new wrappers.StringValue()
        stringValue1.setValue(this.stringValue1)
        pBytesStringStringAnnotationValue.setStringvalue1(stringValue1)

        const stringValue2 = new wrappers.StringValue()
        stringValue2.setValue(this.stringValue2)
        pBytesStringStringAnnotationValue.setStringvalue2(stringValue2)

        const pAnnotationValue = new annotationMessages.PAnnotationValue()
        pAnnotationValue.setBytesstringstringvalue(pBytesStringStringAnnotationValue)
        return pAnnotationValue
    }
}

module.exports = BytesStringStringValue