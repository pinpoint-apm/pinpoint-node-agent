'use strict'

const appendPayload = (header, payload) => {
  if (payload === null) {
    header.writeInt(-1)
    return header.buffer
  } else {
    header.writeInt(payload.length)
    return Buffer.concat([header.buffer, payload])
  }
}

const readPayload = (buffer) => {
  const length = buffer.readInt()
  if (!length) {
    return null
  }
  return buffer.readBytes(length)
}

module.exports = {
  appendPayload,
  readPayload,
}
