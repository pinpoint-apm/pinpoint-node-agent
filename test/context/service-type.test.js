const test = require('tape')

const serviceTypeConstant = require('constant/service-type')
const ServiceTypeProperty = serviceTypeConstant.ServiceTypeProperty

const ServiceType = require('context/service-type')

test('Should create with properties', function (t) {
  t.plan(3)

  const serviceType = new ServiceType(123, ServiceTypeProperty.TERMINAL, ServiceTypeProperty.RECORD_STATISTICS)

  t.equal(serviceType.terminal, true)
  t.equal(serviceType.recordStatistics, true)
  t.equal(serviceType.includeDestinationId, false)
})
