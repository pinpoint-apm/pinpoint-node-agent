const Agent = require('agent')
const agent = new Agent({
  agentId: 'agent-for-dev',
  applicationName: 'test web application'
})

const test = require('tape')
const axios = require('axios')
const http = require('http')

const HttpRequestReader = require('instrumentation/http-request-reader')

test('Should create a context', async function (t) {
  t.plan(3)

  const headers = {
    'Pinpoint-TraceID': 1,
    'Pinpoint-SpanID': 2,
    'Pinpoint-pSpanID': 3,
  }
  const endPoint = 'localhost:5005'
  const rpcName = '/tests/123'

  const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.end('hello')
  })
  .on('request', (req, res) => {
    const reader = new HttpRequestReader(req)
    t.equal(reader.endPoint, endPoint)
    t.equal(reader.rpcName, rpcName)
    t.ok(reader.getTraceId())
  })
  .listen(5005)


  await axios.get(`http://${endPoint}${rpcName}?q=1`, { headers })
  server.close()
})
