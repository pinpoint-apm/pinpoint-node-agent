'use strict'

const TAgentStat = require('./dto/Pinpoint_types').TAgentStat
const TAgentInfo = require('./dto/Pinpoint_types').TAgentInfo

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

const convertAgentInfo = (agentInfo) => {
  return new TAgentInfo(agentInfo)
}

module.exports = {
  convertTAgentStat,
  convertAgentInfo,
}
