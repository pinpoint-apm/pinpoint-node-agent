'use strict'

const intToZigZag = (n) => {
  return (n << 1) ^ (n >> 31);
}

const computeVar32Size = (value) => {
  const var32 = parseInt('0xffffffff', 16)
  if ((value & (var32 <<  7)) === 0) return 1
  if ((value & (var32 << 14)) === 0) return 2
  if ((value & (var32 << 21)) === 0) return 3
  if ((value & (var32 << 28)) === 0) return 4
  return 5
}

// Javascript does not support 64bit number type
// Input must be less than Number.MAX_SAFE_INTEGER
const computeVar64Size = (value) => {
  if (value > Number.MAX_SAFE_INTEGER) return -1
  const biNumber = Number(value).toString(2)
  return Math.ceil(biNumber.length / 7)
}

const writeVar64Size = (value, buffer, offset, size) => {
  let binary = value.toString(2)
  if (binary.length % 7 > 0) {
    binary = binary.padStart(7 * Math.ceil(binary.length / 7 ), '0')
  }

  for (let i = size - 1; i >= 0; i--) {
    const byteValue = binary.substr(i * 7, 7)
    const intValue = parseInt(byteValue, 2)
    offset = buffer.writeUInt8((intValue & 0x7F) | 0x80, offset)
  }
  return offset
}

module.exports = {
  intToZigZag,
  computeVar32Size,
  computeVar64Size,
  writeVar64Size,
}
