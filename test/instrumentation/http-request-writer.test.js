const test = require('tape')
const axios = require('axios')
const http = require('http')

const fixture = require('../fixture')
fixture.config.enabledDataSending = true

const Agent= require('agent')
const agent = new Agent(fixture.config)
const HttpRequestWriter = require('instrumentation/http-request-writer')
const PinpointHeader = require('constant/http-header').PinpointHeader

const endPoint = 'localhost:5005'
const rpcName = '/tests/123'

test('Should write pinpoint header', async function (t) {
  t.plan(1)

  const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.end('hello')
  })
  .on('request', (req, res) => {
    const trace = agent.createTraceObject()

    const writtenReq = new HttpRequestWriter(agent).write(req)

    t.equal(writtenReq.headers[PinpointHeader.HTTP_TRACE_ID], trace.traceId.transactionId.toString())
  })
  .listen(5005)

  await axios.get(`http://${endPoint}${rpcName}?q=1`)
  server.close()
})
