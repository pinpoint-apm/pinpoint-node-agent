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
const TypedValue = require('../../lib/data/typed-value')
dataSender.basicDataSender.closeClient()
dataSender.basicDataSender = dataSenderMock()

const Annotation = require('../../lib/context/annotation')
const {DefaultAnnotationKey} = require('../../lib/constant/annotation-key')

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

const expectedSpan = {
  "traceId": {
    "transactionId": {
      "agentId": "express-node-sample-id",
      "agentStartTime": 1592446918393,
      "sequence": 0
    },
    "spanId": 2052625127828467,
    "parentSpanId": -1,
    "flag": 0
  },
  "agentId": "express-node-sample-id",
  "applicationName": "express-node-sample-name",
  "agentStartTime": 1592446918393,
  "serviceType": 1400,
  "spanId": 2052625127828467,
  "parentSpanId": -1,
  "transactionId": {
    "type": "Buffer",
    "data": [0, 44, 101, 120, 112, 114, 101, 115, 115, 45, 110, 111, 100, 101, 45, 115, 97, 109, 112, 108, 101, 45, 105, 100, 249, 189, 238, 169, 172, 46, 0]
  },
  "startTime": 1592446920106,
  "elapsedTime": 629,
  "rpc": "/",
  "endPoint": "localhost:3000",
  "remoteAddr": "::1",
  "annotations": [],
  "flag": 0,
  "err": null,
  "spanEventList": [{
    "spanId": 2052625127828467,
    "sequence": 10,
    "startTime": 1592446920178,
    "elapsedTime": 0,
    "startElapsed": 72,
    "serviceType": 9057,
    "endPoint": "localhost:3000",
    "endElapsed": 0,
    "annotations": [new Annotation(DefaultAnnotationKey.API, "http.request")],
    "depth": 1,
    "nextSpanId": -1,
    "destinationId": "localhost:3000",
    "apiId": 0,
    "exceptionInfo": null,
    "asyncId": null,
    "nextAsyncId": 5,
    "asyncSequence": null,
    "dummyId": null,
    "nextDummyId": null
  }],
  "apiId": 1,
  "exceptionInfo": null,
  "applicationServiceType": 1400,
  "loggingTransactionInfo": null,
  "version": 1
}

test('Should send span ', function (t) {
  t.plan(25)

  const grpcDataSender = new GrpcDataSender()
  grpcDataSender.spanClient = {
    sendSpan: function () {
      return {
        write: function (span) {
          grpcDataSender.actualSpan = span
        },
        end: function () {

        }
      }
    }
  }

  grpcDataSender.sendSpan(expectedSpan)

  const actual = grpcDataSender.actualSpan.getSpan()
  t.true(actual != null, 'spanChunk send')
  t.equal(actual.getVersion(), 1, 'spanChunk version is 1')

  const actualTransactionId = actual.getTransactionid()
  t.equal(actualTransactionId.getAgentid(), 'express-node-sample-id', 'gRPC agentId')
  t.equal(actualTransactionId.getAgentstarttime(), 1592446918393, 'agent start time')
  t.equal(actualTransactionId.getSequence(), 0)

  t.equal(actual.getSpanid(), 2052625127828467, 'span ID')
  t.equal(actual.getParentspanid(), -1, 'parent span ID')

  t.equal(actual.getStarttime(), 1592446920106, 'startTimeStamp')
  t.equal(actual.getElapsed(), 629, 'elapsed time')
  t.equal(actual.getApiid(), 1, 'api ID')

  t.equal(actual.getServicetype(), 1400, 'service type')

  const actualAcceptEvent = actual.getAcceptevent()
  t.equal(actualAcceptEvent.getRpc(), '/', 'rpc')
  t.equal(actualAcceptEvent.getEndpoint(), 'localhost:3000', 'endPoint')
  t.equal(actualAcceptEvent.getRemoteaddr(), '::1', 'remoteAddr')

  t.equal(actual.getFlag(), 0, 'flag')
  t.equal(actual.getErr(), 0, 'Error')

  const actualSpanEvents = actual.getSpaneventList()
  actualSpanEvents.forEach(pSpanEvent => {
    t.equal(pSpanEvent.getSequence(), 10, 'sequence')
    t.equal(pSpanEvent.getDepth(), 1, 'depth')

    t.equal(pSpanEvent.getStartelapsed(), 72, 'startElapsed')
    t.equal(pSpanEvent.getEndelapsed(), 0, 'endElapsed')

    t.equal(pSpanEvent.getServicetype(), 9057, 'serviceType')

    const pAnnotations = pSpanEvent.getAnnotationList()
    pAnnotations.forEach(annotation => {
      t.equal(annotation.getKey(), 12, 'annotation key')
      const pAnnotationValue = annotation.getValue()
      t.equal(pAnnotationValue.getStringvalue(), "http.request", 'annotation string value')
    })
  })

  t.equal(actual.getApiid(), 1, 'API ID')
  t.equal(actual.getExceptioninfo(), null, 'span exceptionInfo')
})

const expectedSpanChunk = {
  "agentId": "express-node-sample-id",
  "applicationName": "express-node-sample-name",
  "agentStartTime": 1592276292544,
  "serviceType": 1400,
  "spanId": 1677942532546313,
  "parentSpanId": -1,
  "transactionId": {
    "agentId": "express-node-sample-id",
    "agentStartTime": 1592276292544,
    "sequence": 0
  },
  "spanEventList": [{
    "spanId": 1677942532546313,
    "sequence": 4,
    "startTime": 1592276298216,
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
    "spanId": 1677942532546313,
    "sequence": 3,
    "startTime": 1592276298213,
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
    "spanId": 1677942532546313,
    "sequence": 2,
    "startTime": 1592276298211,
    "elapsedTime": 8,
    "startElapsed": 7,
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
    "spanId": 1677942532546313,
    "sequence": 1,
    "startTime": 1592276298210,
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
    "spanId": 1677942532546313,
    "sequence": 0,
    "startTime": 1592276298207,
    "elapsedTime": 13,
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
    "spanId": 1677942532546313,
    "sequence": 6,
    "startTime": 1592276298224,
    "elapsedTime": 0,
    "startElapsed": 20,
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
    "spanId": 1677942532546313,
    "sequence": 7,
    "startTime": 1592276298225,
    "elapsedTime": 0,
    "startElapsed": 21,
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
    "spanId": 1677942532546313,
    "sequence": 8,
    "startTime": 1592276298227,
    "elapsedTime": 0,
    "startElapsed": 23,
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
    "spanId": 1677942532546313,
    "sequence": 9,
    "startTime": 1592276298228,
    "elapsedTime": 0,
    "startElapsed": 24,
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
    "spanId": 1677942532546313,
    "sequence": 5,
    "startTime": 1592276298223,
    "elapsedTime": 7,
    "startElapsed": 19,
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
  "localAsyncId": {
    "asyncId": 1,
    "nextAsyncSequence": 1
  }
}

test.skip('sendSpanChunk', function (t) {
  t.plan(2)

  const grpcDataSender = new GrpcDataSender()
  grpcDataSender.spanClient = {
    sendSpan: function (spanChunk) {
      grpcDataSender.actualSpanChunk = spanChunk
    }
  }

  grpcDataSender.sendSpanChunk(expectedSpanChunk)

  const actual = grpcDataSender.actualSpanChunk
  t.true(actual != null, 'spanChunk send')
  t.equal(actual.getVersion(), 1, 'spanChunk version is 1')
})

test.skip('dataSender sendSpanChunk test', function (t) {
  t.plan(1)

  dataSender.dataSender = dataSenderMock()
  dataSender.sendSpanChunk({})
  t.deepEqual(dataSender.dataSender.mockSpanChunk, {}, 'spanChunk use gRPC protocoal')
})