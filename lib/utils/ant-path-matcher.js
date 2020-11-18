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
        this.stringMatcherCache = new Map()

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
        return this.doMatch(pattern, path, true)
    }

    doMatch(pattern, path, fullMatch) {
        if (path == null || path.startsWith(this.pathSeparator) != pattern.startsWith(this.pathSeparator)) {
            return false
        }

        const pattDirs = this.tokenizePattern(pattern)
        const pathDirs = this.tokenizePath(path)
        let pattIdxStart = 0
        let pattIdxEnd = pattDirs.length - 1
        let pathIdxStart = 0
        let pathIdxEnd = pathDirs.length - 1

        // Match all elements up to the first **
        while (pattIdxStart <= pattIdxEnd && pathIdxStart <= pathIdxEnd) {
            let pattDir = pattDirs[pattIdxStart];
            if ("**" == pattDir) {
                break;
            }
            if (!this.matchStrings(pattDir, pathDirs[pathIdxStart])) {
                return false;
            }
            pattIdxStart++;
            pathIdxStart++;
        }

        return true
    }

    tokenizePattern(pattern) {
        let tokenized
        if (this.cachePatterns) {
            tokenized = this.tokenizedPatternCache.get(pattern)
        }

        if (!tokenized) {
            tokenized = this.tokenizePath(pattern)
            if (this.cachePatterns) {
                this.tokenizedPatternCache.set(pattern, tokenized)
            }
        }
        return tokenized
    }

    tokenizePath(path) {
        return this.tokenizeToStringArray(path, this.pathSeparator, this.trimTokens, true);
    }

    tokenizeToStringArray(str, delimiter, trimToken, ignoreEmptyTokens) {
        if (str == null) {
            return EMPTY_STRING_ARRAY;
        }

        return str.split(delimiter)
            .map(token => trimToken ? token.trim() : token)
            .filter(token => !ignoreEmptyTokens || token.length > 0)
    }

    matchStrings(pattern, str) {
        return this.getStringMatcher(pattern).matchStrings(str)
    }

    getStringMatcher(pattern) {
        let matcher = null
        if (this.cachePatterns) {
            matcher = this.stringMatcherCache.get(pattern);
        }
        if (matcher == null) {
            matcher = new AntPathStringMatcher(pattern);
            if (this.cachePatterns) {
                this.stringMatcherCache.set(pattern, matcher);
            }
        }
        return matcher;
    }
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


// reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
const GLOB_PATTERN = new RegExp("\\?|\\*|\\{((?:\\{[^/]+?}|[^/{}]|\\\\[{}])+?)}", "g")
const DEFAULT_VARIABLE_PATTERN = "((?s).*)"
class AntPathStringMatcher {
    constructor(pattern, caseSensitive = true) {
        this.rawPattern = pattern
        this.caseSensitive = caseSensitive

        const matches = pattern.match(GLOB_PATTERN)
        let end = 0
        const patternBuilder = matches && matches.flatMap(function(match) {
            const patterns = []
            patterns.push(quote(pattern, end, match.index))
            if ("?" === match) {
                patterns.push('.')
            } else if ("*" === match) {
                patterns.push('.*')
            } else if (match.startsWith("{") && match.endsWith("}")) {
                const colonIdx = match.indexOf(':');
                if (colonIdx == -1) {
                    patterns.push(DEFAULT_VARIABLE_PATTERN)
                    this.variableNames.add(matcher.group(1));
                } else {
                    const variablePattern = match.substring(colonIdx + 1, match.length() - 1);
                    patterns.push('(')
                    patterns.push(variablePattern)
                    patterns.push(')')
                    const variableName = match.substring(1, colonIdx);
                    this.variableNames.add(variableName);
                }
            }
            return patterns
        })
        // while (matcher.find()) {
        //     patternBuilder.append(quote(pattern, end, matcher.start()));
        //     const match = matcher.group();
        //     if ("?".equals(match)) {
        //         patternBuilder.append('.');
        //     } else if ("*".equals(match)) {
        //         patternBuilder.append(".*");
        //     } else if (match.startsWith("{") && match.endsWith("}")) {
        //         const colonIdx = match.indexOf(':');
        //         if (colonIdx == -1) {
        //             patternBuilder.append(DEFAULT_VARIABLE_PATTERN);
        //             this.variableNames.add(matcher.group(1));
        //         } else {
        //             const variablePattern = match.substring(colonIdx + 1, match.length() - 1);
        //             patternBuilder.append('(');
        //             patternBuilder.append(variablePattern);
        //             patternBuilder.append(')');
        //             const variableName = match.substring(1, colonIdx);
        //             this.variableNames.add(variableName);
        //         }
        //     }
        //     end = matcher.end();
        // }
        // No glob pattern was found, this is an exact String match
        if (end == 0) {
            this.exactMatch = true;
            this.pattern = null;
        } else {
            this.exactMatch = false;
            patternBuilder.append(quote(pattern, end, pattern.length()));
            this.pattern = (this.caseSensitive ? Pattern.compile(patternBuilder.toString()) :
                    Pattern.compile(patternBuilder.toString(), Pattern.CASE_INSENSITIVE));
        }
    }

    matchStrings(str) {
        if (this.exactMatch) {
            return this.caseSensitive ? this.rawPattern === str : this.rawPattern.toUpperCase() === str.toUpperCase();
        } else if (this.pattern != null) {
            const matcher = this.pattern.matcher(str)
            if (matcher.test()) {
                return true;
            }
        }
        return false;
    }
}

function quote(s, start, end) {
    if (start == end) {
        return "";
    }
    return s.substring(start, end)
}

module.exports = AntPathMatcher