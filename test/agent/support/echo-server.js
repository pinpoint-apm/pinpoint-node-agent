'use strict'

const http = require('http')

const server = http.createServer()
server.on("request", (req, res) => {
    req.pipe(res)
})

server.listen(() => {

})

setTimeout(() => {
    server.close()
}, 60 * 1000)