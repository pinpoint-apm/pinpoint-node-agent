'use strict'

const TAgentStat = require('./dto/Pinpoint_types').TAgentStat
const TAgentInfo = require('./dto/Pinpoint_types').TAgentInfo
const TStringMetaData = require('./dto/Trace_types').TStringMetaData
const TApiMetaData = require('./dto/Trace_types').TApiMetaData
const TSpan = require('./dto/Trace_types').TSpan


const convertTAgentInfo = (agentInfo) => {
  return new TAgentInfo(agentInfo)
}

const convertTStringMetaData = (metaInfo) => {
  return new TStringMetaData(metaInfo)
}

const convertTApiMetaData = (metaInfo) => {
  return new TApiMetaData(metaInfo)
}

const convertTSpan= (span) => {
  return new TSpan(span)
}

const convertTAgentStat = (statsInfo) => {
  return new TAgentStat({
    agentId: statsInfo.agentId,
    startTimestamp: statsInfo.agentStartTime,
    timestamp: statsInfo.timestamp,
    collectInterval: statsInfo.collectInterval,
    gc: {
      type: 0,
      jvmMemoryHeapUsed: statsInfo.memory.heapUsed,
      jvmMemoryHeapMax: statsInfo.memory.heapTotal,
      jvmMemoryNonHeapUsed: -1,
      jvmMemoryNonHeapMax: -1,
      jvmGcOldCount: -1,
      jvmGcOldTime: -1,
    },
    cpuLoad: {
      jvmCpuLoad: statsInfo.cpu.user,
      systemCpuLoad: statsInfo.cpu.system,
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
}
