/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

import { PinpointConfig } from '../../config';

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

  constructor(config: PinpointConfig, agentStartTime: string);

  static make(config: PinpointConfig): AgentInfo;

  getAgentId(): string;
  getAgentName(): string;
  getAgentStartTime(): string;
  getServiceType(): number;
  getApplicationName(): string;
  getApplicationServiceType(): number;
}

export = AgentInfo;
