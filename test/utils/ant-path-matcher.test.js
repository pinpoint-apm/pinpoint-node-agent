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
let pathMatcher = new AntPathMatcher()

// https://github.com/spring-projects/spring-framework/blob/master/spring-core/src/test/java/org/springframework/util/AntPathMatcherTests.java
test('match', (t) => {
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

test('config object exclusion URL', (t) => {
    let config = require('../pinpoint-config-test')
    Object.assign(config, {
        'trace-exclusion-url': {
            pattern: ["/test.jpg"]
        }
    })
    agent.bindHttp(config)
    t.deepEqual(agent.config.traceExclusionUrlPatterns, ["/test.jpg"])
    delete config['trace-exclusion-url']

    config = require('../pinpoint-config-test')
    Object.assign(config, {
        'trace-exclusion-url': {
            pattern: ["/??/a", "/*bla/test"]
        }
    })
    agent.bindHttp(config)
    t.deepEqual(agent.config.traceExclusionUrlPatterns, ["/??/a", "/*bla/test"])
    delete config['trace-exclusion-url']

    t.end()
})

// for acronyms camel case:  https://docs.microsoft.com/en-us/previous-versions/dotnet/netframework-1.1/141e06ef(v=vs.71)?redirectedfrom=MSDN
test('config object exclusion URL with cache size', (t) => {
    let config = require('../pinpoint-config-test')
    Object.assign(config, {
        'trace-exclusion-url': {
            pattern: ["/test.jpg"]
        }
    })
    agent.bindHttp(config)
    t.deepEqual(agent.config.traceExclusionUrlPatterns, ["/test.jpg"])
    delete config['trace-exclusion-url']

    t.end()
})

test('config env exclusion URL', (t) => {
    process.env['PINPOINT_TRACE_EXCLUSION_URL_PATTERN'] = "/test"
    agent.bindHttp()
    t.deepEqual(agent.config.traceExclusionUrlPatterns, ["/test"])

    process.env['PINPOINT_TRACE_EXCLUSION_URL_PATTERN'] = "/test, test"
    agent.bindHttp()
    t.deepEqual(agent.config.traceExclusionUrlPatterns, ["/test", "test"])

    process.env['PINPOINT_TRACE_EXCLUSION_URL_PATTERN'] = "/test, test,tes?"
    agent.bindHttp()
    t.deepEqual(agent.config.traceExclusionUrlPatterns, ["/test", "test", "tes?"])

    t.end()
    delete process.env.PINPOINT_TRACE_EXCLUSION_URL_PATTERN
})

test('outgoing request when canSample true', async (t) => {
    process.env['PINPOINT_TRACE_EXCLUSION_URL_PATTERN'] = "/heath_check"
    await outgoingRequest(t, "/heath_check", false)
    delete process.env.PINPOINT_TRACE_EXCLUSION_URL_PATTERN

    t.end()
})

const TEST_ENV = {
    host: 'localhost',
    port: 5006,
}
const getServerUrl = (path) => `http://${TEST_ENV.host}:${TEST_ENV.port}${path}`

async function outgoingRequest(t, path, expectedSampling, expectUnits) {
    return new Promise((resolve, reject) => {
        agent.bindHttp()
    
        const PATH = path
        const app = new express()
    
        pathMatcher = new AntPathMatcher(agent.config)
        const sampling = !pathMatcher.matchPath(PATH)
    
        if (typeof expectedSampling !== 'undefined') {
            t.equal(sampling, expectedSampling, `expectedMatch ${expectedSampling}`)
        }
    
        let actualTrace
        app.get(PATH, async (req, res) => {
            const https = require('https')
            const options = {
                hostname: 'naver.com',
                port: 443,
                path: '/',
                method: 'GET'
            }
    
            actualTrace = agent.currentTraceObject()
    
            const result1 = await axios.get(getServerUrl(OUTGOING_PATH))
            t.equal(result1.data, 'ok get', `sampling is ${sampling}, outgoing req ok`)
            res.send('ok get')
        })
    
        const OUTGOING_PATH = '/outgoingrequest'
        app.get(OUTGOING_PATH, async (req, res) => {
            const headers = req.headers
            if (sampling) {
                t.equal(actualTrace.traceId.transactionId.toString(), headers['pinpoint-traceid'])
                t.equal(actualTrace.traceId.spanId, headers['pinpoint-pspanid'])
                t.equal(agent.config.applicationName, headers['pinpoint-pappname'])
                t.equal(agent.config.serviceType, Number(headers['pinpoint-papptype']))
                t.equal(actualTrace.traceId.flag.toString(), headers['pinpoint-flags'])
            } else {
                // ClientCallStartInterceptor.java requestTraceWriter.write(metadata);
                // TODO: Think about for outgoing request pinpoint-sampled
                t.equal(undefined, headers['pinpoint-sampled'], 'When no sampling, pinpoint-sampled is s0')
            }
            res.send('ok get')
        })
    
        const server = app.listen(TEST_ENV.port, async () => {
            const result1 = await axios.get(getServerUrl(PATH))
            t.equal(result1.status, 200, `sampling is ${sampling}, response status 200 ok`)
    
            if (expectUnits) {
                expectUnits(t)
            }
    
            server.close()
            resolve(t)
        })
    })
}

test('when pattern match is false, sampling is false', async (t) => {
    process.env['PINPOINT_TRACE_EXCLUSION_URL_PATTERN'] = "/heath_check?/**"
    await outgoingRequest(t, "/heath_check", true)
    delete process.env.PINPOINT_TRACE_EXCLUSION_URL_PATTERN

    t.end()
})

test('request when multi patterns true', async (t) => {
    process.env['PINPOINT_TRACE_EXCLUSION_URL_PATTERN'] = "/heath_check?/**,/tes?"
    await outgoingRequest(t, "/test", false)
    delete process.env.PINPOINT_TRACE_EXCLUSION_URL_PATTERN

    t.end()
})

test('map insertion order learning test', (t) => {
    const map1 = new Map()

    map1.set('0', 'foo')
    map1.set(1, 'bar')

    let iterator1 = map1[Symbol.iterator]()

    let index = 0
    for (const item of iterator1) {
        if (index == 0) {
            t.equal(item[0], '0', 'key match')
            t.equal(item[1], 'foo', 'value match')
        }
        if (index == 1) {
            t.equal(item[0], 1, 'key match')
            t.equal(item[1], 'bar', 'value match')
        }
        index++
    }

    map1.set('0', 'foo')
    map1.set(1, 'bar')
    map1.delete('0')
    map1.set('0', 'foo2')
    iterator1 = map1[Symbol.iterator]()
    index = 0
    for (const item of iterator1) {
        if (index == 0) {
            t.equal(item[0], 1, 'key match')
            t.equal(item[1], 'bar', 'value match')
        }
        if (index == 1) {
            t.equal(item[0], '0', 'key match')
            t.equal(item[1], 'foo2', 'value match')
        }
        index++
    }

    // get order
    const cache = Array.from(map1)
    t.deepEqual(cache[0], [1, 'bar'], 'key match')
    t.deepEqual(cache[1], ['0', 'foo2'], 'key match')

    // remove low hit count
    map1.delete(1)
    t.equal(map1.size, 1)

    iterator1 = map1[Symbol.iterator]();
    index = 0
    for (const item of iterator1) {
        if (index == 0) {
            t.equal(item[0], '0', 'key match')
            t.equal(item[1], 'foo2', 'value match')
        }
        index++
    }

    t.end()
})

test('when pattern match with cache size, sampling test with cache hit', async (t) => {
    process.env['PINPOINT_TRACE_EXCLUSION_URL_PATTERN'] = "/heath_check?/**,/tes?"
    await outgoingRequest(t, "/test", false, (t) => {
        t.true(typeof agent.config.traceExclusionUrlCacheSize === 'undefined', 'traceExclusionUrlCacheSize ENV undefined case')
    })
    delete process.env.PINPOINT_TRACE_EXCLUSION_URL_PATTERN

    process.env['PINPOINT_TRACE_EXCLUSION_URL_PATTERN'] = "/heath_check?/**,/tes?"
    process.env['PINPOINT_TRACE_EXCLUSION_URL_CACHE_SIZE'] = "0"
    await outgoingRequest(t, "/test", false, (t) => {
        t.true(typeof agent.config.traceExclusionUrlCacheSize !== 'undefined', 'traceExclusionUrlCacheSize ENV case')
        t.equal(agent.config.traceExclusionUrlCacheSize, 100, 'traceExclusionUrlCacheSize default 100')
    })
    delete process.env.PINPOINT_TRACE_EXCLUSION_URL_PATTERN
    delete process.env.PINPOINT_TRACE_EXCLUSION_URL_CACHE_SIZE

    process.env['PINPOINT_TRACE_EXCLUSION_URL_CACHE_SIZE'] = "0"
    await outgoingRequest(t, "/test", true, (t) => {
        t.true(typeof agent.config.traceExclusionUrlPatterns === 'undefined', 'when only set traceExclusionUrlCacheSize ENV, agent.config.traceExclusionUrlPatterns undefined case')
        t.true(typeof agent.config.traceExclusionUrlCacheSize === 'undefined', 'when only set traceExclusionUrlCacheSize ENV, agent.config.traceExclusionUrlCacheSize undefined case')
    })
    delete process.env.PINPOINT_TRACE_EXCLUSION_URL_CACHE_SIZE

    t.end()
})
