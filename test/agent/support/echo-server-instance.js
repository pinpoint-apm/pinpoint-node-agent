'use strict'

const exec = require('child_process').exec
const path = require('path')

module.exports = echoServer

function echoServer(protocol, callback) {
    if (typeof protocol == 'function')
        return echoServer('http', protocol)

    const echoServerScript = path.join(__dirname, 'echo-server.js')
    const callbackProcess = exec(`node "${echoServerScript}" ${protocol}`)
    callbackProcess.stderr.pipe(process.stderr)
    callbackProcess.stdout.once('data', (chunk) => {
        const port = chunk.trim().split('\n')[0]
        callback(callbackProcess, port)
    })
}