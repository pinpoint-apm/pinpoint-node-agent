/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const path = require('path')
const fs = require('fs')
const defaultConfig = require('./pinpoint-config-default')
const log = require('./utils/log/logger')
const ServiceConfigBuilder = require('./client/retry/service-config-builder')
const { randomBytes } = require('node:crypto')
const levels = require('loglevel').levels

const valueOfString = (envName) => {
  return () => {
    if (process.env[envName] === undefined) {
      return undefined
    }
    return process.env[envName]
  }
}

const valueOfBoolean = (envName) => {
  return () => {
    if (process.env[envName] === undefined) {
      return undefined
    }
    return process.env[envName] === 'true'
  }
}

const valueOfNumber = (envName) => {
  return () => {
    if (process.env[envName] === undefined) {
      return undefined
    }

    return Number(process.env[envName])
  }
}

const valueOfLoggerLevels = (envName) => {
  return () => {
    const value = process.env[envName]
    if (typeof value !== 'string' || value.trim().length === 0) {
      return undefined
    }

    const loggerLevels = {}
    const pairs = value.split(',')

    const validLevels = Object.keys(levels).map(level => level.toUpperCase())
    for (const pair of pairs) {
      const trimmedPair = pair.trim()
      if (trimmedPair.length === 0) continue

      const equalIndex = trimmedPair.indexOf('=')
      if (equalIndex === -1) continue

      const loggerName = trimmedPair.substring(0, equalIndex).trim()
      const logLevel = trimmedPair.substring(equalIndex + 1).trim().toUpperCase()

      if (loggerName.length === 0 || logLevel.length === 0) continue

      if (validLevels.includes(logLevel)) {
        loggerLevels[loggerName] = logLevel
      }
    }

    return Object.keys(loggerLevels).length > 0 ? loggerLevels : undefined
  }
}

const ENV_MAP = {
  agentId: valueOfString('PINPOINT_AGENT_ID'),
  agentName: valueOfString('PINPOINT_AGENT_NAME'),
  applicationName: valueOfString('PINPOINT_APPLICATION_NAME'),
  serviceType: valueOfNumber('PINPOINT_SERVICE_TYPE'),
  collectorIp: valueOfString('PINPOINT_COLLECTOR_IP'),
  collectorTcpPort: valueOfNumber('PINPOINT_COLLECTOR_TCP_PORT'),
  collectorStatPort: valueOfNumber('PINPOINT_COLLECTOR_STAT_PORT'),
  collectorSpanPort: valueOfNumber('PINPOINT_COLLECTOR_SPAN_PORT'),
  sampling: valueOfBoolean('PINPOINT_SAMPLING'),
  sampleRate: valueOfNumber('PINPOINT_SAMPLING_RATE'),
  logLevel: valueOfString('PINPOINT_LOG_LEVEL'),
  loggerLevels: valueOfLoggerLevels('PINPOINT_LOGGER_LEVELS'),
  enable: valueOfBoolean('PINPOINT_ENABLE'),
  container: valueOfBoolean('PINPOINT_CONTAINER'),
  traceExclusionUrlPatterns: valueOfString('PINPOINT_TRACE_EXCLUSION_URL_PATTERN'),
  traceExclusionUrlCacheSize: valueOfNumber('PINPOINT_TRACE_EXCLUSION_URL_CACHE_SIZE'),
  traceLocationAndFileNameOfCallSite: valueOfBoolean('PINPOINT_TRACE_LOCATION_AND_FILENAME_OF_CALL_SITE'),
  profilerSqlStat: valueOfBoolean('PINPOINT_PROFILER_SQL_STAT'),
  httpStatusCodeErrors: valueOfString('PINPOINT_HTTP_STATUS_CODE_ERRORS'),
}

const CONFIG_FILE_MAP = {
  agentId: 'agent-id',
  agentName: 'agent-name',
  applicationName: 'application-name',
  serviceType: 'application-type',
  collectorIp: 'collector.ip',
  collectorTcpPort: 'collector.tcp-port',
  collectorStatPort: 'collector.stat-port',
  collectorSpanPort: 'collector.span-port',
  sampling: 'sampling.enable',
  sampleRate: 'sampling.rate',
  httpStatusCodeErrors: 'http-status-code.errors',
  logLevel: 'log-level',
  loggerLevels: 'logger-levels',
  enabledDataSending: 'enabled-data-sending',
  enabledStatsMonitor: 'enabled-stats-monitor-sending',
  enabledActiveThreadCount: 'enabled-active-thread-count',
  express: 'express.enable',
  koa: 'koa.enable',
  mongo: 'mongo.enable',
  redis: 'redis.enable',
  enable: 'enable',
  container: 'container',
  traceExclusionUrlPatterns: 'trace-exclusion-url.pattern',
  traceExclusionUrlCacheSize: 'trace-exclusion-url.cache-size',
  streamDeadlineMinutesClientSide: 'stream-deadline-minutes.client-side',
  traceLocationAndFileNameOfCallSite: 'trace-location-and-filename-of-call-site',
  profilerSqlStat: 'profiler-sql-stat',
}

const REQUIRE_CONFIG = {
  agentId: 'an Agent ID',
  applicationName: 'an Application Name'
}

// ref: https://github.com/elastic/apm-agent-nodejs/blob/master/lib/config.js
const ARRAY_CONFIG = [
  'traceExclusionUrlPatterns'
]

const configurationValueValidations = {
  validateTraceExclusionUrlCacheSize: () => {
    if (typeof agentConfig.traceExclusionUrlCacheSize !== 'undefined' && typeof agentConfig.traceExclusionUrlPatterns === 'undefined') {
      delete agentConfig.traceExclusionUrlCacheSize
      log.warn(`You have to set the PINPOINT_TRACE_EXCLUSION_URL_PATTERN, PINPOINT_TRACE_EXCLUSION_URL_CACHE_SIZE or trace-exclusion-url{ pattern: 'pattern', 'cache-size': 100} for using excludsion url cache.`)
    }

    if (Array.isArray(agentConfig.traceExclusionUrlPatterns) && Number.isInteger(agentConfig.traceExclusionUrlCacheSize)) {
      if (agentConfig.traceExclusionUrlCacheSize < 100) {
        agentConfig.traceExclusionUrlCacheSize = 100
      }
    }
  },
  validateIds: () => {
    [{ id: agentConfig.agentId, name: 'Agent ID', maxLength: 24, required: true }
      , { id: agentConfig.applicationName, name: 'Application Name', maxLength: 24, required: true }
      // Java PinpointConstants.AGENT_NAME_MAX_LEN = 255
      , { id: agentConfig.agentName, name: 'Agent Name', maxLength: 255, required: false }
    ].filter(id => id.id)
      .filter(id => {
        if (isNaN(id.maxLength)) {
          return false
        }

        if (id.required && typeof id.id !== 'string') {
          agentConfig.enable = false
          log.warn(`You have to set ${id.name}`)
          return false
        }

        if (id.required === false && typeof id.id !== 'string') {
          return false
        }

        const maxLength = id.maxLength
        const idRegex = /^[a-zA-Z0-9\\._\\-]+$/

        if (id.id.length < 1) {
          agentConfig.enable = false
          log.warn(`You have to set ${id.name}`)
          return false
        }

        if (id.id.length > maxLength) {
          agentConfig.enable = false
          log.warn(`You have to set ${id.name} to less ${maxLength} characters.`)
          return false
        }

        if (!idRegex.test(id.id)) {
          agentConfig.enable = false
          log.warn(`invalidate ${id.name} name with /[a-zA-Z0-9\\._\\-]+/ RegExp`)
          return false
        }
      })
  }
}

const init = (initOptions = {}) => {
  agentConfig = Object.assign({},
    readConfigJson(defaultConfig),
    readConfigJson(readRootConfigFile()),
    readFromEnv(),
    readConfigJson(initOptions))

  Object.entries(REQUIRE_CONFIG).forEach(([propertyName, description]) => {
    if (propertyName === 'agentId' && !agentConfig[propertyName]) {
      return agentConfig.agentId = randomBytes(8).toString('hex')
    }
    if (agentConfig.enable && !agentConfig[propertyName]) {
      agentConfig.enable = false
      log.warn(`You must set ${description}.The Pinpoint Node JS Agent has been shutdown.`)
    }
  })

  if (!ENV_MAP.container() && isContainerEnvironment()) {
    agentConfig.container = true
  }

  for (const [key, validation] of Object.entries(configurationValueValidations)) {
    validation()
  }

  if (typeof initOptions['grpc.service_config'] === 'object') {
    agentConfig.grpcServiceConfig = new ServiceConfigBuilder().setJSON(initOptions['grpc.service_config']).build()
  } else {
    agentConfig.grpcServiceConfig = ServiceConfigBuilder.nullObject.build()
  }
}

const readFromEnv = () => {
  return Object.entries(ENV_MAP).reduce((acc, [key, valueOf]) => {
    const value = valueOf()
    if (typeof value === 'undefined') {
      return acc
    }

    acc[key] = ARRAY_CONFIG.includes(key) ? splitString(value) : value
    return acc
  }, {})
}

const splitString = (value) => {
  if (typeof value !== 'string') {
    return value
  }
  return value.split(',').map(token => token.trim()).filter(token => token.length > 0)
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
  const mainModulePath = getMainModulePath(require)
  if (!mainModulePath) {
    log.warn('If executed with `node - r`, pinpoint-config.json cannot be read because require.main value is undefined.')
    return {}
  }

  const fileFullPath = mainModulePath + '/' + fileName
  if (!fs.existsSync(fileFullPath)) {
    return {}
  }
  return require(fileFullPath)
}

const getMainModulePath = (requireFunction) => {
  if (!requireFunction || !requireFunction.main || !requireFunction.main.filename) {
    return
  }
  return path.dirname(requireFunction.main.filename)
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

const initializeConfig = (initOptions) => {
  clear()
  init(initOptions)
  loadedConfigCallbacks.forEach(callback => {
    try {
      callback.callback(agentConfig[callback.propertyName])
    } catch (e) {
      log.error('Error in loadedConfig callback', e)
    }
  })
}

const clear = () => agentConfig && (agentConfig = null)

//https://github.com/sindresorhus/is-docker
const isContainerEnvironment = () => {
  return hasDockerEnv() || hasDockerCGroup() || (process.env['KUBERNETES_SERVICE_HOST'] && process.env['KUBERNETES_SERVICE_HOST'].length > 0)
}

function hasDockerEnv() {
  try {
    fs.statSync('/.dockerenv')
    return true
  } catch (_) {
    return false
  }
}

function hasDockerCGroup() {
  try {
    return fs.readFileSync('/proc/self/cgroup', 'utf8').includes('docker')
  } catch (_) {
    return false
  }
}

let agentConfig = readConfigJson(defaultConfig)

const loadedConfigCallbacks = []
function registerLoadedConfig(propertyName, callback) {
  if (typeof propertyName !== 'string' || typeof callback !== 'function') {
    return
  }

  loadedConfigCallbacks.push({ propertyName, callback })
}

module.exports = {
  getConfig,
  clear,
  readConfigJson,
  readRootConfigFile,
  getMainModulePath,
  isContainerEnvironment,
  initializeConfig,
  registerLoadedConfig,
}
