/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const dataConvertor = require('../../lib/data/grpc-data-convertor')
const statMessages = require('../../lib/data/v1/Stat_pb')

test('convertStat sends the open file descriptor count when collected', (t) => {
    const pAgentStat = dataConvertor.convertStat(agentStat({ openFileDescriptorCount: 12 })).getAgentstat()

    t.equal(pAgentStat.getFiledescriptor().getOpenfiledescriptorcount(), 12, 'PFileDescriptor.openFileDescriptorCount is 12')
    t.end()
})

test('convertStat does not send the open file descriptor count when not collected', (t) => {
    const pAgentStat = dataConvertor.convertStat(agentStat({})).getAgentstat()

    t.equal(pAgentStat.getFiledescriptor(), undefined, 'PFileDescriptor is not sent')
    t.end()
})

test('convertStat sends GC count and time as uncollected (-1) when GC stats are not collected', (t) => {
    const pJvmGc = dataConvertor.convertStat(agentStat({ memory: { heapUsed: 1, heapMax: 2, nonHeapUsed: 3 } })).getAgentstat().getGc()

    t.equal(pJvmGc.getJvmmemoryheapused(), 1, 'PJvmGc.jvmMemoryHeapUsed is sent')
    t.equal(pJvmGc.getJvmgcoldcount(), -1, 'PJvmGc.jvmGcOldCount is uncollected (-1)')
    t.equal(pJvmGc.getJvmgcoldtime(), -1, 'PJvmGc.jvmGcOldTime is uncollected (-1)')
    t.equal(pJvmGc.getJvmgcdetailed(), undefined, 'PJvmGcDetailed is not sent')
    t.end()
})

test('convertStat sends memory and GC count and time as PJvmGc when GC stats are collected', (t) => {
    const gc = { oldCount: 4, oldTime: 5, newCount: 6, newTime: 7 }
    const pJvmGc = dataConvertor.convertStat(agentStat({ memory: { heapUsed: 1, heapMax: 2, nonHeapUsed: 3 }, gc })).getAgentstat().getGc()

    t.equal(pJvmGc.getType(), statMessages.PJvmGcType.JVM_GC_TYPE_UNKNOWN, 'PJvmGc.type is JVM_GC_TYPE_UNKNOWN')
    t.equal(pJvmGc.getJvmmemoryheapmax(), 2, 'PJvmGc.jvmMemoryHeapMax is the heap max')
    t.equal(pJvmGc.getJvmmemorynonheapused(), 3, 'PJvmGc.jvmMemoryNonHeapUsed is the non-heap used')
    t.equal(pJvmGc.getJvmmemorynonheapmax(), -1, 'PJvmGc.jvmMemoryNonHeapMax is uncollected (-1)')
    t.equal(pJvmGc.getJvmgcoldcount(), 4, 'PJvmGc.jvmGcOldCount is the major GC count')
    t.equal(pJvmGc.getJvmgcoldtime(), 5, 'PJvmGc.jvmGcOldTime is the major GC time')
    t.equal(pJvmGc.getJvmgcdetailed().getJvmgcnewcount(), 6, 'PJvmGcDetailed.jvmGcNewCount is the minor GC count')
    t.equal(pJvmGc.getJvmgcdetailed().getJvmgcnewtime(), 7, 'PJvmGcDetailed.jvmGcNewTime is the minor GC time')
    t.end()
})

test('convertStat sends the process user and system cpu as PCpuLoad', (t) => {
    const pCpuLoad = dataConvertor.convertStat(agentStat({ cpu: { user: 0.3, system: 0.4 } })).getAgentstat().getCpuload()

    t.equal(pCpuLoad.getJvmcpuload(), 0.3, 'PCpuLoad.jvmCpuLoad is the process user cpu')
    t.equal(pCpuLoad.getSystemcpuload(), 0.4, 'PCpuLoad.systemCpuLoad is the system cpu')
    t.end()
})

test('convertStat sends transaction counts as PTransaction', (t) => {
    const transaction = { sampledNewCount: 3, sampledContinuationCount: 2, unsampledNewCount: 1, unsampledContinuationCount: 4, skippedNewCount: 0, skippedContinuationCount: 0 }
    const pTransaction = dataConvertor.convertStat(agentStat({ transaction })).getAgentstat().getTransaction()

    t.equal(pTransaction.getSamplednewcount(), 3, 'PTransaction.sampledNewCount is 3')
    t.equal(pTransaction.getSampledcontinuationcount(), 2, 'PTransaction.sampledContinuationCount is 2')
    t.equal(pTransaction.getUnsamplednewcount(), 1, 'PTransaction.unsampledNewCount is 1')
    t.equal(pTransaction.getUnsampledcontinuationcount(), 4, 'PTransaction.unsampledContinuationCount is 4')
    t.equal(pTransaction.getSkippednewcount(), 0, 'PTransaction.skippedNewCount is 0')
    t.equal(pTransaction.getSkippedcontinuationcount(), 0, 'PTransaction.skippedContinuationCount is 0')
    t.end()
})

test('convertStat sends response time avg and max as PResponseTime', (t) => {
    const pResponseTime = dataConvertor.convertStat(agentStat({ responseTime: { avg: 20, max: 30 } })).getAgentstat().getResponsetime()

    t.equal(pResponseTime.getAvg(), 20, 'PResponseTime.avg is 20')
    t.equal(pResponseTime.getMax(), 30, 'PResponseTime.max is 30')
    t.end()
})

function agentStat(fields) {
    return Object.assign({
        timestamp: Date.now(),
        collectInterval: 1000,
        cpu: { user: 0.1, system: 0.2 },
    }, fields)
}
