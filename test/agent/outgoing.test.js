const test = require('tape')
const http = require('http')
const echoServer = require('./support/echo-server-instance')

test('http.request(options)', echoTest('http', (port, cb) => {
    const options = { port }
    const req = http.request(options)
    req.on('response', cb)
    return req
}))

function echoTest(protocol, handler) {
    return function(t) {
        echoServer(protocol, (cp, port) => {
            console.log(`cp ${cp}, port ${port}`)
            // t.end()
            // cp.kill()

            const req = handler(port, res => {
                res.on('end', () => {
                    
                })
                res.resume()
            })
        })
    }
}