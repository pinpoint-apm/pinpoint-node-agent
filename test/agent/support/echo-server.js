'use strict'

const http = require('http')

process.title = 'echo-server'

const server = http.createServer()
server.on("request", (req, res) => {
    req.pipe(res)
})

server.listen(() => {
    console.log(server.address().port)
})

setTimeout(() => {
    server.close()
}, 6 * 1000)