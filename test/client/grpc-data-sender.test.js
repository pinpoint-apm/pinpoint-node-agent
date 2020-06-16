const test = require('tape')
const axios = require('axios')

const {
  log,
  fixture,
  util,
  enableDataSending
} = require('../test-helper')
enableDataSending()

const Trace = require('../../lib/context/trace')
const AgentInfo = require('../../lib/data/dto/agent-info')
const ApiMetaInfo = require('../../lib/data/dto/api-meta-info')
const StringMetaInfo = require('../../lib/data/dto/string-meta-info')
const MethodDescriptor = require('../../lib/context/method-descriptor')
const MethodType = require('../../lib/constant/method-type').MethodType
const dataSenderFactory = require('../../lib/client/data-sender-factory')
const GrpcDataSender = require('../../lib/client/grpc-data-sender')

const GRPC_ENABLE = true
fixture.config['grpcEnable'] = GRPC_ENABLE
const agentInfo = AgentInfo.create(fixture.config, Date.now())
const dataSender = dataSenderFactory.create(fixture.config, agentInfo)
const dataSenderMock = require('../support/data-sender-mock')

test('Should send agent info', function (t) {
  t.plan(1)

  dataSender.send(agentInfo)

  t.ok(true)
})

test('Should send api meta info', function (t) {
  t.plan(1)

  const methodDescriptor = new MethodDescriptor('http', 'Server', 'request', MethodType.WEB_REQUEST, 'Node Server Process')
  const apiMetaInfo = ApiMetaInfo.create(methodDescriptor)
  dataSender.send(apiMetaInfo)

  t.ok(true)
})

test('Should send string meta info', function (t) {
  t.plan(1)

  const stringMetaInfo = StringMetaInfo.create('1', 'test string')
  dataSender.send(stringMetaInfo)

  t.ok(true)
})

test('Should send span ', function (t) {
  t.plan(1)

  const traceId = fixture.getTraceId()
  const agentInfo = fixture.getAgentInfo()
  const trace = new Trace(traceId, agentInfo, dataSender)
  const spanEventRecorder = trace.traceBlockBegin()

  trace.traceBlockEnd(spanEventRecorder)
  const span = trace.span

  dataSender.send(span)

  t.ok(true)
})

const expectedSpanChunk = {
  "agentId": "express-node-sample-id",
  "applicationName": "express-node-sample-name",
  "agentStartTime": 1592271260001,
  "serviceType": 1400,
  "spanId": 8912358811565729,
  "parentSpanId": -1,
  "transactionId": {
    "type": "Buffer",
    "data": [0, 44, 101, 120, 112, 114, 101, 115, 115, 45, 110, 111, 100, 101, 45, 115, 97, 109, 112, 108, 101, 45, 105, 100, 225, 146, 141, 214, 171, 46, 0]
  },
  "spanEventList": [{
    "spanId": 8912358811565729,
    "sequence": 4,
    "startTime": 1592271264503,
    "elapsedTime": 1,
    "startElapsed": 12,
    "serviceType": 6600,
    "endPoint": "localhost:3000",
    "annotations": [{
      "key": 12,
      "value": {
        "stringValue": "express.middleware.serveStatic"
      }
    }],
    "depth": 5,
    "nextSpanId": -1,
    "destinationId": "localhost:3000",
    "apiId": 0,
    "exceptionInfo": null,
    "asyncId": null,
    "nextAsyncId": null,
    "asyncSequence": null,
    "dummyId": null,
    "nextDummyId": null
  }, {
    "spanId": 8912358811565729,
    "sequence": 3,
    "startTime": 1592271264500,
    "elapsedTime": 5,
    "startElapsed": 9,
    "serviceType": 6600,
    "endPoint": "localhost:3000",
    "annotations": [{
      "key": 12,
      "value": {
        "stringValue": "express.middleware.cookieParser"
      }
    }],
    "depth": 4,
    "nextSpanId": -1,
    "destinationId": "localhost:3000",
    "apiId": 0,
    "exceptionInfo": null,
    "asyncId": null,
    "nextAsyncId": null,
    "asyncSequence": null,
    "dummyId": null,
    "nextDummyId": null
  }, {
    "spanId": 8912358811565729,
    "sequence": 2,
    "startTime": 1592271264499,
    "elapsedTime": 7,
    "startElapsed": 8,
    "serviceType": 6600,
    "endPoint": "localhost:3000",
    "annotations": [{
      "key": 12,
      "value": {
        "stringValue": "express.middleware.urlencodedParser"
      }
    }],
    "depth": 3,
    "nextSpanId": -1,
    "destinationId": "localhost:3000",
    "apiId": 0,
    "exceptionInfo": null,
    "asyncId": null,
    "nextAsyncId": null,
    "asyncSequence": null,
    "dummyId": null,
    "nextDummyId": null
  }, {
    "spanId": 8912358811565729,
    "sequence": 1,
    "startTime": 1592271264497,
    "elapsedTime": 10,
    "startElapsed": 6,
    "serviceType": 6600,
    "endPoint": "localhost:3000",
    "annotations": [{
      "key": 12,
      "value": {
        "stringValue": "express.middleware.jsonParser"
      }
    }],
    "depth": 2,
    "nextSpanId": -1,
    "destinationId": "localhost:3000",
    "apiId": 0,
    "exceptionInfo": null,
    "asyncId": null,
    "nextAsyncId": null,
    "asyncSequence": null,
    "dummyId": null,
    "nextDummyId": null
  }, {
    "spanId": 8912358811565729,
    "sequence": 0,
    "startTime": 1592271264494,
    "elapsedTime": 14,
    "startElapsed": 3,
    "serviceType": 6600,
    "endPoint": "localhost:3000",
    "annotations": [{
      "key": 12,
      "value": {
        "stringValue": "express.middleware.logger"
      }
    }],
    "depth": 1,
    "nextSpanId": -1,
    "destinationId": "localhost:3000",
    "apiId": 0,
    "exceptionInfo": null,
    "asyncId": null,
    "nextAsyncId": null,
    "asyncSequence": null,
    "dummyId": null,
    "nextDummyId": null
  }, {
    "spanId": 8912358811565729,
    "sequence": 6,
    "startTime": 1592271264512,
    "elapsedTime": 0,
    "startElapsed": 21,
    "serviceType": 8200,
    "endPoint": "127.0.0.1:6379",
    "annotations": [{
      "key": 12,
      "value": {
        "stringValue": "redis.set.call"
      }
    }],
    "depth": 2,
    "nextSpanId": -1,
    "destinationId": "Redis",
    "apiId": 0,
    "exceptionInfo": null,
    "asyncId": null,
    "nextAsyncId": 1,
    "asyncSequence": null,
    "dummyId": null,
    "nextDummyId": null
  }, {
    "spanId": 8912358811565729,
    "sequence": 7,
    "startTime": 1592271264513,
    "elapsedTime": 0,
    "startElapsed": 22,
    "serviceType": 8200,
    "endPoint": "127.0.0.1:6379",
    "annotations": [{
      "key": 12,
      "value": {
        "stringValue": "redis.get.call"
      }
    }],
    "depth": 2,
    "nextSpanId": -1,
    "destinationId": "Redis",
    "apiId": 0,
    "exceptionInfo": null,
    "asyncId": null,
    "nextAsyncId": 2,
    "asyncSequence": null,
    "dummyId": null,
    "nextDummyId": null
  }, {
    "spanId": 8912358811565729,
    "sequence": 8,
    "startTime": 1592271264515,
    "elapsedTime": 0,
    "startElapsed": 24,
    "serviceType": 9057,
    "endPoint": "localhost:6379",
    "annotations": [{
      "key": 12,
      "value": {
        "stringValue": "redis.SET.call"
      }
    }],
    "depth": 2,
    "nextSpanId": -1,
    "destinationId": "Redis",
    "apiId": 0,
    "exceptionInfo": null,
    "asyncId": null,
    "nextAsyncId": 3,
    "asyncSequence": null,
    "dummyId": null,
    "nextDummyId": null
  }, {
    "spanId": 8912358811565729,
    "sequence": 9,
    "startTime": 1592271264516,
    "elapsedTime": 0,
    "startElapsed": 25,
    "serviceType": 9057,
    "endPoint": "localhost:6379",
    "annotations": [{
      "key": 12,
      "value": {
        "stringValue": "redis.GET.call"
      }
    }],
    "depth": 2,
    "nextSpanId": -1,
    "destinationId": "Redis",
    "apiId": 0,
    "exceptionInfo": null,
    "asyncId": null,
    "nextAsyncId": 4,
    "asyncSequence": null,
    "dummyId": null,
    "nextDummyId": null
  }, {
    "spanId": 8912358811565729,
    "sequence": 5,
    "startTime": 1592271264511,
    "elapsedTime": 6,
    "startElapsed": 20,
    "serviceType": 6600,
    "endPoint": "localhost:3000",
    "annotations": [],
    "depth": 1,
    "nextSpanId": -1,
    "destinationId": "localhost:3000",
    "apiId": 2,
    "exceptionInfo": null,
    "asyncId": null,
    "nextAsyncId": null,
    "asyncSequence": null,
    "dummyId": null,
    "nextDummyId": null
  }],
  "endPoint": null,
  "applicationServiceType": 1400,
  "localAsyncId": null
}

test('sendSpanChunk', function (t) {
  t.plan(1)

  const grpcDataSender = new GrpcDataSender()
  grpcDataSender.spanClient = {
    sendSpan: function (spanChunk) {
      grpcDataSender.actualSpanChunk = spanChunk
    }
  }

  grpcDataSender.sendSpanChunk(expectedSpanChunk)

  t.true(grpcDataSender.actualSpanChunk != null, 'spanChunk send')
})

test('dataSender sendSpanChunk test', function (t) {
  t.plan(1)

  dataSender.dataSender = dataSenderMock()
  dataSender.sendSpanChunk({})
  t.deepEqual(dataSender.dataSender.mockSpanChunk, {}, 'spanChunk use gRPC protocoal')
})