'use strict'

const ServiceTypeCode = {
  node: 1400,
  node_method: 1401,

  express: 6600,
  koa : 6610,
  hapi: 6620,
  restify: 6630,

  mongodb : 2700,
  redis : 8200,
  ioredis: 8202,    // 임시코드
  elasticsearch: 8203, // 임시코드,
  bluebird: 8204, //임시코드
  mysql: 8205,

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
