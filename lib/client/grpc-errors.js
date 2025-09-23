/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const grpc = require('@grpc/grpc-js')
const log = require('../utils/log/logger')
const { LogBuilder } = require('../utils/log/log-builder')

let logger = null
function logError(message, error) {
    if (!error) {
        return
    }

    if (!logger) {
        logger = log.getLogger(LogBuilder.buildGrpcLog())
    }

    if (isCancelledError(error)) {
        logger.error(`Pinpoint Collector has been shut down : ${message}`)
    } else if (isUnavailableError(error)) {
        logger.error(`Pinpoint Collector is gRPC connection unavailable : ${message}`)
    } else if (isDeadlineExceededError(error)) {
        logger.error(`gRPC Stream deadline exceeded : ${message}`, error)
    } else {
        logger.error(message, error)
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