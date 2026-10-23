/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const https = require('https')
const selfsigned = require('selfsigned')

// Stands in for an external HTTPS site, so outgoing-call tests run without network access.
// It answers every request with 200 'ok', after `responseDelayMs` when given.
async function startLocalHttpsServer({ responseDelayMs = 0 } = {}) {
    const { private: key, cert } = await selfsigned.generate([{ name: 'commonName', value: 'localhost' }], {
        extensions: [{ name: 'subjectAltName', altNames: [{ type: 2, value: 'localhost' }] }],
    })
    const server = https.createServer({ key, cert }, (req, res) => {
        setTimeout(() => res.end('ok'), responseDelayMs)
    })
    // The agent wraps https.Server.prototype.emit; an external site would not create a trace for its own request.
    server.emit = https.Server.prototype.emit.__original ?? https.Server.prototype.emit
    await new Promise(resolve => server.listen(0, 'localhost', resolve))

    const host = `localhost:${server.address().port}`
    return {
        host,
        url: `https://${host}/`,
        agent: () => new https.Agent({ keepAlive: false, ca: cert }),
        close: () => new Promise(resolve => server.close(resolve)),
    }
}

module.exports = {
    startLocalHttpsServer,
}
