'use strict'

const statMessages = require('./grpc/Stat_pb')
const spanMessages = require('./grpc/Span_pb')
const annotationMessages = require('./grpc/Annotation_pb')

const convertAgentInfo = (agentInfo) => {
  if (!agentInfo) {
    return null
  }
  const pAgentInfo = new statMessages.PAgentInfo()
  pAgentInfo.setHostname(agentInfo.hostname)
  pAgentInfo.setIp(agentInfo.ip)
  pAgentInfo.setPorts('')
  pAgentInfo.setServicetype(agentInfo.serviceType)
  pAgentInfo.setPid(agentInfo.pid)
  pAgentInfo.setAgentversion(agentInfo.agentVersion)
  pAgentInfo.setVmversion('')
  pAgentInfo.setContainer(agentInfo.container)
  return pAgentInfo;
}

const convertApiMetaInfo = (apiMetaInfo) => {
  if (!apiMetaInfo) {
    return null
  }
  const pApiMetaData = new statMessages.PApiMetaData()
  pApiMetaData.setApiid(apiMetaInfo.apiId)
  pApiMetaData.setApiinfo(apiMetaInfo.apiInfo)
  pApiMetaData.setType(apiMetaInfo.type)
  return pApiMetaData;
}

const convertStringMetaInfo = (stringMetaInfo) => {
  if (!stringMetaInfo) {
    return null
  }
  const pStringMetaData = new statMessages.PStringMetaData()
  pStringMetaData.setStringid(stringMetaInfo.stringId)
  pStringMetaData.setStringvalue(stringMetaInfo.stringValue)
  return pStringMetaData;
}

const convertSpan = (span) => {
  if (!span) {
    return null
  }
  const pTransactionId = convertTransactionId(span.traceId)
  const pAcceptEvent = convertAcceptEvent(span)
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

  return pSpan;
}

const convertTransactionId = (traceId) => {
  if (!traceId) {
    return null
  }
  const pTransactionId = new spanMessages.PTransactionId()
  if (traceId.transactionId) {
    pTransactionId.setAgentid(traceId.transactionId.agentId)
    pTransactionId.setAgentstarttime(traceId.transactionId.agentStartTime)
    pTransactionId.setSequence(traceId.transactionId.sequence)
  }
  return pTransactionId
}

const convertParentInfo = (span) => {
  if (!span) {
    return null
  }
  const pParentInfo = new spanMessages.PParentInfo()
  pParentInfo.setParentapplicationname(span.parentApplicationName)
  pParentInfo.setParentapplicationtype(span.parentApplicationType)
  pParentInfo.setAcceptorhost(span.acceptorHost)
  return pParentInfo
}

const convertAcceptEvent = (span) => {
  if (!span) {
    return null
  }
  const pAcceptEvent = new spanMessages.PAcceptEvent()
  pAcceptEvent.setRpc(span.rpc)
  pAcceptEvent.setEndpoint(span.endPoint)
  pAcceptEvent.setRemoteaddr(span.remoteAddr)
  pAcceptEvent.setParentinfo(convertParentInfo(span))
  return pAcceptEvent
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

module.exports = {
  convertAgentInfo,
  convertApiMetaInfo,
  convertStringMetaInfo,
  convertSpan,
}
