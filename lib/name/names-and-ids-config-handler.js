/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { valueOfString, valueOfBoolean } = require('../support/env-utils')
const { isContainerEnvironment } = require('../support/container-environment')
const { newAgentId } = require('../utils/agent-uid')

class NamesAndIdsConfigHandler {
    handle(config) {
        const namesAndIds = new CompositeNamesAndIds([
            new NamesAndIdsEnvironmentVariable(),
            new NamesAndIdsJson(config)
        ])

        return isV3(namesAndIds.getProtocolVersion())
            ? new NamesAndIdsV3ConfigHandler().handle(namesAndIds)
            : new NamesAndIdsV4ConfigHandler().handle(namesAndIds)
    }
}

class NamesAndIdsV3ConfigHandler {
    handle(source) {
        const errors = [
            ...validateIdField({ label: 'Agent ID', value: source.getAgentId(), maxLength: 24, required: false }),
            ...validateIdField({ label: 'Application Name', value: source.getApplicationName(), maxLength: 254, required: true }),
            ...validateIdField({ label: 'Agent Name', value: source.getAgentName(), maxLength: 255, required: false })
        ]
        const agentId = isEmpty(source.getAgentId()) ? newAgentId() : source.getAgentId()
        return {
            ...namesAndIdsOf(source),
            agentId,
            agentName: isEmpty(source.getAgentName()) ? agentId : source.getAgentName(),
            serviceName: undefined,
            collector: { protocolVersion: 'v3' },
            ...messagesOf(errors, [])
        }
    }
}

class NamesAndIdsV4ConfigHandler {
    handle(source) {
        const errors = [
            ...validateIdField({ label: 'Application Name', value: source.getApplicationName(), maxLength: 254, required: true }),
            ...validateIdField({ label: 'Agent Name', value: source.getAgentName(), maxLength: 254, required: false }),
            ...validateIdField({ label: 'Service Name', value: source.getServiceName(), maxLength: 254, required: true })
        ]
        const warns = isEmpty(source.getAgentId()) ? [] : [`Agent ID ${source.getAgentId()} is ignored; collector.protocolVersion v4 always generates the Agent ID. Set collector.protocolVersion to v3 to use a configured Agent ID.`]
        const agentId = newAgentId()
        return {
            ...namesAndIdsOf(source),
            agentId,
            agentName: isEmpty(source.getAgentName()) ? agentId : source.getAgentName(),
            serviceName: source.getServiceName(),
            collector: { protocolVersion: 'v4' },
            ...messagesOf(errors, warns)
        }
    }
}

function namesAndIdsOf(source) {
    return {
        applicationName: source.getApplicationName(),
        features: { container: source.isContainer() === true || isContainerEnvironment() },
    }
}

function messagesOf(errors, warns) {
    if (errors.length === 0 && warns.length === 0) {
        return {}
    }
    return {
        ...(errors.length > 0 ? { enable: false } : {}),
        messages: { errors, warns }
    }
}

class CompositeNamesAndIds {
    constructor(sources) {
        this.sources = sources
    }

    getAgentId() {
        return this.firstValue(source => source.getAgentId())
    }

    getAgentName() {
        return this.firstValue(source => source.getAgentName())
    }

    getApplicationName() {
        return this.firstValue(source => source.getApplicationName())
    }

    getServiceName() {
        return this.firstValue(source => source.getServiceName())
    }

    getProtocolVersion() {
        return this.firstValue(source => source.getProtocolVersion())
    }

    isContainer() {
        return this.firstValue(source => source.isContainer())
    }

    firstValue(valueOf) {
        for (const source of this.sources) {
            const value = valueOf(source)
            if (value !== undefined) {
                return value
            }
        }
        return undefined
    }
}

class NamesAndIdsEnvironmentVariable {
    getAgentId() {
        return valueOfString('PINPOINT_AGENT_ID')
    }

    getAgentName() {
        return valueOfString('PINPOINT_AGENT_NAME')
    }

    getApplicationName() {
        return valueOfString('PINPOINT_APPLICATION_NAME')
    }

    getServiceName() {
        return valueOfString('PINPOINT_SERVICE_NAME')
    }

    getProtocolVersion() {
        return valueOfString('PINPOINT_COLLECTOR_PROTOCOL_VERSION')
    }

    isContainer() {
        return valueOfBoolean('PINPOINT_CONTAINER')
    }
}

class NamesAndIdsJson {
    constructor(config) {
        this.config = config ?? {}
    }

    getAgentId() {
        return this.config.agentId
    }

    getAgentName() {
        return this.config.agentName
    }

    getApplicationName() {
        return this.config.applicationName
    }

    getServiceName() {
        return this.config.serviceName
    }

    getProtocolVersion() {
        return this.config.collector?.protocolVersion
    }

    isContainer() {
        return this.config.features?.container
    }
}

function isEmpty(value) {
    return value === undefined || value === null || (typeof value === 'string' && value.trim().length === 0)
}

function isV3(protocolVersion) {
    return typeof protocolVersion === 'string' && protocolVersion.trim().toLowerCase() === 'v3'
}

// Java IdValidateUtils and PinpointConstants: AGENT_ID_MAX_LEN 24, AGENT_NAME_MAX_LEN 255, AGENT_NAME_MAX_LEN_V4 254, SERVICE_NAME_MAX_LEN 254
function validateIdField({ label, value, maxLength, required }) {
    const link = 'https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#3-configuration-with-environment-variables'

    if (value !== undefined && value !== null && typeof value !== 'string') {
        return [`${label} must be a string. Value: ${value}. See ${link}`]
    }

    if (!value || value.trim().length === 0) {
        return required ? [`${label} is required. See ${link}`] : []
    }

    const errors = []

    if (value.length > maxLength) {
        errors.push(`${label} is too long (max ${maxLength} characters). See ${link}`)
    }

    if (!/^[a-zA-Z0-9._-]+$/.test(value)) {
        errors.push(`${label} has invalid characters; allowed [a-zA-Z0-9._-]. Value: ${value}. See ${link}`)
    }

    return errors
}

module.exports = {
    NamesAndIdsConfigHandler
}
