/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const AntPathMatcher = require('../../lib/utils/ant-path-matcher')
const { ConfigBuilder } = require('../../lib/config-builder')
let pathMatcher = new AntPathMatcher()

// https://github.com/spring-projects/spring-framework/blob/master/spring-core/src/test/java/org/springframework/util/AntPathMatcherTests.java
test('match', (t) => {
    // test exact matching
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
    t.true(pathMatcher.match("/??/a", "/aa/a"), 'pathMatcher.match("/??/a", "/aa/a")')
    t.true(pathMatcher.match("/a/??", "/a/bb"), 'pathMatcher.match("/a/??", "/a/bb")')

    // test matching with **'s
    t.true(pathMatcher.match("/**", "/testing/testing"), 'pathMatcher.match("/**", "/testing/testing")')
    t.true(pathMatcher.match("/test/**", "/test/"), 'pathMatcher.match("/test/**", "/test/")')
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
    t.false(pathMatcher.match("/test", null), 'pathMatcher.match("/test", null)')
    t.false(pathMatcher.match("/test"), 'pathMatcher.match("/test")')
    t.false(pathMatcher.match("/", null), 'pathMatcher.match("/", null)')
    t.false(pathMatcher.match(null, null), 'pathMatcher.match(null, null)')
    t.false(pathMatcher.match(), 'pathMatcher.match()')

    t.end()
})

test('path matcher cache', (t) => {
    let config = new ConfigBuilder({
        features: {
            traceExclusionUrl: {
                patterns: ["/test", "/test/**"],
                cacheSize: 3
            }
        }
    }).build()
    let cachedPathMatcher = new AntPathMatcher(config)
    cachedPathMatcher.matchPath("/test")
    cachedPathMatcher.matchPath()
    cachedPathMatcher.matchPath(null)

    let iterator = cachedPathMatcher.pathMatchedCache[Symbol.iterator]()
    let index = 0
    for (const item of iterator) {
        if (index == 0) {
            t.equal(item[0], '/test', 'path key matcher')
            t.equal(item[1], true, 'path value matcher')
        }
        index++
    }

    config = new ConfigBuilder({
        features: {
            traceExclusionUrl: {
                patterns: ["/test", "/test/**"],
                cacheSize: 3
            }
        }
    }).build()
    cachedPathMatcher = new AntPathMatcher(config)
    cachedPathMatcher.matchPath("/teste/")
    cachedPathMatcher.matchPath("/test/1")
    cachedPathMatcher.matchPath("/test/12")

    iterator = cachedPathMatcher.pathMatchedCache[Symbol.iterator]()
    index = 0
    for (const item of iterator) {
        if (index == 0) {
            t.equal(item[0], '/teste/', `${item[0]} path key matcher`)
            t.equal(item[1], false, `${item[1]} path value matcher`)
        }
        if (index == 1) {
            t.equal(item[0], '/test/1', `${item[0]} path key matcher`)
            t.equal(item[1], true, `${item[1]} path value matcher`)
        }
        if (index == 2) {
            t.equal(item[0], '/test/12', `${item[0]} path key matcher`)
            t.equal(item[1], true, `${item[1]} path value matcher`)
        }
        index++
    }

    config = new ConfigBuilder({
        features: {
            traceExclusionUrl: {
                patterns: ["/test", "/test/**"],
                cacheSize: 3
            }
        }
    }).build()
    cachedPathMatcher = new AntPathMatcher(config)
    cachedPathMatcher.matchPath("/teste/")
    cachedPathMatcher.matchPath("/test/1")
    cachedPathMatcher.matchPath("/test/12")
    cachedPathMatcher.matchPath("/teste/")

    iterator = cachedPathMatcher.pathMatchedCache[Symbol.iterator]()
    index = 0
    for (const item of iterator) {
        if (index == 0) {
            t.equal(item[0], '/test/1', `${item[0]} path key matcher`)
            t.equal(item[1], true, `${item[1]} path value matcher`)
        }
        if (index == 1) {
            t.equal(item[0], '/test/12', `${item[0]} path key matcher`)
            t.equal(item[1], true, `${item[1]} path value matcher`)
        }
        if (index == 2) {
            t.equal(item[0], '/teste/', `${item[0]} path key matcher`)
            t.equal(item[1], false, `${item[1]} path value matcher`)
        }
        index++
    }

    config = new ConfigBuilder({
        features: {
            traceExclusionUrl: {
                patterns: ["/test", "/test/**"],
                cacheSize: 3
            }
        }
    }).build()
    cachedPathMatcher = new AntPathMatcher(config)
    cachedPathMatcher.matchPath("/teste/")
    cachedPathMatcher.matchPath("/test/1")
    cachedPathMatcher.matchPath("/test/12")
    cachedPathMatcher.matchPath("/teste/")
    cachedPathMatcher.matchPath("/testa/")

    let caches = Array.from(cachedPathMatcher.pathMatchedCache)
    t.equal(caches.length, 4, `cache size: ${caches.length}`)
    t.equal(caches[0][0], '/test/1', `${caches[0][0]} path key matcher`)
    t.equal(caches[0][1], true, `caches[0][0] ${caches[0][1]} path value matcher`)
    t.equal(caches[1][0], '/test/12', `${caches[1][0]} path key matcher`)
    t.equal(caches[1][1], true, `caches[1][0] ${caches[1][1]} path value matcher`)
    t.equal(caches[2][0], '/teste/', `${caches[2][0]} path key matcher`)
    t.equal(caches[2][1], false, `caches[2][0] ${caches[2][1]} path value matcher`)
    t.equal(caches[3][0], '/testa/', `${caches[3][0]} path key matcher`)
    t.equal(caches[3][1], false, `caches[3][0] ${caches[3][1]} path value matcher`)

    config = new ConfigBuilder({
        features: {
            traceExclusionUrl: {
                patterns: ["/test", "/test/**"],
                cacheSize: 3
            }
        }
    }).build()
    cachedPathMatcher = new AntPathMatcher(config)
    cachedPathMatcher.matchPath("/teste/")
    cachedPathMatcher.matchPath("/test/1")
    cachedPathMatcher.matchPath("/test/12")
    cachedPathMatcher.matchPath("/teste/")
    cachedPathMatcher.matchPath("/testa/")
    cachedPathMatcher.matchPath("/test/12")

    caches = Array.from(cachedPathMatcher.pathMatchedCache)
    t.equal(caches.length, 4, `cache size: ${caches.length}`)
    t.equal(caches[0][0], '/test/1', `${caches[0][0]} path key matcher`)
    t.equal(caches[0][1], true, `caches[0][0] ${caches[0][1]} path value matcher`)
    t.equal(caches[1][0], '/teste/', `${caches[1][0]} path key matcher`)
    t.equal(caches[1][1], false, `caches[1][0] ${caches[1][1]} path value matcher`)
    t.equal(caches[2][0], '/testa/', `${caches[2][0]} path key matcher`)
    t.equal(caches[2][1], false, `caches[2][0] ${caches[2][1]} path value matcher`)
    t.equal(caches[3][0], '/test/12', `${caches[3][0]} path key matcher`)
    t.equal(caches[3][1], true, `caches[3][0] ${caches[3][1]} path value matcher`)

    config = new ConfigBuilder({
        features: {
            traceExclusionUrl: {
                patterns: ["/test", "/test/**"],
                cacheSize: 0
            }
        }
    }).build()
    cachedPathMatcher = new AntPathMatcher(config)
    cachedPathMatcher.matchPath("/teste/")
    cachedPathMatcher.matchPath("/test/1")
    cachedPathMatcher.matchPath("/test/12")
    cachedPathMatcher.matchPath("/teste/")
    cachedPathMatcher.matchPath("/testa/")
    cachedPathMatcher.matchPath("/test/12")

    t.true(cachedPathMatcher.pathMatchedCache.size === 4, 'cacheSize: 0 is normalized to 100, so caching stays enabled')
    t.end()
})