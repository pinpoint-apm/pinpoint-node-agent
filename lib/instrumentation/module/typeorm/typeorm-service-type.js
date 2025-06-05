/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const ServiceType = require('../../../context/service-type')
const { ServiceTypeProperty } = require('../../../constant/service-type')

module.exports = new ServiceType(5600, "TYPEORM", ServiceTypeProperty.TERMINAL, ServiceTypeProperty.INCLUDE_DESTINATION_ID) 