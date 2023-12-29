/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const BooleanAnnotation = require('./boolean-annotation')
const DataTypeAnnotation = require('./data-type-annotation')
const NullAnnotation = require('./null-annotation')
const IntAnnotation = require('./int-annotation')
const ObjectAnnotation = require('./object-annotation')
const StringAnnotation = require('./string-annotation')

class Annotations {
    static of(key, value) {
        if (value === undefined || value === null) {
            return new NullAnnotation(key)
        }
    
        if (typeof value === 'string') {
            return new StringAnnotation(key, value)
        }
    
        if (typeof value === 'object' && typeof value.pAnnotationValue === 'function') {
            return new DataTypeAnnotation(key, value)
        }
    
        if (typeof value === 'number') {
            return new IntAnnotation(key, value)
        }
    
        if (typeof value === 'boolean') {
            return new BooleanAnnotation(key, value)
        }
         
        return new ObjectAnnotation(key, value)
    }
}

module.exports = Annotations