'use strict'

const encodeMethodName = (methodName) => methodName
  .replace('<', '[')
  .replace('>', ']')

module.exports = {
  encodeMethodName
}
