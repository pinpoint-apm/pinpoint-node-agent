/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

import { Config } from './config-builder';
import type { Logging } from './utils/log/types';
import type { DataSender } from './types';

interface TraceObject {
  [key: string]: any;
}

interface TraceContext {
  newTraceObject(): TraceObject;
  currentTraceObject(): TraceObject | null;
  completeTraceObject(trace: TraceObject): void;
}

interface AgentService {
  shutdown(): void;
}

type ServiceHandler = (dataSender: DataSender) => void | AgentService;

interface Agent {
  agentStartTime: string;
  config: Config;
  dataSender: DataSender;
  traceContext: TraceContext;
  services: Array<ServiceHandler>;

  start(): void;
  createTraceObject(): TraceObject;
  currentTraceObject(): TraceObject | null;
  completeTraceObject(trace: TraceObject): void;
  getConfig(): Config;
  getTraceContext(): TraceContext;
  shutdown(): void;
}

declare class AgentBuilder {
  constructor(config: Config);

  setDataSender(dataSender: DataSender): AgentBuilder;
  setLogger(logger: Logging): AgentBuilder;
  addService(service: ServiceHandler): AgentBuilder;
  addEnricher(enricher: any): AgentBuilder;
  setSpanRecorderFactory(spanRecorderFactory: any): AgentBuilder;
  setParsingResultFactory(parsingResultFactory: any): AgentBuilder;
  disableStatsScheduler(): AgentBuilder;
  disablePingScheduler(): AgentBuilder;
  disableServiceCommand(): AgentBuilder;
  build(): Agent;
}

export { Agent, AgentBuilder };
