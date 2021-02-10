/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const statMessages = require('./grpc/Stat_pb')
const spanMessages = require('./grpc/Span_pb')
const annotationMessages = require('./grpc/Annotation_pb')
const cmdMessages = require('./grpc/Cmd_pb')
const wrappers = require('google-protobuf/google/protobuf/wrappers_pb')

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
  return pAgentInfo
}

const convertApiMetaInfo = (apiMetaInfo) => {
  if (!apiMetaInfo) {
    return null
  }
  const pApiMetaData = new spanMessages.PApiMetaData()
  pApiMetaData.setApiid(apiMetaInfo.apiId)
  pApiMetaData.setApiinfo(apiMetaInfo.apiInfo)
  pApiMetaData.setType(apiMetaInfo.type)
  pApiMetaData.setLine(-1)
  return pApiMetaData
}

const convertStringMetaInfo = (stringMetaInfo) => {
  if (!stringMetaInfo) {
    return null
  }
  const pStringMetaData = new spanMessages.PStringMetaData()
  pStringMetaData.setStringid(stringMetaInfo.stringId)
  pStringMetaData.setStringvalue(stringMetaInfo.stringValue)
  return pStringMetaData
}

const convertSpan = (span) => {
  if (!span) {
    return null
  }
  const pAcceptEvent = convertAcceptEvent(span)
  const pSpanMessage = new spanMessages.PSpanMessage()
  const pSpan = new spanMessages.PSpan()
  pSpan.setVersion(1)

  if (span.traceId) {
    const pTransactionId = convertTransactionId(span.traceId.transactionId)
    pSpan.setTransactionid(pTransactionId)
  }

  pSpan.setSpanid(span.spanId)
  pSpan.setParentspanid(span.parentSpanId)
  pSpan.setStarttime(span.startTime)
  pSpan.setElapsed(span.elapsedTime)
  pSpan.setApiid(span.apiId)
  pSpan.setServicetype(span.serviceType)
  pSpan.setAcceptevent(pAcceptEvent)
  pSpan.setFlag(span.flag)
  pSpan.setErr(span.err)
  pSpan.setExceptioninfo(convertIntStringValue(span.exceptionInfo))
  pSpan.setApplicationservicetype(span.applicationServiceType)
  pSpan.setLoggingtransactioninfo(span.loggingTransactionInfo)

  addSpanEvents(pSpan, span.spanEventList)
  addAnnotations(pSpan, span.annotations)

  pSpanMessage.setSpan(pSpan)
  return pSpanMessage
}

const convertTransactionId = (transactionId) => {
  if (!transactionId) {
    return null
  }

  const pTransactionId = new spanMessages.PTransactionId()
  pTransactionId.setAgentid(transactionId.agentId)
  pTransactionId.setAgentstarttime(transactionId.agentStartTime)
  pTransactionId.setSequence(transactionId.sequence)
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
  pSpanEvent.setAsyncevent(spanEvent.nextAsyncId)

  addAnnotations(pSpanEvent, spanEvent.annotations)
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
  return typedValue.annotationValue()
}

const convertStringStringValue = (value) => {
  if (!value) {
    return null
  }
  const pStringStringValue = new annotationMessages.PStringStringValue()
  
  const stringValue1 = new wrappers.StringValue()
  stringValue1.setValue(value.stringValue1)
  pStringStringValue.setStringvalue1(stringValue1)
  
  const stringValue2 = new wrappers.StringValue()
  stringValue2.setValue(value.stringValue2)
  pStringStringValue.setStringvalue2(stringValue2)
  return pStringStringValue
}

const convertIntStringValue = (value) => {
  if (!value) {
    return null
  }
  const pIntStringValue = new annotationMessages.PIntStringValue()
  pIntStringValue.setIntvalue(value.intValue)

  const stringValue = new wrappers.StringValue()
  stringValue.setValue(value.stringValue)
  pIntStringValue.setStringvalue(stringValue)
  return pIntStringValue
}

const convertLocalAsyncId = (localAsyncId) => {
  if (!localAsyncId) {
    return null
  }

  const pLocalAsyncId = new spanMessages.PLocalAsyncId()
  pLocalAsyncId.setAsyncid(localAsyncId.asyncId)
  pLocalAsyncId.setSequence(localAsyncId.nextAsyncSequence)

  return pLocalAsyncId
}

const convertCmdMessage = (params) => {
  const pCmdMessage = new cmdMessages.PCmdMessage()

  const pCmdServiceHandshake = new cmdMessages.PCmdServiceHandshake()
  if (params && params.supportCommandList && params.supportCommandList.length > 0) {
    params.supportCommandList.forEach(key => pCmdServiceHandshake.addSupportcommandservicekey(key))
  }

  pCmdMessage.setHandshakemessage(pCmdServiceHandshake)
  return pCmdMessage
}

const convertStat = (stat) => {
  if (!stat) {
    return null
  }
  const pStatMessage = new statMessages.PStatMessage()
  
  const pAgentStat = new statMessages.PAgentStat()
  pAgentStat.setTimestamp(stat.timestamp)
  pAgentStat.setCollectinterval(stat.collectInterval)
  
  const pCpuLoad = new statMessages.PCpuLoad()
  pCpuLoad.setJvmcpuload(stat.cpu.user)
  pCpuLoad.setSystemcpuload(stat.cpu.system)
  pAgentStat.setCpuload(pCpuLoad)

  if (stat.memory) {
    const pJvmGc = new statMessages.PJvmGc()
    pJvmGc.setJvmmemoryheapused(stat.memory.heapUsed)
    pJvmGc.setJvmmemoryheapmax(stat.memory.heapTotal)
    pAgentStat.setGc(pJvmGc)
  }

  if (stat.activeTrace) {
    const pActiveTrace = new statMessages.PActiveTrace()
    const pActiveTraceHistogram = new statMessages.PActiveTraceHistogram()
    pActiveTraceHistogram.setVersion(0)
    pActiveTraceHistogram.setHistogramschematype(stat.activeTrace.typeCode)

    const count = stat.activeTrace.fastCount + stat.activeTrace.normalCount + stat.activeTrace.slowCount + stat.activeTrace.verySlowCount
    pActiveTraceHistogram.addActivetracecount(count)
    
    pActiveTrace.setHistogram(pActiveTraceHistogram)
  }

  pStatMessage.setAgentstat(pAgentStat)
  return pStatMessage
}

const convertPing = () => {
  const pPing = new statMessages.PPing()
  return pPing
}
module.exports = {
  convertAcceptEvent,
  convertAgentInfo,
  convertApiMetaInfo,
  convertStringMetaInfo,
  convertSpan,
  convertStringStringValue,
  convertTransactionId,
  convertLocalAsyncId,
  convertIntStringValue,
  convertNextEvent,
  addAnnotations,
  convertCmdMessage,
  convertStat,
  convertPing
}