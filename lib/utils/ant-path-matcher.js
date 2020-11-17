/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

// https://github.com/spring-projects/spring-framework/blob/master/spring-core/src/main/java/org/springframework/util/AntPathMatcher.java

class AntPathMatcher {
    constructor() {
        this.pathSeparator = "/"
    }

    match(pattern, path) {
        return this.doMatch(pattern, path, true, null)
    }

    doMatch(pattern, path, fullMatch, uriTemplateVariables) {
        if (path == null || path.startsWith(this.pathSeparator) != pattern.startsWith(this.pathSeparator)) {
			return false
        }
        
        return true
    }
}

module.exports = AntPathMatcher