declare module 'pinpoint-node-agent' {
  function PinpointNodeAgent(options?: ConfigOption): Agent

  interface ConfigOption {
    /** Agent Id (uniq) */
    agentId?: string,
    /** Application Name */
    applicationName?: string,
    serviceType?: number,
    /** Collector Sevice IP or Hostname */
    collectorIp?: string,
    collectorTcpPort?: number,
    collectorStatPort?: number,
    collectorSpanPort?: number,
    sampling?: boolean,
    sampleRate?: number,
    httpStatusCodeErrors?: string[],
    logLevel?: string,
    enabledDataSending?: boolean,
    enabledStatsMonitor?: boolean,
    enabledActiveThreadCount?: boolean,
    express?: boolean,
    koa?: boolean,
    mongo?: boolean,
    redis?: boolean,
    enable?: boolean,
    container?: string,
  }

  interface Agent {}
}

export default PinpointNodeAgent;