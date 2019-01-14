'use strict'

const defaultConfig = require('./pinpoint-config-default')

const ENV_MAP = {
  agentId: 'PINPOINT_AGENT_ID',
  applicationName: 'PINPOINT_APPLICATION_NAME',
  serviceType: 'PINPOINT_SERVICE_TYPE',
  collectorIp: 'PINPOINT_COLLECTOR_IP',
  collectorTcpPort: 'PINPOINT_COLLECTOR_TCP_PORT',
  collectorStatPort: 'PINPOINT_COLLECTOR_STAT_PORT',
  collectorSpanPort: 'PINPOINT_COLLECTOR_SPAN_PORT',
}

const CONFIG_FILE_MAP = {
  agentId: 'agent-id',
  applicationName: 'application-name',
  serviceType: 'application-type',
  collectorIp: 'collector.ip',
  collectorTcpPort: 'collector.tcp-port',
  collectorStatPort: 'collector.stat-port',
  collectorSpanPort: 'collector.span-port',
  sampling: 'sampling.enable',
  sampleRate: 'sampling.rate',
  httpStatusCodeErrors: 'http-status-code-errors',
  logLevel: 'log-level',
  express: 'express.enable',
  koa: 'koa.enable',
  mongo: 'mongo.enable',
  redis: 'redis.enable',
}

let conf = null

const init = (agentConfig = {}) => {
  conf = Object.assign({},
      readConfigJson(defaultConfig),
      readFromEnv(),
      readConfigJson(agentConfig))
}

const readFromEnv = () => {
  return Object.entries(ENV_MAP).reduce((acc, [key, envName]) => {
    if (process.env[envName]) {
      acc[key] = process.env[envName]
    }
    return acc
  }, {})
}

const readConfigJson = (formattedConfig) => {
  return Object.entries(CONFIG_FILE_MAP).reduce((acc, [key, propName]) => {
    const value = getValue(propName, formattedConfig)
    if (value) {
      acc[key] = value
    }
    return acc
  }, {})
}

const getValue = (key, configFile) => {
  if (key) {
    return key.split('.').reduce((object, prop) => object && object[prop], configFile)
  }
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
 clear,
 readConfigJson
}
