const test = require('tape')

const ServiceType = require('context/service-type')
const serviceTypeConstant = require('constant/service-type')
const ServiceTypeProperty = serviceTypeConstant.ServiceTypeProperty

test('Should create with properties', function (t) {
  t.plan(3)

  const properties = [ServiceTypeProperty.TERMINAL, ServiceTypeProperty.RECORD_STATISTICS]
  const serviceType = new ServiceType(123, properties)

  t.equal(serviceType.terminal, true)
  t.equal(serviceType.recordStatistics, true)
  t.equal(serviceType.includeDestinationId, false)
})
