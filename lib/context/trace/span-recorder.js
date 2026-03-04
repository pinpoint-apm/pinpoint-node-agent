/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const annotationKey = require('../../constant/annotation-key')
const Annotations = require('../../instrumentation/context/annotation/annotations')
const { nullObject } = require('./enricher/span-recorder-enricher')

class SpanRecorder {
    constructor(spanBuilder, config) {
        this.spanBuilder = spanBuilder
        this.httpStatusCodeErrors = config.getHttpStatusCodeErrors()
        this.enricher = nullObject
    }

    recordServiceType(code) {
        if (typeof code.getCode !== 'function') {
            return
        }
        this.spanBuilder.setServiceType(code.getCode())
    }

    recordApiId(apiId) {
        if (typeof apiId !== 'number') {
            return
        }
        this.spanBuilder.setApiId(apiId)
    }

    recordApi(methodDescriptor) {
        if (!methodDescriptor || typeof methodDescriptor.getApiId !== 'function' || typeof methodDescriptor.getFullName !== 'function') {
            return
        }

        if (methodDescriptor.getApiId() === 0) {
            this.recordAttribute(annotationKey.API, methodDescriptor.getFullName())
        } else {
            this.setApiId0(methodDescriptor.getApiId())
        }
    }

    setApiId0(apiId) {
        this.spanBuilder.setApiId(apiId)
    }

    recordAttribute(key, value) {
        if (!key || typeof key.getCode !== 'function' || !value) {
            return
        }
        this.spanBuilder.addAnnotation(Annotations.of(key.getCode(), value))

        if (key === annotationKey.HTTP_STATUS_CODE && this.httpStatusCodeErrors.isErrorCode(value)) {
            const traceRoot = this.spanBuilder.getTraceRoot()
            traceRoot.getShared().maskErrorCode(1)
        }
    }

    recordRpc(rpc) {
        if (!rpc) {
            return
        }
        this.spanBuilder.setRpc(rpc)
    }

    recordEndPoint(endPoint) {
        if (!endPoint) {
            return
        }
        this.spanBuilder.setEndPoint(endPoint)
    }

    recordRemoteAddress(remoteAddr) {
        if (!remoteAddr) {
            return
        }
        this.spanBuilder.setRemoteAddress(remoteAddr)
    }

    recordException(error, markError = true) {
        if (!error) {
            return
        }

        if (markError) {
            const traceRoot = this.spanBuilder.getTraceRoot()
            traceRoot.getShared().maskErrorCode(1)
        }
    }

    recordAcceptorHost(host) {
        if (!host) {
            return
        }
        this.spanBuilder.setAcceptorHost(host)
    }

    recordParentApplication(parentApplicationName, parentApplicationType) {
        this.spanBuilder.setParentApplicationName(parentApplicationName)
        this.spanBuilder.setParentApplicationType(parentApplicationType)
    }

    recordEnricher(moduleName, ...args) {
        this.enricher.record(moduleName, ...args)
    }
}

module.exports = SpanRecorder