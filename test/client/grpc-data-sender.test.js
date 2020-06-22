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
dataSender.basicDataSender.statUdpClient.close()
dataSender.basicDataSender = dataSenderMock()
dataSender.dataSender.agentClient.close()
dataSender.dataSender.metadataClient.close()
dataSender.dataSender.spanClient.close()
dataSender.dataSender = dataSenderMock()

const Annotation = require('../../lib/context/annotation')
const {
  DefaultAnnotationKey
} = require('../../lib/constant/annotation-key')
const AsyncId = require('../../lib/context/async-id')

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
      "agentStartTime": 1592572771026,
      "sequence": 5
    },
    "spanId": 2894367178713953,
    "parentSpanId": -1,
    "flag": 0
  },
  "agentId": "express-node-sample-id",
  "applicationName": "express-node-sample-name",
  "agentStartTime": 1592572771026,
  "serviceType": 1400,
  "spanId": 2894367178713953,
  "parentSpanId": -1,
  "transactionId": {
    "type": "Buffer",
    "data": [0, 44, 101, 120, 112, 114, 101, 115, 115, 45, 110, 111, 100, 101, 45, 115, 97, 109, 112, 108, 101, 45, 105, 100, 210, 245, 239, 229, 172, 46, 5]
  },
  "startTime": 1592574173350,
  "elapsedTime": 28644,
  "rpc": "/",
  "endPoint": "localhost:3000",
  "remoteAddr": "::1",
  "annotations": [],
  "flag": 0,
  "err": 1,
  "spanEventList": null,
  "apiId": 1,
  "exceptionInfo": null,
  "applicationServiceType": 1400,
  "loggingTransactionInfo": null,
  "version": 1
}

test('Should send span ', function (t) {
  t.plan(20)

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
  t.equal(actualTransactionId.getAgentstarttime(), 1592572771026, 'agent start time')
  t.equal(actualTransactionId.getSequence(), 5)

  t.equal(actual.getSpanid(), 2894367178713953, 'span ID')
  t.equal(actual.getParentspanid(), -1, 'parent span ID')

  t.equal(actual.getStarttime(), 1592574173350, 'startTimeStamp')
  t.equal(actual.getElapsed(), 28644, 'elapsed time')
  t.equal(actual.getApiid(), 1, 'api ID')

  t.equal(actual.getServicetype(), 1400, 'service type')

  const actualAcceptEvent = actual.getAcceptevent()
  t.equal(actualAcceptEvent.getRpc(), '/', 'rpc')
  t.equal(actualAcceptEvent.getEndpoint(), 'localhost:3000', 'endPoint')
  t.equal(actualAcceptEvent.getRemoteaddr(), '::1', 'remoteAddr')

  t.equal(actual.getFlag(), 0, 'flag')
  t.equal(actual.getErr(), 1, 'Error')

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

  t.equal(actual.getApplicationservicetype(), 1400, 'applicaiton service type')
  t.equal(actual.getLoggingtransactioninfo(), 0, 'logging transaction info')
})

const grpcDataSender = new GrpcDataSender()
grpcDataSender.spanClient = {
  sendSpan: function () {
    return {
      write: function (spanChunk) {
        grpcDataSender.actualSpanChunk = spanChunk
      },
      end: function () {

      }
    }
  }
}
test('sendSpanChunk redis.SET.end', function (t) {
  t.plan(16)

  let expectedSpanChunk = {
    "agentId": "express-node-sample-id",
    "applicationName": "express-node-sample-name",
    "agentStartTime": 1592572771026,
    "serviceType": 1400,
    "spanId": 2894367178713953,
    "parentSpanId": -1,
    "transactionId": {
      "type": "Buffer",
      "data": [0, 44, 101, 120, 112, 114, 101, 115, 115, 45, 110, 111, 100, 101, 45, 115, 97, 109, 112, 108, 101, 45, 105, 100, 210, 245, 239, 229, 172, 46, 5]
    },
    "transactionIdObject": {
      "agentId": "express-node-sample-id",
      "agentStartTime": 1592572771026,
      "sequence": 5
    },
    "spanEventList": [{
      "spanId": 2894367178713953,
      "sequence": 0,
      "startTime": 1592574173364,
      "elapsedTime": 0,
      "startElapsed": 14,
      "serviceType": 8200,
      "endPoint": "localhost:6379",
      "annotations": [new Annotation(DefaultAnnotationKey.API, "redis.SET.end")],
      "depth": 1,
      "nextSpanId": 553246505726269,
      "destinationId": "Redis",
      "apiId": 0,
      "exceptionInfo": null,
      "asyncId": null,
      "nextAsyncId": null,
      "asyncSequence": null,
      "dummyId": null,
      "nextDummyId": null
    }],
    "endPoint": null,
    "applicationServiceType": 1400,
    "localAsyncId": new AsyncId(7)
  }
  grpcDataSender.sendSpanChunk(expectedSpanChunk)

  const actual = grpcDataSender.actualSpanChunk.getSpanchunk()
  t.true(actual != null, 'spanChunk send')
  t.equal(actual.getVersion(), 1, 'spanChunk version is 1')

  const actualTransactionId = actual.getTransactionid()
  t.equal(actualTransactionId.getAgentid(), 'express-node-sample-id', 'gRPC agentId')
  t.equal(actualTransactionId.getAgentstarttime(), 1592572771026, 'agent start time')
  t.equal(actualTransactionId.getSequence(), 5, 'sequence')

  t.equal(actual.getSpanid(), 2894367178713953, 'span ID')
  t.equal(actual.getEndpoint(), '', 'endpoint')
  t.equal(actual.getApplicationservicetype(), 1400, 'application service type')

  const actualLocalAsyncId = actual.getLocalasyncid()
  t.equal(actualLocalAsyncId.getAsyncid(), 7, 'local async id')
  t.equal(actualLocalAsyncId.getSequence(), 1, 'local async id sequence')

  const actualSpanEvents = actual.getSpaneventList()
  actualSpanEvents.forEach(pSpanEvent => {
    t.equal(pSpanEvent.getSequence(), 0, 'sequence')
    t.equal(pSpanEvent.getDepth(), 1, 'depth')

    t.equal(pSpanEvent.getStartelapsed(), 14, 'startElapsed')

    t.equal(pSpanEvent.getServicetype(), 8200, 'serviceType')

    const pAnnotations = pSpanEvent.getAnnotationList()
    pAnnotations.forEach(annotation => {
      t.equal(annotation.getKey(), 12, 'annotation key')
      const pAnnotationValue = annotation.getValue()
      t.equal(pAnnotationValue.getStringvalue(), "redis.SET.end", 'annotation string value')
    })
  })
})

test('sendSpanChunk redis.GET.end', (t) => {
  const expectedSpanChunk = {
    "agentId": "express-node-sample-id",
    "applicationName": "express-node-sample-name",
    "agentStartTime": 1592572771026,
    "serviceType": 1400,
    "spanId": 2894367178713953,
    "parentSpanId": -1,
    "transactionId": {
      "type": "Buffer",
      "data": [0, 44, 101, 120, 112, 114, 101, 115, 115, 45, 110, 111, 100, 101, 45, 115, 97, 109, 112, 108, 101, 45, 105, 100, 210, 245, 239, 229, 172, 46, 5]
    },
    "transactionIdObject": {
      "agentId": "express-node-sample-id",
      "agentStartTime": 1592572771026,
      "sequence": 5
    },
    "spanEventList": [{
      "spanId": 2894367178713953,
      "sequence": 0,
      "startTime": 1592574173366,
      "elapsedTime": 0,
      "startElapsed": 16,
      "serviceType": 8200,
      "endPoint": "localhost:6379",
      "annotations": [new Annotation(DefaultAnnotationKey.API, "redis.GET.end")],
      "depth": 1,
      "nextSpanId": 3704047662997471,
      "destinationId": "Redis",
      "apiId": 0,
      "exceptionInfo": null,
      "asyncId": null,
      "nextAsyncId": null,
      "asyncSequence": null,
      "dummyId": null,
      "nextDummyId": null
    }],
    "endPoint": null,
    "applicationServiceType": 1400,
    "localAsyncId": new AsyncId(8)
  }
  grpcDataSender.sendSpanChunk(expectedSpanChunk)
  const actual = grpcDataSender.actualSpanChunk.getSpanchunk()

  t.plan(15)
  t.equal(actual.getVersion(), 1, 'version')

  const actualTransactionId = actual.getTransactionid()
  t.equal(actualTransactionId.getAgentid(), 'express-node-sample-id', 'gRPC agentId')
  t.equal(actualTransactionId.getAgentstarttime(), 1592572771026, 'agent start time')
  t.equal(actualTransactionId.getSequence(), 5, 'sequence')

  t.equal(actual.getSpanid(), 2894367178713953, 'span ID')
  t.equal(actual.getEndpoint(), '', 'endpoint')
  t.equal(actual.getApplicationservicetype(), 1400, 'application service type')

  const actualLocalAsyncId = actual.getLocalasyncid()
  t.equal(actualLocalAsyncId.getAsyncid(), 8, 'local async id')
  t.equal(actualLocalAsyncId.getSequence(), 1, 'local async id sequence')

  const actualSpanEvents = actual.getSpaneventList()
  actualSpanEvents.forEach(pSpanEvent => {
    t.equal(pSpanEvent.getSequence(), 0, 'sequence')
    t.equal(pSpanEvent.getDepth(), 1, 'depth')

    t.equal(pSpanEvent.getStartelapsed(), 16, 'startElapsed')

    t.equal(pSpanEvent.getServicetype(), 8200, 'serviceType')

    const pAnnotations = pSpanEvent.getAnnotationList()
    pAnnotations.forEach(annotation => {
      t.equal(annotation.getKey(), 12, 'annotation key')
      const pAnnotationValue = annotation.getValue()
      t.equal(pAnnotationValue.getStringvalue(), "redis.GET.end", 'annotation string value')
    })
  })
})

// expectedSpanChunk = {
//   "agentId": "express-node-sample-id",
//   "applicationName": "express-node-sample-name",
//   "agentStartTime": 1592572771026,
//   "serviceType": 1400,
//   "spanId": 2894367178713953,
//   "parentSpanId": -1,
//   "transactionId": {
//     "type": "Buffer",
//     "data": [0, 44, 101, 120, 112, 114, 101, 115, 115, 45, 110, 111, 100, 101, 45, 115, 97, 109, 112, 108, 101, 45, 105, 100, 210, 245, 239, 229, 172, 46, 5]
//   },
//   "transactionIdObject": {
//     "agentId": "express-node-sample-id",
//     "agentStartTime": 1592572771026,
//     "sequence": 5
//   },
//   "spanEventList": [{
//     "spanId": 2894367178713953,
//     "sequence": 4,
//     "startTime": 1592574173358,
//     "elapsedTime": 0,
//     "startElapsed": 8,
//     "serviceType": 6600,
//     "endPoint": "localhost:3000",
//     "annotations": [{
//       "key": 12,
//       "value": {
//         "stringValue": "express.middleware.serveStatic"
//       }
//     }],
//     "depth": 5,
//     "nextSpanId": -1,
//     "destinationId": "localhost:3000",
//     "apiId": 0,
//     "exceptionInfo": null,
//     "asyncId": null,
//     "nextAsyncId": null,
//     "asyncSequence": null,
//     "dummyId": null,
//     "nextDummyId": null
//   }, {
//     "spanId": 2894367178713953,
//     "sequence": 3,
//     "startTime": 1592574173356,
//     "elapsedTime": 3,
//     "startElapsed": 6,
//     "serviceType": 6600,
//     "endPoint": "localhost:3000",
//     "annotations": [{
//       "key": 12,
//       "value": {
//         "stringValue": "express.middleware.cookieParser"
//       }
//     }],
//     "depth": 4,
//     "nextSpanId": -1,
//     "destinationId": "localhost:3000",
//     "apiId": 0,
//     "exceptionInfo": null,
//     "asyncId": null,
//     "nextAsyncId": null,
//     "asyncSequence": null,
//     "dummyId": null,
//     "nextDummyId": null
//   }, {
//     "spanId": 2894367178713953,
//     "sequence": 2,
//     "startTime": 1592574173354,
//     "elapsedTime": 6,
//     "startElapsed": 4,
//     "serviceType": 6600,
//     "endPoint": "localhost:3000",
//     "annotations": [{
//       "key": 12,
//       "value": {
//         "stringValue": "express.middleware.urlencodedParser"
//       }
//     }],
//     "depth": 3,
//     "nextSpanId": -1,
//     "destinationId": "localhost:3000",
//     "apiId": 0,
//     "exceptionInfo": null,
//     "asyncId": null,
//     "nextAsyncId": null,
//     "asyncSequence": null,
//     "dummyId": null,
//     "nextDummyId": null
//   }, {
//     "spanId": 2894367178713953,
//     "sequence": 1,
//     "startTime": 1592574173353,
//     "elapsedTime": 8,
//     "startElapsed": 3,
//     "serviceType": 6600,
//     "endPoint": "localhost:3000",
//     "annotations": [{
//       "key": 12,
//       "value": {
//         "stringValue": "express.middleware.jsonParser"
//       }
//     }],
//     "depth": 2,
//     "nextSpanId": -1,
//     "destinationId": "localhost:3000",
//     "apiId": 0,
//     "exceptionInfo": null,
//     "asyncId": null,
//     "nextAsyncId": null,
//     "asyncSequence": null,
//     "dummyId": null,
//     "nextDummyId": null
//   }, {
//     "spanId": 2894367178713953,
//     "sequence": 0,
//     "startTime": 1592574173352,
//     "elapsedTime": 9,
//     "startElapsed": 2,
//     "serviceType": 6600,
//     "endPoint": "localhost:3000",
//     "annotations": [{
//       "key": 12,
//       "value": {
//         "stringValue": "express.middleware.logger"
//       }
//     }],
//     "depth": 1,
//     "nextSpanId": -1,
//     "destinationId": "localhost:3000",
//     "apiId": 0,
//     "exceptionInfo": null,
//     "asyncId": null,
//     "nextAsyncId": null,
//     "asyncSequence": null,
//     "dummyId": null,
//     "nextDummyId": null
//   }, {
//     "spanId": 2894367178713953,
//     "sequence": 6,
//     "startTime": 1592574173364,
//     "elapsedTime": 0,
//     "startElapsed": 14,
//     "serviceType": 9057,
//     "endPoint": "localhost:6379",
//     "annotations": [{
//       "key": 12,
//       "value": {
//         "stringValue": "redis.SET.call"
//       }
//     }],
//     "depth": 2,
//     "nextSpanId": -1,
//     "destinationId": "Redis",
//     "apiId": 0,
//     "exceptionInfo": null,
//     "asyncId": null,
//     "nextAsyncId": 7,
//     "asyncSequence": null,
//     "dummyId": null,
//     "nextDummyId": null
//   }, {
//     "spanId": 2894367178713953,
//     "sequence": 7,
//     "startTime": 1592574173366,
//     "elapsedTime": 0,
//     "startElapsed": 16,
//     "serviceType": 9057,
//     "endPoint": "localhost:6379",
//     "annotations": [{
//       "key": 12,
//       "value": {
//         "stringValue": "redis.GET.call"
//       }
//     }],
//     "depth": 2,
//     "nextSpanId": -1,
//     "destinationId": "Redis",
//     "apiId": 0,
//     "exceptionInfo": null,
//     "asyncId": null,
//     "nextAsyncId": 8,
//     "asyncSequence": null,
//     "dummyId": null,
//     "nextDummyId": null
//   }, {
//     "spanId": 2894367178713953,
//     "sequence": 5,
//     "startTime": 1592574173363,
//     "elapsedTime": 3,
//     "startElapsed": 13,
//     "serviceType": 6600,
//     "endPoint": "localhost:3000",
//     "annotations": [],
//     "depth": 1,
//     "nextSpanId": -1,
//     "destinationId": "localhost:3000",
//     "apiId": 2,
//     "exceptionInfo": null,
//     "asyncId": null,
//     "nextAsyncId": null,
//     "asyncSequence": null,
//     "dummyId": null,
//     "nextDummyId": null
//   }, {
//     "spanId": 2894367178713953,
//     "sequence": 8,
//     "startTime": 1592574173368,
//     "elapsedTime": 0,
//     "startElapsed": 18,
//     "serviceType": 9057,
//     "endPoint": "localhost:3000",
//     "annotations": [{
//       "key": 12,
//       "value": {
//         "stringValue": "http.request"
//       }
//     }],
//     "depth": 1,
//     "nextSpanId": -1,
//     "destinationId": "localhost:3000",
//     "apiId": 0,
//     "exceptionInfo": null,
//     "asyncId": null,
//     "nextAsyncId": 9,
//     "asyncSequence": null,
//     "dummyId": null,
//     "nextDummyId": null
//   }, {
//     "spanId": 2894367178713953,
//     "sequence": 9,
//     "startTime": 1592574192442,
//     "elapsedTime": 10,
//     "startElapsed": 19092,
//     "serviceType": 6600,
//     "endPoint": "localhost:3000",
//     "annotations": [{
//       "key": 12,
//       "value": {
//         "stringValue": "express.middleware.[anonymous]"
//       }
//     }],
//     "depth": 1,
//     "nextSpanId": -1,
//     "destinationId": "localhost:3000",
//     "apiId": 0,
//     "exceptionInfo": {
//       "intValue": 1,
//       "stringValue": "SequelizeConnectionError: connect ETIMEDOUT"
//     },
//     "asyncId": null,
//     "nextAsyncId": null,
//     "asyncSequence": null,
//     "dummyId": null,
//     "nextDummyId": null
//   }],
//   "endPoint": null,
//   "applicationServiceType": 1400,
//   "localAsyncId": null
// }