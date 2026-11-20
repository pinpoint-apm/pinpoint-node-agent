'use strict'

// The server the outgoing calls reach. It runs without the agent.
require('http').createServer((req, res) => res.end('ok')).listen(Number(process.env.TARGET_PORT), '127.0.0.1')
