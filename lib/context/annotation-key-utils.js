/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const DefaultAnnotationKey = require('../constant/annotation-key').DefaultAnnotationKey

// https://github.com/pinpoint-apm/pinpoint/blob/master/commons/src/main/java/com/navercorp/pinpoint/common/util/AnnotationKeyUtils.java
class AnnotationKeyUtils {
    static getArgs(index) {
        switch (index) {
            case 0:
                return DefaultAnnotationKey.ARGS0
            case 1:
                return DefaultAnnotationKey.ARGS1
            case 2:
                return DefaultAnnotationKey.ARGS2
            case 3:
                return DefaultAnnotationKey.ARGS3
            case 4:
                return DefaultAnnotationKey.ARGS4
            case 5:
                return DefaultAnnotationKey.ARGS5
            case 6:
                return DefaultAnnotationKey.ARGS6
            case 7:
                return DefaultAnnotationKey.ARGS7
            case 8:
                return DefaultAnnotationKey.ARGS8
            case 9:
                return DefaultAnnotationKey.ARGS9
            default:
                return DefaultAnnotationKey.ARGSN
        }
    }
}

module.exports = AnnotationKeyUtils