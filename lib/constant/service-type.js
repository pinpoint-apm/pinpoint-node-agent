'use strict'

// TODO 코드 확인 후 추가
const ServiceTypeCode = {
  express: 1000,
  koa : 5200,
  mongodb : 2700,
  redis : 8200,
  ioredis: 8201,    // 임시코드
  elasticsearch: 8203, // 임시코드

  ASYNC_HTTP_CLIENT : 9056,
  ASYNC_HTTP_CLIENT_INTERNAL: 9057,

  callback_dummy: 99999,
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
