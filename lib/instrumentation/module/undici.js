/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const semver = require('semver')
const diagnostics_channel = require('node:diagnostics_channel')
const log = require('../../utils/logger')

// https://nodejs.org/ko/learn/getting-started/fetch
// fetch API is called by undici import or nodejs global fetch
// so we need to instrument require-in-the-middle and call manually to instrument fetch API
class UndiciInstrumentation {
    constructor() {
        this.channels = []
        this.isInstrumented = false
    }

    cancelInstrumentUndici() {
        if (!this.isInstrumented) {
            return
        }
        this.isInstrumented = false

        this.channels.forEach(({ name, onMessage }) => {
            diagnostics_channel.unsubscribe(name, onMessage)
        })
    }

    instrument(agent) {
        if (this.isInstrumented) {
            return
        }
        this.isInstrumented = true
    }
}

const undiciInstrumentation = new UndiciInstrumentation()

module.exports = function(agent, version, undici) {
    if (semver.lt(version, '4.7.1')) {
        if (log.isDebug()) {
            log.debug('undici version %s not supported - aborting...', version)
        }
        return undici
    }

    undiciInstrumentation.instrument(agent)
}
module.exports.undiciHook = undiciInstrumentation