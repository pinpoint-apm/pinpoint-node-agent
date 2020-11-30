/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const intToZigZag = (n) => {
  return (n << 1) ^ (n >> 31);
}

const writeVar64Size = (value, buffer, offset, size) => {
  const binary = value.toString(2)

  for (let i = 1; i <= size; i++) {
    const startIndex = Math.max(binary.length - (i * 7), 0)
    const endIndex = binary.length - ((i - 1) * 7)
    const byteValue = binary.substring(startIndex, endIndex)
    const intValue = parseInt(byteValue, 2)
    if (i === size) {
      offset = buffer.writeUInt8(intValue, offset);
    } else {
      offset = buffer.writeUInt8((intValue & 0x7F) | 0x80, offset)
    }
  }
  return offset
}

module.exports = {
  intToZigZag,
  writeVar64Size,
}
