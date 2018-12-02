// TODO 코드 확인 후 추가
const ServiceTypeCode = {
  express: 1000,
  koa : 5200,
  mongodb : 2700,
  redis : 8200,
}

const ServiceTypeProperty = {
  TERMINAL: 'TERMINAL',
  QUEUE: 'QUEUE',
  RECORD_STATISTICS: 'RECORD_STATISTICS',
  INCLUDE_DESTINATION_ID: 'INCLUDE_DESTINATION_ID',
}

module.exports = {
  ServiceTypeCode,
  ServiceTypeProperty
}
