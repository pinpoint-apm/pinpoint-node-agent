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

function agentStat(fields) {
    return Object.assign({
        timestamp: Date.now(),
        collectInterval: 1000,
        cpu: { user: 0.1, system: 0.2 },
    }, fields)
}
