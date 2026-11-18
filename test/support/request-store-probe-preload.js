/**
 * Pinpoint Node.js Agent
 * Copyright 2026-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

// Preloaded after index.js into a server process the test spawns, which reads the lines from its stdout
const fs = require('node:fs')
const localStorage = require('../../lib/instrumentation/context/local-storage')
const { startRequestStoreProbe } = require('./request-store-probe')

// An async_hooks callback must not start asynchronous work, so the line is written synchronously,
// and a full stdout pipe must not throw inside the hook and stop the server
startRequestStoreProbe(localStorage, type => {
    try {
        fs.writeSync(1, `request-store-probe: ${type}\n`)
    } catch {
        // The line is lost; the server keeps running
    }
})
