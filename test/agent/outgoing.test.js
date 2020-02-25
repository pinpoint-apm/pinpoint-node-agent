const test = require('tape')
const http = require('http')
const echoServer = require('./support/echo-server-instance')
const httpShared = require('../../lib/instrumentation/http-shared')
const Agent = require('../../lib/agent')
const PinpointHeader = require('../../lib/constant/http-header').PinpointHeader

test('http.request(options)', echoTest('http', (port, cb) => {
    const options = { port }
    const req = http.request(options)
    req.on('response', cb)
    return req
}))

function echoTest(protocol, handler) {
    return function(t) {
        t.end()
        return
        echoServer(protocol, (cp, port) => {
            console.log(`cp ${cp}, port ${port}`)

            process.env.PINPOINT_AGENT_ID = 'echoTest'
            process.env.PINPOINT_APPLICATION_NAME = 'echoTest'
            const agent = new Agent()
            httpShared.instrumentRequest(agent, protocol)
            const req = handler(port, res => {
                console.log(res)
                res.on('end', () => {
                })
                res.resume()
            })

            var traceId = req.getHeader(PinpointHeader.HTTP_TRACE_ID)
            // t.ok(traceId, 'should have a trace ID')
            
            if (isRequestHttpMethod(req)) req.end()

            cp.kill()
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