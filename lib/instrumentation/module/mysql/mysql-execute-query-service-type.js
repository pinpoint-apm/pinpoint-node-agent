/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const ServiceType = require('../../../context/service-type')
const { ServiceTypeProperty } = require('../../../constant/service-type')

module.exports = new ServiceType(2101, "MYSQL_EXECUTE_QUERY", ServiceTypeProperty.TERMINAL, ServiceTypeProperty.RECORD_STATISTICS, ServiceTypeProperty.INCLUDE_DESTINATION_ID)