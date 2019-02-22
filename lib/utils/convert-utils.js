'use strict'

const convertStringStringValue = (value1, value2) => {
  return {
    stringValue1: value1 ? JSON.stringify(value1) : null,
    stringValue2: value2 ? JSON.stringify(value2) : null,
  }
}

module.exports = {
  convertStringStringValue
}
