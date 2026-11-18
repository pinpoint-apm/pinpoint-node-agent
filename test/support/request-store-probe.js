/**
 * Pinpoint Node.js Agent
 * Copyright 2026-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { createHook } = require('node:async_hooks')
const localStorage = require('../../lib/instrumentation/context/local-storage')

// In a test process only the agent's gRPC clients and the test gRPC servers create HTTP/2 resources,
// and a test gRPC server is bound outside any request store, so a captured one belongs to the agent
const http2ResourceTypes = new Set(['HTTP2SESSION', 'HTTP2STREAM'])

// Records the HTTP/2 resources created while a store of the storage is active; such a resource keeps the store while it lives
function startRequestStoreProbe(storage = localStorage, onCapture = () => {}) {
    const capturedTypes = []
    const hook = createHook({
        init(asyncId, type) {
            if (http2ResourceTypes.has(type) && storage.getStore()) {
                capturedTypes.push(type)
                onCapture(type)
            }
        }
    }).enable()

    return {
        capturedTypes: () => capturedTypes,
        stop: () => hook.disable(),
    }
}

module.exports = {
    startRequestStoreProbe,
}
