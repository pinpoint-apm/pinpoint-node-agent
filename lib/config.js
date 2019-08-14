'use strict'

const path = require('path')
const fs = require('fs')
const defaultConfig = require('./pinpoint-config-default')

const ROOT_PATH = path.dirname(require.main.filename || process.mainModule.filename)

const ENV_MAP = {
  agentId: 'PINPOINT_AGENT_ID',
  applicationName: 'PINPOINT_APPLICATION_NAME',
  serviceType: 'PINPOINT_SERVICE_TYPE',
  collectorIp: 'PINPOINT_COLLECTOR_IP',
  collectorTcpPort: 'PINPOINT_COLLECTOR_TCP_PORT',
  collectorStatPort: 'PINPOINT_COLLECTOR_STAT_PORT',
  collectorSpanPort: 'PINPOINT_COLLECTOR_SPAN_PORT',
  sampling: 'PINPOINT_SAMPLING',
  sampleRate: 'PINPOINT_SAMPLING_RATE',
  logLevel: 'PINPOINT_LOG_LEVEL',
  enable: 'PINPOINT_ENABLE',
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
  enabledDataSending: 'enabled-data-sending',
  enabledStatsMonitor: 'enabled-stats-monitor-sending',
  enabledActiveThreadCount: 'enabled-active-thread-count',
  express: 'express.enable',
  koa: 'koa.enable',
  mongo: 'mongo.enable',
  redis: 'redis.enable',
  enable: 'enable',
}

let agentConfig = null

const init = (initOptions = {}) => {
  agentConfig = Object.assign({},
      readConfigJson(defaultConfig),
      readConfigJson(readRootConfigFile()),
      readFromEnv(),
      readConfigJson(initOptions))
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
    if (value !== undefined) {
      acc[key] = value
    }
    return acc
  }, {})
}

const readRootConfigFile = () => {
  const fileName = 'pinpoint-config.json'
  const fileFullPath = ROOT_PATH + '/' + fileName
  if (fs.existsSync(fileFullPath)) {
    return require(fileFullPath)
  }
  return {}
}

const getValue = (key, configFile) => {
  if (key) {
    return key.split('.').reduce((object, prop) => object && object[prop], configFile)
  }
}

const getConfig = (initOptions) => {
  if (!agentConfig) {
    init(initOptions)
  }
  return agentConfig
}

const clear = () => agentConfig && (agentConfig = null)

module.exports = {
 getConfig,
 clear,
 readConfigJson
}
