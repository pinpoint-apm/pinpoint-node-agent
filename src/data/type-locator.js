'use strict'

const Header = require('./header').Header
const pinpointTypes = require('data/dto/Pinpoint_types')
const traceTypes = require('data/dto/Trace_types')

const TypeCode = {
  SPAN: 40,
  AGENT_INFO: 50,
  API_META_DATA: 310,
  STRING_META_DATA: 330,
}

const headerMap = Object.keys(TypeCode).reduce((acc, type) => {
  acc[TypeCode[type]] = new Header(TypeCode[type])
  return acc
}, {})

const headerLookup = (tBase) => {
  if (tBase instanceof traceTypes.TSpan) {
    return headerMap[TypeCode.SPAN]
  }
  if (tBase instanceof pinpointTypes.TAgentInfo) {
    return headerMap[TypeCode.AGENT_INFO]
  }
  if (tBase instanceof traceTypes.TApiMetaData) {
    return headerMap[TypeCode.API_META_DATA]
  }
  if (tBase instanceof traceTypes.TStringMetaData) {
    return headerMap[TypeCode.STRING_META_DATA]
  }
  return null
}

module.exports = {
  TypeCode,
  headerLookup,
}
