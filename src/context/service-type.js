const serviceTypeConstant = require('constant/service-type')
const ServiceTypeProperty = serviceTypeConstant.ServiceTypeProperty

class ServiceType {
  constructor (code, ...properties) {
    this.code = code
    this.name = null
    this.terminal = false
    this.queue = false
    this.recordStatistics = false
    this.includeDestinationId = false

    this.setProperties(properties)
  }

  setProperties (properties = []) {
    properties.forEach(p => {
      switch (p) {
        case ServiceTypeProperty.TERMINAL:
          this.terminal = true
          break
        case ServiceTypeProperty.QUEUE:
          this.queue = true
          break
        case ServiceTypeProperty.RECORD_STATISTICS:
          this.recordStatistics = true
          break
        case ServiceTypeProperty.INCLUDE_DESTINATION_ID:
          this.includeDestinationId = true
          break
      }
    })
  }
}

module.exports = ServiceType
