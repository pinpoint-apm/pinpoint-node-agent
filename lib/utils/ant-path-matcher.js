/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

// https://github.com/spring-projects/spring-framework/blob/master/spring-core/src/main/java/org/springframework/util/AntPathMatcher.java

const DEFAULT_PATH_SEPARATOR = "/"
const EMPTY_STRING_ARRAY = []
class AntPathMatcher {
    constructor() {
        this.pathSeparator = DEFAULT_PATH_SEPARATOR
        this.pathSeparatorPatternCache = new PathSeparatorPatternCache(DEFAULT_PATH_SEPARATOR)
        this.setCachePatterns(true)
        this.tokenizedPatternCache = new Map()

        this.setTrimTokens(false)
    }

    setCachePatterns(cachePatterns) {
        this.cachePatterns = cachePatterns;
    }

    deactivatePatternCache() {
        this.cachePatterns = false
        this.tokenizedPatternCache.clear()
        this.stringMatcherCache.clear()
    }

    setTrimTokens(trimTokens) {
        this.trimTokens = trimTokens
    }

    match(pattern, path) {
        return this.doMatch(pattern, path, true, null)
    }

    doMatch(pattern, path, fullMatch, uriTemplateVariables) {
        if (path == null || path.startsWith(this.pathSeparator) != pattern.startsWith(this.pathSeparator)) {
            return false
        }

        const pattDirs = this.tokenizePattern(pattern)
        return true
    }

    tokenizePattern(pattern) {
        let tokenized
        const cachePatterns = this.cachePatterns
        if (!cachePatterns || cachePatterns) {
            tokenized = this.tokenizedPatternCache.get(pattern)
        }

        if (!tokenized) {

        }
        return tokenized
    }

    // tokenizePath(path) {
    //     return this.tokenizeToStringArray(path, this.pathSeparator, this.trimTokens, true);
    // }

    // tokenizeToStringArray(str, delimiters, trimTokens, ignoreEmptyTokens) {
    //     if (str == null) {
    //         return EMPTY_STRING_ARRAY;
    //     }

    //     StringTokenizer st = new StringTokenizer(str, delimiters);
    //     List < String > tokens = new ArrayList < > ();
    //     while (st.hasMoreTokens()) {
    //         String token = st.nextToken();
    //         if (trimTokens) {
    //             token = token.trim();
    //         }
    //         if (!ignoreEmptyTokens || token.length() > 0) {
    //             tokens.add(token);
    //         }
    //     }
    //     return toStringArray(tokens);
    // }
}

class PathSeparatorPatternCache {
    constructor(pathSeparator) {
        this.endsOnWildCard = pathSeparator + "*"
        this.endsOnDoubleWildCard = pathSeparator + "**"
    }

    getEndsOnWildCard() {
        return this.endsOnWildCard;
    }

    getEndsOnDoubleWildCard() {
        return this.endsOnDoubleWildCard;
    }
}

module.exports = AntPathMatcher