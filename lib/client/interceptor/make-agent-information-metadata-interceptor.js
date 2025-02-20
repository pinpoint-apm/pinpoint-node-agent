/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const grpc = require('@grpc/grpc-js')
const InterceptingCall = grpc.InterceptingCall

const makeAgentInformationMetadataInterceptor = (agentInfo) => {
    return function (options, nextCall) {
        return new InterceptingCall(nextCall(options), {
            start: function (metadata, listener, next) {
                metadata.add('agentid', agentInfo.agentId)
                if (agentInfo.getAgentName()) {
                    metadata.add('agentname', agentInfo.getAgentName())
                }
                metadata.add('applicationname', agentInfo.applicationName)
                metadata.add('starttime', String(agentInfo.agentStartTime))
                next(metadata, listener, next)
            },
        })
    }
}

module.exports = makeAgentInformationMetadataInterceptor