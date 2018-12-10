'use strict'

//fixme
const appendPayload = (header, payload, offset) => {
  if (payload === null) {
    header.writeInt32BE(-1)
    return header
  } else {
    header.writeInt32BE(payload.length, offset)
    return Buffer.concat([header, payload])
  }
}

//fixme
const readPayload = (buffer) => {
  const length = buffer.readInt()
  if (length) {
    return buffer.readByte(length)
  }
  return new Buffer()
}

module.exports = {
  appendPayload,
  readPayload,
}
