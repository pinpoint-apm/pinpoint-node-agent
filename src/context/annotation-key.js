const AnnotationKeyProperty = require('constant/annotation').AnnotationKeyProperty

class AnnotationKey {
  constructor (name, code, ...properties) {
    this.name = name
    this.code = code
    this.viewInRecordSet = false
    this.errorApiMetadata = false

    this.setProperties(properties)
  }

  setProperties (properties = []) {
    properties.forEach(p => {
      switch (p) {
        case AnnotationKeyProperty.VIEW_IN_RECORD_SET:
          this.viewInRecordSet = true
          break
        case AnnotationKeyProperty.ERROR_API_METADATA:
          this.errorApiMetadata = true
          break
      }
    })
  }
}

module.exports = AnnotationKey
