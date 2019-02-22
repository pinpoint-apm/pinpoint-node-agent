'use strict'

const thrift = require('thrift');
const TCompactProtocol = thrift.TCompactProtocol
const TFramedTransport = thrift.TFramedTransport
const TypedBuffer = require('../utils/typed-buffer')
const pinpointClient = require('../client/pinpoint-client')
const PacketType = require('../client/packet/packet-type').PacketType

const headerLookup = require('./type-locator').headerLookup

const serialize = (tData) => {
  const header = headerLookup(tData)
  if (!header) {
    throw new Error()
  }

  const transport = new TFramedTransport()
  const protocol = new TCompactProtocol(transport)
  tData.write(protocol)
  return Buffer.concat([writeHeader(header), Buffer.concat(transport.outBuffers)])
}

const writeHeader = (header) => {
  const buffer = new Buffer(4)
  buffer.writeInt8(header.signature, 0)
  buffer.writeInt8(header.version, 1)
  buffer.writeUInt16BE(header.type, 2)
  return buffer
}

// TODO
const deserialize = (data) => {
  const buffer = TypedBuffer.from(data)
  const packetType = buffer.readShort()

  console.log('[TCP] deserialize packet type', TypedBuffer.from(data).readShort())
}

module.exports = {
  serialize,
  deserialize
}
