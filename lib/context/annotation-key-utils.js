/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const annotationKey = require('../constant/annotation-key')

// https://github.com/pinpoint-apm/pinpoint/blob/master/commons/src/main/java/com/navercorp/pinpoint/common/util/AnnotationKeyUtils.java
class AnnotationKeyUtils {
    static getArgs(index) {
        switch (index) {
            case 0:
                return annotationKey.ARGS0
            case 1:
                return annotationKey.ARGS1
            case 2:
                return annotationKey.ARGS2
            case 3:
                return annotationKey.ARGS3
            case 4:
                return annotationKey.ARGS4
            case 5:
                return annotationKey.ARGS5
            case 6:
                return annotationKey.ARGS6
            case 7:
                return annotationKey.ARGS7
            case 8:
                return annotationKey.ARGS8
            case 9:
                return annotationKey.ARGS9
            default:
                return annotationKey.ARGSN
        }
    }
}

module.exports = AnnotationKeyUtils