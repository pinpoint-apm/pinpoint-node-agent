/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

export interface LoggerLevels {
  [loggerName: string]: string;
}

export interface Config {
  enable: boolean;
  agentId: string;
  agentName?: string;
  applicationName: string;
  serviceType: number;
  container: boolean;
  collectorIp: string;
  collectorTcpPort: number;
  collectorStatPort: number;
  collectorSpanPort: number;
  sampling: boolean;
  sampleRate: number;
  logLevel: string;
  loggerLevels?: LoggerLevels;
  enabledDataSending?: boolean;
  enabledStatsMonitor: boolean;
  enabledActiveThreadCount?: boolean;
  express?: boolean;
  koa?: boolean;
  mongo?: boolean;
  redis?: boolean;
  traceExclusionUrlPatterns?: string[];
  traceExclusionUrlCacheSize?: number;
  streamDeadlineMinutesClientSide?: number;
  traceLocationAndFileNameOfCallSite?: boolean;
  profilerSqlStat?: boolean;
  httpStatusCodeErrors?: string;
  grpcServiceConfig?: { [key: string]: any };
  [key: string]: any;
}

export declare class ConfigBuilder {
  constructor(agentStartupUserDefinedJson?: { [key: string]: any });
  setDefaultJson(json: { [key: string]: any }): ConfigBuilder;
  setUserDefinedJson(json: { [key: string]: any }): ConfigBuilder;
  build(): Config;
}

export declare function getConfig(initOptions?: { [key: string]: any }): Config;
export declare function setConfig(config: Config): void;
export declare function clear(): void;
export declare function isContainerEnvironment(): boolean;
