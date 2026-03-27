/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class SpanRecorderEnricher {
    constructor(spanRecorder, config, traceRoot) {
        this.spanRecorder = spanRecorder
        this.config = config
        this.traceRoot = traceRoot
    }

    recordServiceType(code) { this.spanRecorder.recordServiceType(code) }
    recordApiId(apiId) { this.spanRecorder.recordApiId(apiId) }
    recordApi(methodDescriptor) { this.spanRecorder.recordApi(methodDescriptor) }
    setApiId0(apiId) { this.spanRecorder.setApiId0(apiId) }
    recordAttribute(key, value) { this.spanRecorder.recordAttribute(key, value) }
    recordRpc(rpc) { this.spanRecorder.recordRpc(rpc) }
    recordEndPoint(endPoint) { this.spanRecorder.recordEndPoint(endPoint) }
    recordRemoteAddress(remoteAddr) { this.spanRecorder.recordRemoteAddress(remoteAddr) }
    recordException(error, markError) { this.spanRecorder.recordException(error, markError) }
    recordAcceptorHost(host) { this.spanRecorder.recordAcceptorHost(host) }
    recordParentApplication(parentApplicationName, parentApplicationType) { this.spanRecorder.recordParentApplication(parentApplicationName, parentApplicationType) }

    recordEnricher(moduleName, ...args) {
        if (!args || args.length < 1) {
            return
        }

        if (moduleName === 'http' && this.config.isUriStatsUseUserInput()) {
            const req = args[0]
            this.setUriTemplate(req['pinpoint.metric.uri-template'], true)
        } else if (moduleName === 'express') {
            const req = args[0]
            this.setUriTemplate(req.route?.path, false)
            if (this.config.isUriStatsHttpMethodEnabled()) {
                this.setUriHttpMethod(req.method)
            }
        } else if (moduleName === 'koa') {
            this.setUriTemplate(args[0], false)
            if (this.config.isUriStatsHttpMethodEnabled()) {
                this.setUriHttpMethod(args[1])
            }
        }
    }

    setUriTemplate(uriTemplate, force) {
        if (typeof uriTemplate !== 'string' || uriTemplate.length < 1) {
            return
        }

        if (!force && this.traceRoot.getEnricher('uriStats.uriTemplate')) {
            return
        }

        this.traceRoot.setEnricher('uriStats.uriTemplate', uriTemplate)
    }

    setUriHttpMethod(httpMethod) {
        if (typeof httpMethod !== 'string' || httpMethod.length === 0) {
            return
        }

        this.traceRoot.setEnricher('uriStats.method', httpMethod)
    }
}

module.exports = {
    SpanRecorderEnricher
}
