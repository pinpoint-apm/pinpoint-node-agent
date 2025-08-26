/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

export interface LoggerLevels {
  [loggerName: string]: string;
}

export interface PinpointConfig {
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

export declare function getConfig(initOptions?: { [key: string]: any }): PinpointConfig;
export declare function clear(): void;
export declare function readConfigJson(formattedConfig: any): Partial<PinpointConfig>;
export declare function readRootConfigFile(): { [key: string]: any };
export declare function getMainModulePath(requireFunction: NodeRequire): string | undefined;
export declare function isContainerEnvironment(): boolean;
export declare function initializeConfig(initOptions?: { [key: string]: any }): void;
export declare function registerLoadedConfig(propertyName: string, callback: (value: any) => void): void;
