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
                console.log(res)
                res.on('end', () => {
                    
                })
                res.resume()
            })

            if (isRequestHttpMethod(req)) req.end()
            t.end()
        })
    }

    // Detect if the test called `http.get` (in which case outputSize should
    // be greater than zero) or `http.request` (in which case it should equal
    // zero)
    function isRequestHttpMethod(req) {
        return req.outputSize === 0
    }
}