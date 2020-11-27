/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const log = require('../utils/logger')

// https://github.com/spring-projects/spring-framework/blob/master/spring-core/src/main/java/org/springframework/util/AntPathMatcher.java

const DEFAULT_PATH_SEPARATOR = "/"
const EMPTY_STRING_ARRAY = []
class AntPathMatcher {
    constructor(config) {
        this.pathSeparator = DEFAULT_PATH_SEPARATOR
        this.pathSeparatorPatternCache = new PathSeparatorPatternCache(DEFAULT_PATH_SEPARATOR)
        this.setCachePatterns(true)
        this.tokenizedPatternCache = new Map()
        this.stringMatcherCache = new Map()

        this.setTrimTokens(false)

        if (config) {
            const patterns = config.traceExclusionUrlPatterns || []
            this.patterns = Array.from(patterns)
        }
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
        try {
            return this.doMatch(pattern, path, true)
        } catch (error) {
            if (error && error.message) {
                log.error('match error: ' + error.message)
            }
            return false
        }
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
            if ("**" === pattDir) {
                break;
            }
            if (!this.matchStrings(pattDir, pathDirs[pathIdxStart])) {
                return false;
            }
            pattIdxStart++;
            pathIdxStart++;
        }

        if (pathIdxStart > pathIdxEnd) {
            // Path is exhausted, only match if rest of pattern is * or **'s
            if (pattIdxStart > pattIdxEnd) {
                return (pattern.endsWith(this.pathSeparator) == path.endsWith(this.pathSeparator));
            }
            if (!fullMatch) {
                return true;
            }
            if (pattIdxStart == pattIdxEnd && pattDirs[pattIdxStart] === "*" && path.endsWith(this.pathSeparator)) {
                return true;
            }
            for (let i = pattIdxStart; i <= pattIdxEnd; i++) {
                if (pattDirs[i] !== "**") {
                    return false;
                }
            }
            return true;
        } else if (pattIdxStart > pattIdxEnd) {
            // String not exhausted, but pattern is. Failure.
            return false;
        } else if (!fullMatch && "**" === pattDirs[pattIdxStart]) {
            // Path start definitely matches due to "**" part in pattern.
            return true;
        }

        // up to last '**'
        while (pattIdxStart <= pattIdxEnd && pathIdxStart <= pathIdxEnd) {
            const pattDir = pattDirs[pattIdxEnd];
            if (pattDir === "**") {
                break;
            }
            if (!this.matchStrings(pattDir, pathDirs[pathIdxEnd])) {
                return false;
            }
            pattIdxEnd--;
            pathIdxEnd--;
        }
        if (pathIdxStart > pathIdxEnd) {
            // String is exhausted
            for (let i = pattIdxStart; i <= pattIdxEnd; i++) {
                if (pattDirs[i] !== "**") {
                    return false;
                }
            }
            return true;
        }

        while (pattIdxStart != pattIdxEnd && pathIdxStart <= pathIdxEnd) {
            let patIdxTmp = -1;
            for (let i = pattIdxStart + 1; i <= pattIdxEnd; i++) {
                if (pattDirs[i] === "**") {
                    patIdxTmp = i;
                    break;
                }
            }
            if (patIdxTmp == pattIdxStart + 1) {
                // '**/**' situation, so skip one
                pattIdxStart++;
                continue;
            }
            // Find the pattern between padIdxStart & padIdxTmp in str between
            // strIdxStart & strIdxEnd
            const patLength = (patIdxTmp - pattIdxStart - 1);
            const strLength = (pathIdxEnd - pathIdxStart + 1);
            let foundIdx = -1;

            strLoop:
                for (let i = 0; i <= strLength - patLength; i++) {
                    for (let j = 0; j < patLength; j++) {
                        const subPat = pattDirs[pattIdxStart + j + 1];
                        const subStr = pathDirs[pathIdxStart + i + j];
                        if (!this.matchStrings(subPat, subStr)) {
                            continue strLoop;
                        }
                    }
                    foundIdx = pathIdxStart + i;
                    break;
                }

            if (foundIdx == -1) {
                return false;
            }

            pattIdxStart = patIdxTmp;
            pathIdxStart = foundIdx + patLength;
        }

        for (let i = pattIdxStart; i <= pattIdxEnd; i++) {
            if (pattDirs[i] !== "**") {
                return false;
            }
        }

        return true
    }

    matchPath(path) {
        // guard
        if (!this.patterns) {
            return false
        }

        for (const pattern of this.patterns) {
            if (this.match(pattern, path)) {
                return true
            }
        }
        return false
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
// https://www.regular-expressions.info/modifiers.html Spring source const DEFAULT_VARIABLE_PATTERN = "((?s).*)" is old 
// https://stackoverflow.com/questions/10927930/meaning-of-s-in-regex Turn on "dot matches newline" for the remainder of the regular expression. (Older regex flavors may turn it on for the entire regex.)
// so dot matches newline no needs
const DEFAULT_VARIABLE_PATTERN = "(.*)"
class AntPathStringMatcher {
    constructor(pattern, caseSensitive = true) {
        this.rawPattern = pattern
        this.caseSensitive = caseSensitive

        let end = 0
        const patternBuilder = []
        let matcher
        while ((matcher = GLOB_PATTERN.exec(pattern)) !== null) {
            patternBuilder.push(quote(pattern, end, matcher.index))
            const match = matcher[0]
            if ("?" === match) {
                patternBuilder.push('.')
            } else if ("*" === match) {
                patternBuilder.push('.*')
            } else if (match.startsWith("{") && match.endsWith("}")) {
                const colonIdx = match.indexOf(':');
                if (colonIdx == -1) {
                    patternBuilder.push(DEFAULT_VARIABLE_PATTERN)
                } else {
                    const variablePattern = match.substring(colonIdx + 1, match.length() - 1);
                    patternBuilder.push('(')
                    patternBuilder.push(variablePattern)
                    patternBuilder.push(')')
                    const variableName = match.substring(1, colonIdx);
                }
            }
            end = GLOB_PATTERN.lastIndex
        }

        // No glob pattern was found, this is an exact String match
        if (end == 0) {
            this.exactMatch = true;
            this.pattern = null;
        } else {
            this.exactMatch = false;
            patternBuilder.push(quote(pattern, end, pattern.length));
            this.pattern = new RegExp(`^${patternBuilder.join('')}$`, this.caseSensitive ? "g" : "gi")
        }
    }

    matchStrings(str) {
        if (this.exactMatch) {
            return this.caseSensitive ? this.rawPattern === str : this.rawPattern.toUpperCase() === str.toUpperCase();
        } else if (this.pattern != null) {
            this.pattern.lastIndex = 0
            return this.pattern.test(str)
        }
        return false;
    }
}

function quote(s, start, end) {
    if (start == end) {
        return "";
    }
    return s.substring(start, end).replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

module.exports = AntPathMatcher