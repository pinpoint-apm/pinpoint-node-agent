/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const AntPathMatcher = require('../../lib/utils/ant-path-matcher')
const axios = require('axios')
const express = require('express')

const agent = require('../support/agent-singleton-mock')
// https://github.com/spring-projects/spring-framework/blob/master/spring-core/src/test/java/org/springframework/util/AntPathMatcherTests.java
test('match', (t) => {
    const pathMatcher = new AntPathMatcher()

    // test exact matching
    t.ok(pathMatcher, 'Ant Path matcher initialization')
    t.true(pathMatcher.match("test", "test"))
    t.true(pathMatcher.match("/test", "/test"))

    // SPR-14141
    t.true(pathMatcher.match("https://example.org", "https://example.org"))
    t.false(pathMatcher.match("/test.jpg", "test.jpg"))
    t.false(pathMatcher.match("test", "/test"))
    t.false(pathMatcher.match("/test", "test"))

    // test matching with ?'s
    t.true(pathMatcher.match("t?st", "test"), "match('t?st', 'test')")
    t.true(pathMatcher.match("??st", "test"), 'match("??st", "test")')
    t.true(pathMatcher.match("tes?", "test"), 'match("tes?", "test")')
    t.true(pathMatcher.match("te??", "test"), 'match("te??", "test")')
    t.true(pathMatcher.match("?es?", "test"), 'match("?es?", "test")')
    t.false(pathMatcher.match("tes?", "tes"), 'match("tes?", "tes")')
    t.false(pathMatcher.match("tes?", "testt"), 'match("tes?", "testt")')
    t.false(pathMatcher.match("tes?", "tsst"), 'match("tes?", "tsst")')

    // test matching with *'s
    t.true(pathMatcher.match("*", "test"), 'pathMatcher.match("*", "test")')
    t.true(pathMatcher.match("test*", "test"), 'pathMatcher.match("test*", "test")')
    t.true(pathMatcher.match("test*", "testTest"), 'pathMatcher.match("test*", "testTest")')
    t.true(pathMatcher.match("test/*", "test/Test"), 'pathMatcher.match("test/*", "test/Test")')
    t.true(pathMatcher.match("test/*", "test/t"), 'pathMatcher.match("test/*", "test/t")')
    t.true(pathMatcher.match("test/*", "test/"), 'pathMatcher.match("test/*", "test/")')
    t.true(pathMatcher.match("*test*", "AnothertestTest"), 'pathMatcher.match("*test*", "AnothertestTest")')
    t.true(pathMatcher.match("*test", "Anothertest"), 'pathMatcher.match("*test", "Anothertest")')
    t.true(pathMatcher.match("*.*", "test."), 'pathMatcher.match("*.*", "test.")')
    t.true(pathMatcher.match("*.*", "test.test"), 'pathMatcher.match("*.*", "test.test")')
    t.true(pathMatcher.match("*.*", "test.test.test"), 'pathMatcher.match("*.*", "test.test.test")')
    t.true(pathMatcher.match("test*aaa", "testblaaaa"), 'pathMatcher.match("test*aaa", "testblaaaa")')
    t.false(pathMatcher.match("test*", "tst"), 'pathMatcher.match("test*", "tst")')
    t.false(pathMatcher.match("test*", "tsttest"), 'pathMatcher.match("test*", "tsttest")')
    t.false(pathMatcher.match("test*", "test/"), 'pathMatcher.match("test*", "test/")')
    t.false(pathMatcher.match("test*", "test/t"), 'pathMatcher.match("test*", "test/t")')
    t.false(pathMatcher.match("test/*", "test"), 'pathMatcher.match("test/*", "test")')
    t.false(pathMatcher.match("*test*", "tsttst"), 'pathMatcher.match("*test*", "tsttst")')
    t.false(pathMatcher.match("*test", "tsttst"), 'pathMatcher.match("*test", "tsttst")')
    t.false(pathMatcher.match("*.*", "tsttst"), 'pathMatcher.match("*.*", "tsttst")')
    t.false(pathMatcher.match("test*aaa", "test"), 'pathMatcher.match("test*aaa", "test")')
    t.false(pathMatcher.match("test*aaa", "testblaaab"), 'pathMatcher.match("test*aaa", "testblaaab")')

    // test matching with ?'s and /'s
    t.true(pathMatcher.match("/?", "/a"), 'pathMatcher.match("/?", "/a")')
    t.true(pathMatcher.match("/?/a", "/a/a"), 'pathMatcher.match("/?/a", "/a/a")')
    t.true(pathMatcher.match("/a/?", "/a/b"), 'pathMatcher.match("/a/?", "/a/b")')
    t.true(pathMatcher.match("/?/a", "/a/a"), 'pathMatcher.match("/?/a", "/a/a")')
    t.true(pathMatcher.match("/a/?", "/a/b"), 'pathMatcher.match("/a/?", "/a/b")')
    t.true(pathMatcher.match("/??/a", "/aa/a"), 'pathMatcher.match("/??/a", "/aa/a")')
    t.true(pathMatcher.match("/a/??", "/a/bb"), 'pathMatcher.match("/a/??", "/a/bb")')
    t.true(pathMatcher.match("/?", "/a"), 'pathMatcher.match("/?", "/a")')

    // test matching with **'s
    t.true(pathMatcher.match("/**", "/testing/testing"), 'pathMatcher.match("/**", "/testing/testing")')
    t.true(pathMatcher.match("/*/**", "/testing/testing"), 'pathMatcher.match("/*/**", "/testing/testing")')
    t.true(pathMatcher.match("/**/*", "/testing/testing"), 'pathMatcher.match("/**/*", "/testing/testing")')
    t.true(pathMatcher.match("/bla/**/bla", "/bla/testing/testing/bla"), 'pathMatcher.match("/bla/**/bla", "/bla/testing/testing/bla")')
    t.true(pathMatcher.match("/bla/**/bla", "/bla/testing/testing/bla/bla"), 'pathMatcher.match("/bla/**/bla", "/bla/testing/testing/bla/bla")')
    t.true(pathMatcher.match("/**/test", "/bla/bla/test"), 'pathMatcher.match("/**/test", "/bla/bla/test")')
    t.true(pathMatcher.match("/bla/**/**/bla", "/bla/bla/bla/bla/bla/bla"), 'pathMatcher.match("/bla/**/**/bla", "/bla/bla/bla/bla/bla/bla")')
    t.true(pathMatcher.match("/bla*bla/test", "/blaXXXbla/test"), 'pathMatcher.match("/bla*bla/test", "/blaXXXbla/test")')
    t.true(pathMatcher.match("/*bla/test", "/XXXbla/test"), 'pathMatcher.match("/*bla/test", "/XXXbla/test")')
    t.false(pathMatcher.match("/bla*bla/test", "/blaXXXbl/test"), 'pathMatcher.match("/bla*bla/test", "/blaXXXbl/test")')
    t.false(pathMatcher.match("/*bla/test", "XXXblab/test"), 'pathMatcher.match("/*bla/test", "XXXblab/test")')
    t.false(pathMatcher.match("/*bla/test", "XXXbl/test"), 'pathMatcher.match("/*bla/test", "XXXbl/test")')

    t.false(pathMatcher.match("/????", "/bala/bla"), 'pathMatcher.match("/????", "/bala/bla")')
    t.false(pathMatcher.match("/**/*bla", "/bla/bla/bla/bbb"), 'pathMatcher.match("/**/*bla", "/bla/bla/bla/bbb")')

    t.true(pathMatcher.match("/*bla*/**/bla/**", "/XXXblaXXXX/testing/testing/bla/testing/testing/"), 'pathMatcher.match("/*bla*/**/bla/**", "/XXXblaXXXX/testing/testing/bla/testing/testing/")')
    t.true(pathMatcher.match("/*bla*/**/bla/*", "/XXXblaXXXX/testing/testing/bla/testing"), 'pathMatcher.match("/*bla*/**/bla/*", "/XXXblaXXXX/testing/testing/bla/testing")')
    t.true(pathMatcher.match("/*bla*/**/bla/**", "/XXXblaXXXX/testing/testing/bla/testing/testing"), 'pathMatcher.match("/*bla*/**/bla/**", "/XXXblaXXXX/testing/testing/bla/testing/testing")')
    t.true(pathMatcher.match("/*bla*/**/bla/**", "/XXXblaXXXX/testing/testing/bla/testing/testing.jpg"), 'pathMatcher.match("/*bla*/**/bla/**", "/XXXblaXXXX/testing/testing/bla/testing/testing.jpg")')

    t.true(pathMatcher.match("*bla*/**/bla/**", "XXXblaXXXX/testing/testing/bla/testing/testing/"), 'pathMatcher.match("*bla*/**/bla/**", "XXXblaXXXX/testing/testing/bla/testing/testing/")')
    t.true(pathMatcher.match("*bla*/**/bla/*", "XXXblaXXXX/testing/testing/bla/testing"), 'pathMatcher.match("*bla*/**/bla/*", "XXXblaXXXX/testing/testing/bla/testing")')
    t.true(pathMatcher.match("*bla*/**/bla/**", "XXXblaXXXX/testing/testing/bla/testing/testing"), 'pathMatcher.match("*bla*/**/bla/**", "XXXblaXXXX/testing/testing/bla/testing/testing")')
    t.false(pathMatcher.match("*bla*/**/bla/*", "XXXblaXXXX/testing/testing/bla/testing/testing"), 'pathMatcher.match("*bla*/**/bla/*", "XXXblaXXXX/testing/testing/bla/testing/testing")')

    t.false(pathMatcher.match("/x/x/**/bla", "/x/x/x/"), 'pathMatcher.match("/x/x/**/bla", "/x/x/x/")')

    t.true(pathMatcher.match("/foo/bar/**", "/foo/bar"), 'pathMatcher.match("/foo/bar/**", "/foo/bar")')

    t.true(pathMatcher.match("", ""), 'pathMatcher.match("", "")')

    t.true(pathMatcher.match("/{bla}.*", "/testing.html"), 'pathMatcher.match("/{bla}.*", "/testing.html")')

    t.end()
})


test('matchWithNullPath', (t) => {
    const pathMatcher = new AntPathMatcher()

    t.false(pathMatcher.match("/test", null), 'pathMatcher.match("/test", null)')
    t.false(pathMatcher.match("/test"), 'pathMatcher.match("/test")')
    t.false(pathMatcher.match("/", null), 'pathMatcher.match("/", null)')
    t.false(pathMatcher.match(null, null), 'pathMatcher.match(null, null)')
    t.false(pathMatcher.match(), 'pathMatcher.match()')

    t.end()
})

test('config object excludeURLs', (t) => {
    let config = require('../pinpoint-config-test')
    Object.assign(config, {
        'exclude-urls': ["/test.jpg"]
    })
    agent.bindHttp(config)
    t.deepEqual(agent.config.excludeURLs, ["/test.jpg"])
    delete config['exclude-urls']

    config = require('../pinpoint-config-test')
    Object.assign(config, {
        'exclude-urls': ["/??/a", "/*bla/test"]
    })
    agent.bindHttp(config)
    t.deepEqual(agent.config.excludeURLs, ["/??/a", "/*bla/test"])
    delete config['exclude-urls']

    t.end()
})

test('config env excludeURLs', (t) => {
    process.env['PINPOINT_EXCLUDE_URLS'] = "/test"
    agent.bindHttp()
    t.deepEqual(agent.config.excludeURLs, ["/test"])

    process.env['PINPOINT_EXCLUDE_URLS'] = "/test, test"
    agent.bindHttp()
    t.deepEqual(agent.config.excludeURLs, ["/test", "test"])

    process.env['PINPOINT_EXCLUDE_URLS'] = "/test, test,tes?"
    agent.bindHttp()
    t.deepEqual(agent.config.excludeURLs, ["/test", "test", "tes?"])

    t.end()
    delete process.env.PINPOINT_EXCLUDE_URLS
})

const TEST_ENV = {
    host: 'localhost',
    port: 5006,
}
const getServerUrl = (path) => `http://${TEST_ENV.host}:${TEST_ENV.port}${path}`