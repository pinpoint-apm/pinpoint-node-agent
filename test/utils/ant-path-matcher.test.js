/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const AntPathMatcher = require('../../lib/utils/ant-path-matcher')

// https://github.com/spring-projects/spring-framework/blob/master/spring-core/src/test/java/org/springframework/util/AntPathMatcherTests.java
test('Unit test for AntPathMatcher', (t) => {
    const pathMatcher = new AntPathMatcher()

    // test exact matching
    t.ok(pathMatcher, 'Ant Path matcher initialization')
    t.true(pathMatcher.match("test", "test"))
    t.true(pathMatcher.match("/test", "/test"))

    // SPR-14141
    

    t.end()
})