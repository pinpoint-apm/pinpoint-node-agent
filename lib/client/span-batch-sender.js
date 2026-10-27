/**
 * Pinpoint Node.js Agent
 * Copyright 2026-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const grpc = require('@grpc/grpc-js')
const spanMessages = require('../data/v1/Span_pb')
const log = require('../utils/log/logger')
const { logError } = require('./grpc-errors')

// GrpcTransportConfig.java DEFAULT_SPAN_SENDER_EXECUTOR_QUEUE_SIZE
const maxQueuedSpans = 1000

// SpanBatchGrpcDataSender.java
class SpanBatchSender {
    constructor(spanClient, spanBatch, requestDeadlineOptionsBuilder, logger) {
        this.spanClient = spanClient
        this.batchSize = Math.min(spanBatch.size, maxQueuedSpans)
        this.remainingSpansWaitMillis = spanBatch.deadlineMillis
        this.maxConcurrentRequests = spanBatch.maxRequests
        this.requestDeadlineOptionsBuilder = requestDeadlineOptionsBuilder
        this.logger = logger
        this.queue = []
        this.sendingBatchCount = 0
        this.sendingStopped = false
    }

    push(spanOrSpanChunk) {
        if (this.sendingStopped) {
            return
        }

        let pSpanMessage
        try {
            pSpanMessage = spanOrSpanChunk.toProtocolBuffer()
        } catch (e) {
            logError('toProtocolBuffer() Error: ', e)
            return
        }

        this.queue.push(pSpanMessage)
        if (this.queue.length > maxQueuedSpans) {
            this.queue.shift()
            this.logger.warn(`Discarded the oldest span: ${maxQueuedSpans} spans are waiting for ${this.sendingBatchCount} SendSpanBatch requests awaiting a response`)
        }
        if (this.queue.length >= this.batchSize && this.sendingBatchCount < this.maxConcurrentRequests) {
            this.sendSpanBatch(this.takeBatch())
        }
        this.scheduleRemainingSpansSend()
    }

    sendSpanBatch(pSpanMessages) {
        const pSpanMessageBatch = new spanMessages.PSpanMessageBatch()
        pSpanMessageBatch.setSpanList(pSpanMessages)

        this.sendingBatchCount++
        try {
            this.spanClient.sendSpanBatch(pSpanMessageBatch, this.requestDeadlineOptionsBuilder.build(), (err, pSpanResultBatch) => {
                this.sendingBatchCount--
                if (err) {
                    this.handleSendSpanBatchError(err)
                    return
                }
                this.logPartialSuccess(pSpanResultBatch)
            })
        } catch (e) {
            this.sendingBatchCount--
            logError('sendSpanBatch err: ', e)
        }
    }

    handleSendSpanBatchError(err) {
        if (err.code === grpc.status.UNIMPLEMENTED) {
            this.stop()
            return
        }

        logError('sendSpanBatch err: ', err)
    }

    stop() {
        if (this.sendingStopped) {
            return
        }

        this.sendingStopped = true
        this.cancelRemainingSpansSend()
        this.queue = []
        log.getLogger().warn('The collector does not support SendSpanBatch, so span sending stops. Collector 3.1.0 or later is required.')
    }

    logPartialSuccess(pSpanResultBatch) {
        const partialSuccess = pSpanResultBatch?.getPartialSuccess()
        if (!partialSuccess) {
            return
        }

        const rejectedSpans = partialSuccess.getRejectedSpans()
        if (rejectedSpans > 0) {
            this.logger.warn(`The collector rejected ${rejectedSpans} spans: ${errorIdField(partialSuccess.getErrorid())}${partialSuccess.getErrorMessage()}`)
        } else if (partialSuccess.getErrorMessage()) {
            this.logger.info(`The collector answered SendSpanBatch with a warning: ${partialSuccess.getErrorMessage()}`)
        }
    }

    scheduleRemainingSpansSend() {
        if (this.remainingSpansTimer || this.queue.length === 0) {
            return
        }

        this.remainingSpansTimer = setTimeout(() => {
            this.remainingSpansTimer = null
            if (this.queue.length > 0 && this.sendingBatchCount < this.maxConcurrentRequests) {
                this.sendSpanBatch(this.takeBatch())
            }
            this.scheduleRemainingSpansSend()
        }, this.remainingSpansWaitMillis)
        this.remainingSpansTimer.unref()
    }

    end() {
        this.sendingStopped = true
        this.cancelRemainingSpansSend()
        if (this.queue.length > 0) {
            this.sendSpanBatch(this.queue.splice(0))
        }
    }

    cancelRemainingSpansSend() {
        clearTimeout(this.remainingSpansTimer)
        this.remainingSpansTimer = null
    }

    takeBatch() {
        return this.queue.splice(0, this.batchSize)
    }
}

function errorIdField(errorId) {
    if (errorId === '0') {
        return ''
    }
    return `errorId=${errorIdBase64(errorId)}, `
}

// ErrorId.toBase64() in pinpoint-commons
function errorIdBase64(errorId) {
    const bytes = Buffer.alloc(8)
    bytes.writeBigInt64BE(BigInt(errorId))
    return bytes.toString('base64url')
}

module.exports = SpanBatchSender
