const ENV_MAP = {
  agentId: 'PINPOINT_AGENT_ID',
  applicationName: 'PINPOINT_APPLICATION_NAME',
  serviceType: 'PINPOINT_SERVICE_TYPE',
}

const initialConf = {
  agentId: null,
  applicationName: null,
  serviceType: null,
}

let conf = null

const init = (argumentConf = {}) => {
  conf = Object.assign({},
      initialConf,
      readEnv(),
      argumentConf)
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

const get = (argumentConf) => {
  if (!conf) {
    init(argumentConf)
  }
  return conf
}

const clear = () => conf && (conf = null)

module.exports = {
 get,
 clear
}