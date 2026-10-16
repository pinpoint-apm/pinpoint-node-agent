/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const net = require('node:net')

// Sends a GET request over a raw socket so a test can close the connection before or after the response.
function sendRequestOverRawSocket(port, path) {
    const socket = net.connect(port, '127.0.0.1', () => {
        socket.write(`GET ${path} HTTP/1.1\r\nHost: 127.0.0.1:${port}\r\nConnection: close\r\n\r\n`)
    })
    socket.on('error', () => {})
    return socket
}

module.exports = {
    sendRequestOverRawSocket,
}
