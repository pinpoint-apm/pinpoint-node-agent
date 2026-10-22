/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const grpc = require('@grpc/grpc-js')
const InterceptingCall = grpc.InterceptingCall
const ServiceType = require('../context/service-type')

// Java agent ClientHeaderFactoryV1 and ClientHeaderFactoryV4
class ClientHeader {
    static make(agentStartTime, config) {
        const values = {
            agentId: config.getAgentId(),
            agentName: config.getAgentName(),
            applicationName: config.getApplicationName(),
            serviceType: ServiceType.node.getCode(),
            agentStartTime,
        }
        return config.getProtocolVersion() === 'v3'
            ? new ClientHeaderV3(values)
            : new ClientHeaderV4({ ...values, serviceName: config.getServiceName() })
    }

    constructor(values) {
        Object.assign(this, values)
    }

    addTo(metadata) {
        metadata.add('agentid', this.agentId)
        metadata.add('agentname', this.agentName)
        metadata.add('applicationname', this.applicationName)
        metadata.add('servicetype', String(this.serviceType))
        metadata.add('starttime', this.agentStartTime)
    }
}

// Java agent: pinpoint.modules.uid.version v3 sends ProtocolVersion.V1 (100)
class ClientHeaderV3 extends ClientHeader {
    addTo(metadata) {
        super.addTo(metadata)
        metadata.add('protocol.version', '100')
    }
}

// Java agent: pinpoint.modules.uid.version v4 sends ProtocolVersion.V4 (400) and servicename
class ClientHeaderV4 extends ClientHeader {
    addTo(metadata) {
        super.addTo(metadata)
        metadata.add('protocol.version', '400')
        metadata.add('servicename', this.serviceName)
    }
}

const makeClientHeaderInterceptor = (clientHeader) => {
    return function (options, nextCall) {
        return new InterceptingCall(nextCall(options), {
            start: function (metadata, listener, next) {
                clientHeader.addTo(metadata)
                next(metadata, listener, next)
            },
        })
    }
}

module.exports = {
    ClientHeader,
    makeClientHeaderInterceptor
}
