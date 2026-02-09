/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const statsMessages = require('../data/v1/Stat_pb')

class UriStatsSnapshot {
    constructor(baseTimestamp, capacity) {
        this.baseTimestamp = baseTimestamp
        this.capacity = capacity
        this.dataMap/*<String, UriStatsEntry>*/ = new Map()
    }

    add(uriStatsInfo) {
        const uri = uriStatsInfo.getUri()

        if (this.dataMap.size >= this.capacity && !this.dataMap.has(uri)) {
            return false
        }

        let entry = this.dataMap.get(uri)
        if (!entry) {
            entry = new UriStatsEntry(uri)
            this.dataMap.set(uri, entry)
        }
        entry.add(uriStatsInfo)
        return true
    }

    getBaseTimestamp() {
        return this.baseTimestamp
    }

    isUriStatsSnapshot() {
        return true
    }

    toProtocolBuffer() {
        const statsMessage = new statsMessages.PStatMessage()
        const agentUriStats = new statsMessages.PAgentUriStat()
        agentUriStats.setBucketversion(0)

        this.dataMap.forEach((entry, uri) => {
            const each = new statsMessages.PEachUriStat()
            each.setUri(uri)
            each.setTotalhistogram(convertHistogram(entry.totalHistogram))
            each.setFailedhistogram(convertHistogram(entry.failedHistogram))
            each.setTimestamp(this.baseTimestamp)
            agentUriStats.addEachuristat(each)
        })

        statsMessage.setAgenturistat(agentUriStats)
        return statsMessage
    }
}

class UriStatsEntry {
    constructor(uri) {
        this.uri = uri
        this.totalHistogram = createHistogram()
        this.failedHistogram = createHistogram()
    }

    add(info) {
        const elapsed = info.getElapsed()

        updateHistogram(this.totalHistogram, elapsed)

        if (info.isFailed()) {
            updateHistogram(this.failedHistogram, elapsed)
        }
    }
}

function createHistogram() {
    return {
        count: 0,
        sum: 0,
        max: 0,
        buckets: [0, 0, 0, 0, 0, 0, 0, 0]
    }
}

function updateHistogram(histogram, elapsed) {
    histogram.count += 1
    histogram.sum += elapsed
    if (elapsed > histogram.max) {
        histogram.max = elapsed
    }

    const idx = getBucketIndex(elapsed)
    histogram.buckets[idx] += 1
}

function getBucketIndex(elapsed) {
    if (elapsed < 100) return 0
    if (elapsed < 300) return 1
    if (elapsed < 500) return 2
    if (elapsed < 1000) return 3
    if (elapsed < 3000) return 4
    if (elapsed < 5000) return 5
    if (elapsed < 8000) return 6
    return 7
}

function convertHistogram(histogram) {
    const protoHistogram = new statsMessages.PUriHistogram()
    protoHistogram.setTotal(histogram.sum)
    protoHistogram.setMax(histogram.max)
    histogram.buckets.forEach((count) => protoHistogram.addHistogram(count))
    return protoHistogram
}

module.exports = {
    UriStatsSnapshot
}