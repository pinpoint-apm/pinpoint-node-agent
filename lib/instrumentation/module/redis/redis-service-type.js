/**
 * Pinpoint Node.js Agent
 * Copyright 2023-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'
const ServiceType = require('../../../context/service-type')
const { ServiceTypeProperty } = require('../../../constant/service-type')

module.exports = new ServiceType(8200, 'REDIS', ServiceTypeProperty.TERMINAL, ServiceTypeProperty.INCLUDE_DESTINATION_ID)