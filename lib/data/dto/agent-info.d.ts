/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

import type { Config } from '../../config-builder';

declare class AgentInfo {
  agentId: string;
  agentName: string;
  applicationName: string;
  serviceType: number;
  applicationServiceType: number;
  container: boolean;
  agentStartTime: string;
  agentVersion: string;
  hostname: string;
  ip: string;
  pid: number;
  ports: string;
  vmVersion: string;

  constructor(config: Config, agentStartTime: string);

  getAgentId(): string;
  getAgentName(): string;
  getAgentStartTime(): string;
  getServiceType(): number;
  getApplicationName(): string;
  getApplicationServiceType(): number;
}

export = AgentInfo;
