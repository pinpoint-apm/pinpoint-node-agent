'use strict'

const path = require('path')
const fs = require('fs')
const defaultConfig = require('./pinpoint-config-default')

const ROOT_PATH = path.dirname(require.main.filename || process.mainModule.filename)

const ENV_MAP = {
  agentId: valueOfString('PINPOINT_AGENT_ID'),
  applicationName: valueOfString('PINPOINT_APPLICATION_NAME'),
  serviceType: valueOfNumber('PINPOINT_SERVICE_TYPE'),
  collectorIp: valueOfString('PINPOINT_COLLECTOR_IP'),
  collectorTcpPort: valueOfNumber('PINPOINT_COLLECTOR_TCP_PORT'),
  collectorStatPort: valueOfNumber('PINPOINT_COLLECTOR_STAT_PORT'),
  collectorSpanPort: valueOfNumber('PINPOINT_COLLECTOR_SPAN_PORT'),
  sampling: valueOfBoolean('PINPOINT_SAMPLING'),
  sampleRate: valueOfNumber('PINPOINT_SAMPLING_RATE'),
  logLevel: valueOfString('PINPOINT_LOG_LEVEL'),
  enable: valueOfBoolean('PINPOINT_ENABLE'),
  container: valueOfBoolean('PINPOINT_CONTAINER'),
}

const valueOfString = (envName) => {
  return () => {
    if (process.env[envName]) {
      return process.env[envName]
    } else {
      return undefined
    }
  }
}

const valueOfBoolean = (envName) => {
  return () => {
    if (process.env[envName]) {
      return process.env[envName] === 'true'
    } else {
      return undefined
    }
  }
}

const valueOfNumber = (envName) => {
  return () => {
    if (process.env[envName]) {
      return Number(process.env[envName])
    } else {
      return undefined
    }
  }
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
  container: 'container',
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
  return Object.entries(ENV_MAP).reduce((acc, [key, valueOf]) => {
    const value = valueOf()
    if (value) {
      acc[key] = value
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
