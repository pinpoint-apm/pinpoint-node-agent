import type { Config } from '../../config-builder'
import type { DataSender } from '../../types'

export interface UriStatsConfig {
    getUriStatsCapacity(): number
    isUriStatsHttpMethodEnabled(): boolean
    isUriStatsUseUserInput(): boolean
    isUriStatsEnabled(): boolean
}

export declare class UriStatsConfigBuilder {
    constructor(config?: Config)
    build(): UriStatsConfig
}

export declare class SpanRecorderEnricher {
    constructor(config: UriStatsConfig)
    record(moduleName: string, traceRoot: any, ...args: any[]): void
}

export interface UriStatsRepository {
    storeUriStats(traceRoot: any, traceEndTime: number): void
}


export declare class UriStatsRepositoryBuilder {
    static readonly nullObject: UriStatsRepository

    constructor(config: UriStatsConfig)
    build(): UriStatsRepository
}

export declare class UriStatsRepository {
    constructor(capacity?: number, timeWindow?: number, config?: UriStatsConfig)
    storeUriStats(traceRoot: any, traceEndTime: number): void
    poll(): any
    getTimeWindow(): number
}

export declare class TraceCompletionEnricher {
    constructor(repository: UriStatsRepository)
    onComplete(trace: any, traceCloseTime: number): void
}

export declare class UriStatsMonitor {
    constructor(dataSender: DataSender, uriStatsRepository: UriStatsRepository)
    start(): void
    stop(): void
}
