/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { execFile } = require('node:child_process')

// Requests from a separate Node.js process without the agent, so the test process's instrumented fetch cannot add its own Pinpoint headers.
class User {
    fetch(url, options = {}) {
        const env = { ...process.env }
        delete env.NODE_OPTIONS
        return new Promise((resolve, reject) => {
            execFile(process.execPath, ['-e', fetchScript, JSON.stringify([url, options])], { env }, (error, stdout, stderr) => {
                if (error) {
                    reject(new Error(stderr || error.message))
                    return
                }
                resolve(JSON.parse(stdout))
            })
        })
    }
}

const fetchScript = `
const [url, options] = JSON.parse(process.argv[1])
fetch(url, options).then(async (response) => {
    process.stdout.write(JSON.stringify({ status: response.status, body: await response.text() }))
}).catch((error) => {
    process.stderr.write(error.stack)
    process.exitCode = 1
})
`

module.exports = {
    User,
}
