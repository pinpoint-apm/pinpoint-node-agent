'use strict'

const thrift = require('thrift');
const TCompactProtocol = thrift.TCompactProtocol
const TFramedTransport = thrift.TFramedTransport
const TypedBuffer = require('../utils/typed-buffer')
const PacketType = require('../client/packet/packet-type').PacketType
const StreamCreatePacket = require('../client/packet/stream-create-packet')
const StreamCreateSuccessPacket = require('../client/packet/stream-create-success-packet')
const StreamCreateFailPacket = require('../client/packet/stream-create-fail-packet')
const StreamResponsePacket = require('../client/packet/stream-response-packet')
const StreamClosePacket= require('../client/packet/stream-close-packet')
const log = require('../utils/logger')

const headerLookup = require('./type-locator').headerLookup

const serialize = (tData) => {
  const header = headerLookup(tData)
  if (!header) {
    log.error('Can not found header of data', tData)
    return null
  }

  const transport = new TFramedTransport()
  const protocol = new TCompactProtocol(transport)
  tData.write(protocol)
  return Buffer.concat([writeHeader(header), Buffer.concat(transport.outBuffers)])
}

const writeHeader = (header) => {
  if (header) {
    const buffer = Buffer.alloc(4)
    buffer.writeInt8(header.signature, 0)
    buffer.writeInt8(header.version, 1)
    buffer.writeUInt16BE(header.type, 2)
    return buffer
  }
}

const deserialize = (data) => {
  if (data) {
    const buffer = TypedBuffer.from(data)
    const packetType = buffer.readShort()
    log.info('[TCP] deserialize packet type', packetType)
    switch (packetType) {
      case PacketType.APPLICATION_STREAM_CREATE:
        return StreamCreatePacket.readBuffer(buffer)
      case PacketType.APPLICATION_STREAM_CREATE_SUCCESS:
        return StreamCreateSuccessPacket.readBuffer(buffer)
      case PacketType.APPLICATION_STREAM_CREATE_FAIL:
        return StreamCreateFailPacket.readBuffer(buffer)
      case PacketType.APPLICATION_STREAM_CLOSE:
        return StreamClosePacket.readBuffer(buffer)
      case PacketType.APPLICATION_STREAM_RESPONSE:
        return StreamResponsePacket.readBuffer(buffer)
      default:
        return null
    }
  }
}

module.exports = {
  serialize,
  deserialize
}
