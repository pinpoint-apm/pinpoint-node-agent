'use strict'

const grpc = require('grpc')
const log = require('../utils/logger')
const services = require('../data/grpc/Service_grpc_pb')
const statMessages = require('../data/grpc/Stat_pb')
const spanMessages = require('../data/grpc/Span_pb')
const annotationMessages = require('../data/grpc/Annotation_pb')
const AgentInfo = require('../data/dto/agent-info')
const TypedValue = require('../data/typed-value')

class GrpcDataSender {
  constructor (
    collectorIp,
    collectorTcpPort,
    collectorStatPort,
    collectorSpanPort,
    agentInfo
  ) {
    const headerInterceptor = function(options, nextCall) {
      return new grpc.InterceptingCall(nextCall(options), {
        start: function(metadata, listener, next) {
          metadata.add('agentid', agentInfo.agentId)
          metadata.add('applicationname', agentInfo.applicationName)
          metadata.add('starttime', String(agentInfo.agentStartTime))
          next(metadata, listener, next)
        },
      })
    }

    this.agentClient = new services.AgentClient(
      collectorIp + ":" + collectorTcpPort,
      grpc.credentials.createInsecure(),
      {
        interceptors: [headerInterceptor]
      }
    )

    this.metadataClient = new services.MetadataClient(
      collectorIp + ":" + collectorTcpPort,
      grpc.credentials.createInsecure(),
      {
        interceptors: [headerInterceptor]
      }
    )

    this.spanClient = new services.SpanClient(
      collectorIp + ":" + collectorSpanPort,
      grpc.credentials.createInsecure(),
      {
        interceptors: [headerInterceptor]
      }
    )
  }

  sendAgentInfo (agentInfo) {
    const pAgentInfo = new statMessages.PAgentInfo()
    pAgentInfo.setHostname(agentInfo.hostname)
    pAgentInfo.setIp(agentInfo.ip)
    pAgentInfo.setPorts('')
    pAgentInfo.setServicetype(agentInfo.serviceType)
    pAgentInfo.setPid(agentInfo.pid)
    pAgentInfo.setAgentversion(agentInfo.agentVersion)
    pAgentInfo.setVmversion('')
    pAgentInfo.setContainer(agentInfo.container)
    this.agentClient.requestAgentInfo(pAgentInfo, (err, response) => {
      //TODO handle response
      log.debug('response', response, err)
    })
  }

  sendApiMetaInfo (apiMetaInfo) {
    const pApiMetaData = new statMessages.PApiMetaData()
    pApiMetaData.setApiid(apiMetaInfo.apiId)
    pApiMetaData.setApiinfo(apiMetaInfo.apiInfo)
    pApiMetaData.setType(apiMetaInfo.type)
    this.metadataClient.requestApiMetaData(pApiMetaData, (err, response) => {
      //TODO handle response
      log.debug('response', response, err)
    })
  }

  sendStringMetaInfo (stringMetaInfo) {
    const pStringMetaData = new statMessages.PStringMetaData()
    pStringMetaData.setStringid(stringMetaInfo.stringId)
    pStringMetaData.setStringvalue(stringMetaInfo.stringValue)
    this.metadataClient.requestStringMetaData(pStringMetaData, (err, response) => {
      //TODO handle response
      log.debug('response', response, err)
    })
  }
  
  
  sendSpan (span) {
    const pTransactionId = new spanMessages.PTransactionId()
    pTransactionId.setAgentid(span.traceId.transactionId.agentId)
    pTransactionId.setAgentstarttime(span.traceId.transactionId.agentStartTime)
    pTransactionId.setSequence(span.traceId.transactionId.sequence)

    const pParentInfo = new spanMessages.PParentInfo()
    pParentInfo.setParentapplicationname(span.parentApplicationName)
    pParentInfo.setParentapplicationtype(span.parentApplicationType)
    pParentInfo.setAcceptorhost(span.acceptorHost)

    const pAcceptEvent = new spanMessages.PAcceptEvent()
    pAcceptEvent.setRpc(span.rpc)
    pAcceptEvent.setEndpoint(span.endPoint)
    pAcceptEvent.setRemoteaddr(span.remoteAddr)
    pAcceptEvent.setParentinfo(pParentInfo)

    const pSpan = new spanMessages.PSpan()
    pSpan.setVersion(span.version);
    pSpan.setTransactionid(pTransactionId);
    pSpan.setSpanid(span.spanId);
    pSpan.setParentspanid(span.parentSpanId);
    pSpan.setStarttime(span.startTime);
    pSpan.setElapsed(span.elapsedTime);
    pSpan.setApiid(span.apiId);
    pSpan.setServicetype(span.serviceType);
    pSpan.setAcceptevent(pAcceptEvent);
    pSpan.setFlag(span.flag);
    pSpan.setErr(span.err);
    pSpan.setExceptioninfo(convertIntStringValue(span.exceptionInfo));
    pSpan.setApplicationservicetype(span.applicationServiceType);
    pSpan.setLoggingtransactioninfo(span.loggingTransactionInfo);

    addSpanEvents(pSpan, span.spanEventList)
    addAnnotations(pSpan, span.annotations)

    this.spanClient.sendSpan(pSpan, (err, response) => {
      //TODO handle response
      log.debug('stream response', response, err)
    })
  }
}

const addSpanEvents = (target, spanEvents) => {
  if (spanEvents && spanEvents.length > 0) {
    spanEvents.forEach(spanEvent => target.addSpanevent(convertSpanEvent(spanEvent)))
  }
}

const convertSpanEvent = (spanEvent) => {
  if (!spanEvent) {
    return null
  }
  const pSpanEvent = new spanMessages.PSpanEvent()
  pSpanEvent.setSequence(spanEvent.sequence)
  pSpanEvent.setDepth(spanEvent.depth)
  pSpanEvent.setStartelapsed(spanEvent.startElapsed)
  pSpanEvent.setEndelapsed(spanEvent.endElapsed)
  pSpanEvent.setServicetype(spanEvent.serviceType)
  pSpanEvent.setApiid(spanEvent.apiId)
  pSpanEvent.setExceptioninfo(convertIntStringValue(spanEvent.exceptionInfo))
  pSpanEvent.setNextevent(convertNextEvent(spanEvent))
  pSpanEvent.setAsyncevent(spanEvent.sequence)

  addAnnotations(spanEvent.annotations)
  return pSpanEvent
}

const convertNextEvent = (spanEvent) => {
  if (!spanEvent) {
    return null
  }
  const pNextEvent = new spanMessages.PNextEvent()
  pNextEvent.setMessageevent(convertMessageEvent(spanEvent))
  return pNextEvent
}

const convertMessageEvent = (spanEvent) => {
  if (!spanEvent) {
    return null
  }
  const pMessageEvent = new spanMessages.PMessageEvent()
  pMessageEvent.setNextspanid(spanEvent.nextSpanId)
  pMessageEvent.setEndpoint(spanEvent.endPoint)
  pMessageEvent.setDestinationid(spanEvent.destinationId)
  return pMessageEvent
}

const addAnnotations = (target, annotations) => {
  if (annotations && annotations.length > 0) {
    annotations.forEach(annotation => target.addAnnotation(convertAnnotation(annotation)))
  }
}

const convertAnnotation = (annotation) => {
  if (!annotation) {
    return null
  }
  const pAnnotation = new annotationMessages.PAnnotation()
  pAnnotation.setKey(annotation.key)
  pAnnotation.setValue(convertAnnotationValue(annotation.value))
  return pAnnotation
}

const convertAnnotationValue = (typedValue) => {
  if (!typedValue) {
    return null
  }
  const pAnnotationValue = new annotationMessages.PAnnotationValue()
  pAnnotationValue.setStringvalue(typedValue.stringValue)
  pAnnotationValue.setBoolvalue(typedValue.boolValue)
  pAnnotationValue.setIntvalue(typedValue.intValue)
  pAnnotationValue.setLongvalue()
  pAnnotationValue.setShortvalue()
  pAnnotationValue.setDoublevalue()
  pAnnotationValue.setBinaryvalue()
  pAnnotationValue.setBytevalue()
  pAnnotationValue.setIntstringvalue()
  pAnnotationValue.setStringstringvalue(convertStringStringValue(typedValue.stringStringValue))
  pAnnotationValue.setIntstringstringvalue()
  pAnnotationValue.setLongintintbytebytestringvalue()
  pAnnotationValue.setIntbooleanintbooleanvalue()
  return pAnnotationValue
}

const convertStringStringValue = (value) => {
  if (!value) {
    return null
  }
  const pStringStringValue = new annotationMessages.PStringStringValue()
  pStringStringValue.setStringvalue1(value.stringValue1)
  pStringStringValue.setStringvalue2(value.stringValue2)
  return pStringStringValue
}

const convertIntStringValue = (value) => {
  if (!value) {
    return null
  }
  const pIntStringValue = new annotationMessages.PIntStringValue()
  pIntStringValue.setIntvalue(value.intValue)
  pIntStringValue.setStringvalue(value.stringValue)
  return pIntStringValue
}

module.exports = GrpcDataSender
