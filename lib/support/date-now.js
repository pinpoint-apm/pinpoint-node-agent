/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class DateNow {
    static offset = 0

    static now() {
        return Date.now() + DateNow.offset
    }

    static setOffset(ms) {
        DateNow.offset = ms
    }

    static reset() {
        DateNow.offset = 0
    }
}

module.exports = DateNow