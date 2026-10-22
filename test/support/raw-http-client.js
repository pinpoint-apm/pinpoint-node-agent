/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const net = require('node:net')

// Sends a GET request over a raw socket so a test can close the connection before or after the response.
// It also bypasses the agent's http and undici instrumentation, so the given headers reach the server as they are.
function sendRequestOverRawSocket(port, path, headers = {}) {
    const headerLines = Object.entries(headers).map(([name, value]) => `${name}: ${value}\r\n`).join('')
    const socket = net.connect(port, '127.0.0.1', () => {
        socket.write(`GET ${path} HTTP/1.1\r\nHost: 127.0.0.1:${port}\r\n${headerLines}Connection: close\r\n\r\n`)
    })
    socket.on('error', () => {})
    return socket
}

module.exports = {
    sendRequestOverRawSocket,
}
