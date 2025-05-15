/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const grpc = require('@grpc/grpc-js')
const log = require('../utils/logger')

function logError(message, error) {
    if (!error) {
        return
    }

    if (isCancelledError(error)) {
        log.error(`Pinpoint Collector has been shut down : ${message}`)
    } else if (isUnavailableError(error)) {
        log.error(`Pinpoint Collector is gRPC connection unavailable : ${message}`)
    } else if (isDeadlineExceededError(error)) {
        log.error(`gRPC Stream deadline exceeded : ${message}`, error)
    } else {
        log.error(message, error)
    }
}

function isCancelledError(err) {
    return err?.code === grpc.status.CANCELLED
}

function isUnavailableError(error) {
    return error?.code === grpc.status.UNAVAILABLE
}

function isDeadlineExceededError(err) {
    return err?.code === grpc.status.DEADLINE_EXCEEDED
}

module.exports = {
    isCancelledError,
    isDeadlineExceededError,
    logError
}