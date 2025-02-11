/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { ServiceTypeProperty } = require('../../../constant/service-type')
const ServiceType = require('../../../context/service-type')

module.exports = new ServiceType(2650, 'MONGO', ServiceTypeProperty.TERMINAL, ServiceTypeProperty.INCLUDE_DESTINATION_ID)