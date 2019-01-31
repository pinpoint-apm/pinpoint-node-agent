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

const readPayload = (header) => {
  const length = header.readInt()
  if (!length) {
    return null
  }
  return header.readBytes(length)
}

module.exports = {
  appendPayload,
  readPayload,
}
