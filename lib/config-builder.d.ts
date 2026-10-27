/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

export type ConfigInput = Record<string, unknown>

export interface ConfigHandler {
    handle(config: ConfigInput): ConfigInput | void
}

export class Config {
    constructor(config: ConfigInput)

    messages?: { warns?: string[]; errors?: string[] }

    getHttpStatusCodeErrors(): unknown
    getGrpcServiceConfig(): unknown
    getSamplingRate(): number
    getExclusionUrl(): { patterns: string[]; cacheSize?: number }
    getCollector(): { ip: string; spanPort: number; statPort: number; tcpPort: number }
    getSpanBatch(): { size: number; deadlineMillis: number; maxRequests: number }
    getDeadlineSeconds(): number
    isSamplingEnabled(): boolean
    getLogLevels(): Record<string, string>
    isDataSendingEnabled(): boolean
    isStatsMonitoringEnabled(): boolean
    isGcStatsEnabled(): boolean
    isFileDescriptorStatsEnabled(): boolean
    isContainerEnvironment(): boolean
    getAgentId(): string
    getAgentName(): string
    getApplicationName(): string
    getServiceName(): string | undefined
    getProtocolVersion(): 'v3' | 'v4'
}

export class ConfigBuilder {
    constructor(agentStartupUserDefinedJson?: ConfigInput)

    setDefaultJson(json: ConfigInput): this
    setUserDefinedJson(json: ConfigInput): this
    build(): Config
}
