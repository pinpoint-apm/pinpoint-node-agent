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

    getHttpStatusCodeErrors(): unknown
    getGrpcServiceConfig(): unknown
    getSamplingRate(): number
    getExclusionUrl(): { patterns: string[]; cacheSize?: number }
    getCollector(): { ip: string; spanPort: number; statPort: number; tcpPort: number }
    getDeadlineSeconds(): number
    hasSqlStats(): boolean
    isSamplingEnabled(): boolean
    getLogLevels(): Record<string, string>
    isDataSendingEnabled(): boolean
    isStatsMonitoringEnabled(): boolean
    isContainerEnvironment(): boolean
}

export class ConfigBuilder {
    constructor(agentStartupUserDefinedJson?: ConfigInput)

    setDefaultJson(json: ConfigInput): this
    setUserDefinedJson(json: ConfigInput): this
    addHandler(handler: ConfigHandler): this
    build(): Config
}
