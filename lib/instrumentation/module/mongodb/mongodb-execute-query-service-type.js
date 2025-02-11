/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { ServiceTypeProperty } = require('../../../constant/service-type')
const ServiceType = require('../../../context/service-type')

module.exports = new ServiceType(2651, 'MONGO_EXECUTE_QUERY', ServiceTypeProperty.TERMINAL, ServiceTypeProperty.RECORD_STATISTICS)