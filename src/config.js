const ENV_MAP = {
  agentId: 'PINPOINT_AGENT_ID',
  applicationName: 'PINPOINT_APPLICATION_NAME',
  serviceType: 'PINPOINT_SERVICE_TYPE',
  collectorIp: 'PINPOINT_COLLECTOR_IP',
  collectorTcpPort: 'PINPOINT_COLLECTOR_TCP_PORT',
  collectorStatPort: 'PINPOINT_COLLECTOR_STAT_PORT',
  collectorSpanPort: 'PINPOINT_COLLECTOR_SPAN_PORT',
}

const initialConf = {
  agentId: null,
  applicationName: null,
  serviceType: null,
  collectorIp: null,
  collectorTcpPort: null,
  collectorStatPort: null,
  collectorSpanPort: null,

  enabledDataSending: true,
}

let conf = null

const init = (agentConfig = {}) => {
  conf = Object.assign({},
      initialConf,
      readEnv(),
      agentConfig)
  console.log('config', conf)
}

const readEnv = () => {
  return Object.entries(ENV_MAP).reduce((acc, [key, value]) => {
    if (process.env[value]) {
      acc[key] = process.env[value]
    }
    return acc
  }, {})
}

const get = (agentConfig) => {
  if (!conf) {
    init(agentConfig)
  }
  return conf
}

const clear = () => conf && (conf = null)

module.exports = {
 get,
 clear
}