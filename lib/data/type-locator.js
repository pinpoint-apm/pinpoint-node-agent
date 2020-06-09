'use strict'

const Header = require('./header').Header
const pinpointTypes = require('./thrift/Pinpoint_types')
const traceTypes = require('./thrift/Trace_types')
const commandTypes = require('./thrift/Command_types')

const TypeCode = {
  SPAN: 40,
  AGENT_INFO: 50,
  AGENT_STAT: 55,
  SPAN_CHUNK: 70,
  API_META_DATA: 310,
  STRING_META_DATA: 330,
  ACTIVE_THREAD_COUNT_RES: 731,
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
  if (tBase instanceof pinpointTypes.TAgentStat) {
    return headerMap[TypeCode.AGENT_STAT]
  }
  if (tBase instanceof traceTypes.TSpanChunk) {
    return headerMap[TypeCode.SPAN_CHUNK]
  }
  if (tBase instanceof traceTypes.TApiMetaData) {
    return headerMap[TypeCode.API_META_DATA]
  }
  if (tBase instanceof traceTypes.TStringMetaData) {
    return headerMap[TypeCode.STRING_META_DATA]
  }
  if (tBase instanceof commandTypes.TCmdActiveThreadCountRes) {
    return headerMap[TypeCode.ACTIVE_THREAD_COUNT_RES]
  }
  return null
}

module.exports = {
  TypeCode,
  headerLookup,
}
