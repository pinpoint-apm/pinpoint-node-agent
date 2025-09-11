/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

import { Config } from './config';
import AgentInfo = require('./data/dto/agent-info');

interface TraceObject {
  [key: string]: any;
}

interface TraceContext {
  newTraceObject2(): TraceObject;
  currentTraceObject(): TraceObject | null;
  completeTraceObject(trace: TraceObject): void;
}

interface DataSender {
  send(data: any): void;
  sendSupportedServicesCommand(): void;
  [key: string]: any;
}

interface Agent {
  agentInfo: AgentInfo;
  config: Config;
  dataSender: DataSender;
  traceContext: TraceContext;
  services: Array<() => void>;

  start(): void;
  createTraceObject(): TraceObject;
  currentTraceObject(): TraceObject | null;
  completeTraceObject(trace: TraceObject): void;
  getAgentInfo(): AgentInfo;
  getTraceContext(): TraceContext;
  shutdown(): void;
}

declare class AgentBuilder {
  constructor(agentInfo: AgentInfo);

  setConfig(config: Config): AgentBuilder;
  setDataSender(dataSender: DataSender): AgentBuilder;
  addService(service: () => void): AgentBuilder;
  disableStatsScheduler(): AgentBuilder;
  disablePingScheduler(): AgentBuilder;
  disableServiceCommand(): AgentBuilder;
  build(): Agent;
}

export { Agent, AgentBuilder };
