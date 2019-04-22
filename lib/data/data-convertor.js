'use strict'

const TAgentStat = require('./dto/Pinpoint_types').TAgentStat
const TAgentInfo = require('./dto/Pinpoint_types').TAgentInfo
const TStringMetaData = require('./dto/Trace_types').TStringMetaData
const TApiMetaData = require('./dto/Trace_types').TApiMetaData
const TSpan = require('./dto/Trace_types').TSpan
const TSpanChunk = require('./dto/Trace_types').TSpanChunk


const convertTAgentInfo = (agentInfo) => {
  if (!agentInfo) {
    return null
  }
  return new TAgentInfo(agentInfo)
}

const convertTStringMetaData = (metaInfo) => {
  if (!metaInfo) {
    return null
  }
  return new TStringMetaData(metaInfo)
}

const convertTApiMetaData = (metaInfo) => {
  if (!metaInfo) {
    return null
  }
  return new TApiMetaData(metaInfo)
}

const convertTSpan = (span) => {
  if (!span) {
    return null
  }
  return new TSpan(span)
}

const convertTSpanChunk = (spanChunk) => {
  if (!spanChunk) {
    return null
  }
  return new TSpanChunk(spanChunk)
}

const convertTAgentStat = (statsInfo) => {
  if (!statsInfo) {
    return null
  }
  return new TAgentStat({
    agentId: statsInfo.agentId,
    startTimestamp: statsInfo.agentStartTime,
    timestamp: statsInfo.timestamp,
    collectInterval: statsInfo.collectInterval,
    gc: {
      type: 0,
      jvmMemoryHeapUsed: statsInfo.memory ? statsInfo.memory.heapUsed : -1,
      jvmMemoryHeapMax: statsInfo.memory ? statsInfo.memory.heapTotal : -1,
      jvmMemoryNonHeapUsed: -1,
      jvmMemoryNonHeapMax: -1,
      jvmGcOldCount: -1,
      jvmGcOldTime: -1,
    },
    cpuLoad: {
      jvmCpuLoad: statsInfo.cpu ? statsInfo.cpu.user : -1,
      systemCpuLoad: statsInfo.cpu ? statsInfo.cpu.system : -1,
    },
    transaction: {},
    activeTrace: createTActiveTrace(statsInfo),
  })
}

const createTActiveTrace = (statsInfo) => {
  if (!statsInfo || !statsInfo.activeTrace) return
  return {
    histogram: {
      version: 0,
      histogramSchemaType: statsInfo.activeTrace.typeCode,
      activeTraceCount: [
        statsInfo.activeTrace.fastCount,
        statsInfo.activeTrace.normalCount,
        statsInfo.activeTrace.slowCount,
        statsInfo.activeTrace.verySlowCount,
      ],
    }
  }
}

module.exports = {
  convertTAgentStat,
  convertTAgentInfo,
  convertTStringMetaData,
  convertTApiMetaData,
  convertTSpan,
  convertTSpanChunk,
}
