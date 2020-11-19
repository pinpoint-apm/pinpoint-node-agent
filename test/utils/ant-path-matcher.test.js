/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const AntPathMatcher = require('../../lib/utils/ant-path-matcher')

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


    t.end()
})


test('new', (t) => {
    const pathMatcher = new AntPathMatcher()

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
    //		assertThat().isTrue();
    //		assertThat().isTrue();
    //		assertThat().isTrue();
    //		assertThat().isTrue();
    //		assertThat().isTrue();
    //		assertThat().isTrue();
    //		assertThat().isTrue();
    //		assertThat().isTrue();
    //		assertThat().isTrue();
    //		assertThat().isFalse();
    //		assertThat(pathMatcher.match("/*bla/test", "XXXblab/test")).isFalse();
    //		assertThat(pathMatcher.match("/*bla/test", "XXXbl/test")).isFalse();
    //
    //		assertThat(pathMatcher.match("/????", "/bala/bla")).isFalse();
    //		assertThat(pathMatcher.match("/**/*bla", "/bla/bla/bla/bbb")).isFalse();
    //
    //		assertThat(pathMatcher.match("/*bla*/**/bla/**", "/XXXblaXXXX/testing/testing/bla/testing/testing/")).isTrue();
    //		assertThat(pathMatcher.match("/*bla*/**/bla/*", "/XXXblaXXXX/testing/testing/bla/testing")).isTrue();
    //		assertThat(pathMatcher.match("/*bla*/**/bla/**", "/XXXblaXXXX/testing/testing/bla/testing/testing")).isTrue();
    //		assertThat(pathMatcher.match("/*bla*/**/bla/**", "/XXXblaXXXX/testing/testing/bla/testing/testing.jpg")).isTrue();
    //
    //		assertThat(pathMatcher.match("*bla*/**/bla/**", "XXXblaXXXX/testing/testing/bla/testing/testing/")).isTrue();
    //		assertThat(pathMatcher.match("*bla*/**/bla/*", "XXXblaXXXX/testing/testing/bla/testing")).isTrue();
    //		assertThat(pathMatcher.match("*bla*/**/bla/**", "XXXblaXXXX/testing/testing/bla/testing/testing")).isTrue();
    //		assertThat(pathMatcher.match("*bla*/**/bla/*", "XXXblaXXXX/testing/testing/bla/testing/testing")).isFalse();
    //
    //		assertThat(pathMatcher.match("/x/x/**/bla", "/x/x/x/")).isFalse();
    //
    //		assertThat(pathMatcher.match("/foo/bar/**", "/foo/bar")).isTrue();
    //
    //		assertThat(pathMatcher.match("", "")).isTrue();
    //
    //		assertThat(pathMatcher.match("/{bla}.*", "/testing.html")).isTrue();
    //		assertThat(pathMatcher.match("/{bla}", "//x\ny")).isTrue();

    t.end()
})