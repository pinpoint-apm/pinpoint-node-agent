const test = require('tape')
const { log, fixture, util } = require('../test-helper')

const serviceTypeConstant = require('../../lib/constant/service-type')
const ServiceTypeProperty = serviceTypeConstant.ServiceTypeProperty

const ServiceType = require('../../lib/context/service-type')

test('Should create with properties', function (t) {
  t.plan(3)

  const serviceType = new ServiceType(123, ServiceTypeProperty.TERMINAL, ServiceTypeProperty.RECORD_STATISTICS)

  t.equal(serviceType.terminal, true)
  t.equal(serviceType.recordStatistics, true)
  t.equal(serviceType.includeDestinationId, false)
})
