/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const statMessages = require('./v1/Stat_pb')
const spanMessages = require('./v1/Span_pb')
const annotationMessages = require('./v1/Annotation_pb')
const wrappers = require('google-protobuf/google/protobuf/wrappers_pb')

// Same as the Java agent's MemoryMetric.UNCOLLECTED_VALUE and DetailedMemoryMetric.UNCOLLECTED_USAGE
const UNCOLLECTED_VALUE = -1
const UNCOLLECTED_USAGE = -1

const convertAgentInfo = (agentInfo) => {
  if (!agentInfo) {
    return null
  }
  const pAgentInfo = new statMessages.PAgentInfo()
  pAgentInfo.setHostname(agentInfo.hostname)
  pAgentInfo.setIp(agentInfo.ip)
  pAgentInfo.setPorts('')
  pAgentInfo.setServicetype(agentInfo.getApplicationServiceType())
  pAgentInfo.setPid(agentInfo.pid)
  pAgentInfo.setAgentversion(agentInfo.agentVersion)
  pAgentInfo.setVmversion(agentInfo.vmVersion)
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
  if (apiMetaInfo.lineNumber && typeof apiMetaInfo.lineNumber === 'number') {
    pApiMetaData.setLine(apiMetaInfo.lineNumber)
  } else {
    pApiMetaData.setLine(-1)
  }
  if (apiMetaInfo.location && typeof apiMetaInfo.location === 'string') {
    pApiMetaData.setLocation(apiMetaInfo.location)
  }
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
    annotations.forEach(annotation => {
      const pAnnotation = convertAnnotation(annotation)
      if (pAnnotation) {
        target.addAnnotation(pAnnotation)
      }
    })
  }
}

const convertAnnotation = (annotation) => {
  if (!annotation || typeof annotation.pAnnotation !== 'function') {
    return null
  }

  return annotation.pAnnotation()
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
    pJvmGc.setType(statMessages.PJvmGcType.JVM_GC_TYPE_UNKNOWN)
    pJvmGc.setJvmmemoryheapused(stat.memory.heapUsed)
    pJvmGc.setJvmmemoryheapmax(stat.memory.heapMax)
    pJvmGc.setJvmmemorynonheapused(stat.memory.nonHeapUsed)
    pJvmGc.setJvmmemorynonheapmax(UNCOLLECTED_VALUE)
    if (stat.gc) {
      pJvmGc.setJvmgcoldcount(stat.gc.oldCount)
      pJvmGc.setJvmgcoldtime(stat.gc.oldTime)
      pJvmGc.setJvmgcdetailed(convertJvmGcDetailed(stat.gc))
    } else {
      pJvmGc.setJvmgcoldcount(UNCOLLECTED_VALUE)
      pJvmGc.setJvmgcoldtime(UNCOLLECTED_VALUE)
    }
    pAgentStat.setGc(pJvmGc)
  }

  if (typeof stat.openFileDescriptorCount === 'number') {
    const pFileDescriptor = new statMessages.PFileDescriptor()
    pFileDescriptor.setOpenfiledescriptorcount(stat.openFileDescriptorCount)
    pAgentStat.setFiledescriptor(pFileDescriptor)
  }

  if (stat.activeTrace) {
    const pActiveTrace = new statMessages.PActiveTrace()
    const pActiveTraceHistogram = new statMessages.PActiveTraceHistogram()
    pActiveTraceHistogram.setVersion(0)
    pActiveTraceHistogram.setHistogramschematype(stat.activeTrace.typeCode)

    stat.activeTrace.histogramValues?.().forEach((value) => {
      pActiveTraceHistogram.addActivetracecount(value)
    })
    pActiveTrace.setHistogram(pActiveTraceHistogram)
    pAgentStat.setActivetrace(pActiveTrace)
  }

  if (stat.transaction) {
    const pTransaction = new statMessages.PTransaction()
    pTransaction.setSamplednewcount(stat.transaction.sampledNewCount)
    pTransaction.setSampledcontinuationcount(stat.transaction.sampledContinuationCount)
    pTransaction.setUnsamplednewcount(stat.transaction.unsampledNewCount)
    pTransaction.setUnsampledcontinuationcount(stat.transaction.unsampledContinuationCount)
    pTransaction.setSkippednewcount(stat.transaction.skippedNewCount)
    pTransaction.setSkippedcontinuationcount(stat.transaction.skippedContinuationCount)
    pAgentStat.setTransaction(pTransaction)
  }

  if (stat.responseTime) {
    const pResponseTime = new statMessages.PResponseTime()
    pResponseTime.setAvg(stat.responseTime.avg)
    pResponseTime.setMax(stat.responseTime.max)
    pAgentStat.setResponsetime(pResponseTime)
  }

  pStatMessage.setAgentstat(pAgentStat)
  return pStatMessage
}

const convertJvmGcDetailed = (gc) => {
  const pJvmGcDetailed = new statMessages.PJvmGcDetailed()
  pJvmGcDetailed.setJvmgcnewcount(gc.newCount)
  pJvmGcDetailed.setJvmgcnewtime(gc.newTime)
  pJvmGcDetailed.setJvmpoolcodecacheused(UNCOLLECTED_USAGE)
  pJvmGcDetailed.setJvmpoolnewgenused(UNCOLLECTED_USAGE)
  pJvmGcDetailed.setJvmpoololdgenused(UNCOLLECTED_USAGE)
  pJvmGcDetailed.setJvmpoolsurvivorspaceused(UNCOLLECTED_USAGE)
  pJvmGcDetailed.setJvmpoolpermgenused(UNCOLLECTED_USAGE)
  pJvmGcDetailed.setJvmpoolmetaspaceused(UNCOLLECTED_USAGE)
  return pJvmGcDetailed
}

const convertPing = () => {
  const pPing = new statMessages.PPing()
  return pPing
}
module.exports = {
  convertAgentInfo,
  convertApiMetaInfo,
  convertStringMetaInfo,
  convertIntStringValue,
  convertNextEvent,
  addAnnotations,
  convertStat,
  convertPing
}