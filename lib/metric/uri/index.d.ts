export interface UriStatsConfig {
    enabled?: boolean
    httpMethod?: boolean
    capacity?: number
    timeWindow?: number
    useUserInput?: boolean

    isUriStatsExplicitlyEnabled(): boolean
    isUriStatsExplicitlyDisabled(): boolean
    getUriStatsCapacity(): number
    isUriStatsHttpMethodEnabled(): boolean
    isUriStatsUseUserInput(): boolean
    isUriStatsEnabled(): boolean
}

export declare class UriStatsConfigBuilder {
    constructor(config?: Record<string, unknown>)
    build(): UriStatsConfig
}

export declare class SpanRecorderEnricher {
    constructor(config: UriStatsConfig)
    record(moduleName: string, traceRoot: any, ...args: any[]): void
}

export declare class UriStatsRepositoryBuilder {
    static readonly nullObject: {
        storeUriStats(...args: any[]): void
        poll(): any
    }

    constructor(config: UriStatsConfig)
    build(): {
        storeUriStats(traceRoot: any, traceEndTime: number): void
        poll(): any
        getTimeWindow?(): number
    }
}

export declare class TraceCompletionEnricher {
    constructor(repository: { storeUriStats(traceRoot: any, traceEndTime: number): void })
    onComplete(trace: any, traceCloseTime: number): void
}

export declare class UriStatsMonitor {
    constructor(dataSender: { send(data: any): void }, uriStatsRepository: { poll(): any; getTimeWindow(): number })
    start(): void
    run(): void
    stop(): void
}
