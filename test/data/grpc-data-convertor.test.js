/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const dataConvertor = require('../../lib/data/grpc-data-convertor')

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
