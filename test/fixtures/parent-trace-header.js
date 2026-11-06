/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

// A valid parent trace header set with the one header a test checks.
class ParentTraceHeader {
    static header(name, value) {
        return {
            'pinpoint-traceid': 'parent.agent^1599831487121^4',
            'pinpoint-spanid': '-387300102333636357',
            'pinpoint-pspanid': '3116250228920588432',
            'pinpoint-flags': '0',
            'pinpoint-pappname': 'parent.application',
            'pinpoint-papptype': '1210',
            [name]: value,
        }
    }
}

module.exports = {
    ParentTraceHeader,
}
