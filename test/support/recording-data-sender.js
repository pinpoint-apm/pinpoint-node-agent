/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const ApiMetaInfo = require('../../lib/data/dto/api-meta-info')
const StringMetaInfo = require('../../lib/data/dto/string-meta-info')
const SqlMetaData = require('../../lib/client/sql-meta-data')
const SqlUidMetaData = require('../../lib/client/sql-uid-meta-data')

class RecordingDataSender {
    constructor(dataSender) {
        this.dataSender = dataSender
        this.sentSpans = []
        this.sentSpanChunks = []
        this.sentApiMetaInfos = []
        this.sentStringMetaInfos = []
        this.sentSqlMetaData = []
        this.sentSqlUidMetaData = []
        this.sentExceptionMetaData = []
    }

    send(data) {
        if (this.closed) {
            return
        }
        this.record(data)
        this.dataSender?.send(data)
    }

    sendStat(stats) {
        this.dataSender?.sendStat(stats)
    }

    sendPing() {
        this.dataSender?.sendPing()
    }

    sendSupportedServicesCommand() {
        this.dataSender?.sendSupportedServicesCommand()
    }

    close() {
        this.closed = true
        this.dataSender?.close()
    }

    record(data) {
        if (data?.isSpan?.()) {
            this.sentSpans.push(data)
        } else if (data?.isSpanChunk?.()) {
            this.sentSpanChunks.push(data)
        } else if (data instanceof ApiMetaInfo) {
            this.sentApiMetaInfos.push(data)
        } else if (data instanceof StringMetaInfo) {
            this.sentStringMetaInfos.push(data)
        } else if (data instanceof SqlMetaData) {
            this.sentSqlMetaData.push(data)
        } else if (data instanceof SqlUidMetaData) {
            this.sentSqlUidMetaData.push(data)
        } else if (data?.isExceptionMetaData?.()) {
            this.sentExceptionMetaData.push(data)
        }
    }

    findSpan(traceRoot) {
        return this.sentSpans.find(span => span.traceRoot === traceRoot)
    }

    findSpanChunks(traceRoot) {
        return this.sentSpanChunks.filter(spanChunk => spanChunk.traceRoot === traceRoot)
    }

    findSpanChunk(asyncId) {
        return this.sentSpanChunks.find(spanChunk => spanChunk.localAsyncId?.getAsyncId() === asyncId.getAsyncId())
    }

    findExceptionMetaData(traceRoot) {
        return this.sentExceptionMetaData.find(exceptionMetaData => exceptionMetaData.traceRoot === traceRoot)
    }

    spans() {
        return this.sentSpans
    }

    spanChunks() {
        return this.sentSpanChunks
    }

    apiMetaInfos() {
        return this.sentApiMetaInfos
    }

    stringMetaInfos() {
        return this.sentStringMetaInfos
    }

    sqlMetaData() {
        return this.sentSqlMetaData
    }

    sqlUidMetaData() {
        return this.sentSqlUidMetaData
    }

    exceptionMetaData() {
        return this.sentExceptionMetaData
    }
}

module.exports = RecordingDataSender
