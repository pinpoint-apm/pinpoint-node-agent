'use strict'

const Int64BE = require("int64-buffer").Int64BE;

class TypedBuffer {
  constructor(buffer, size) {
    this.buffer = null
    this.offset = 0
  }

  static alloc (size) {
    const typedBuffer = new TypedBuffer()
    typedBuffer.buffer = Buffer.alloc(size)
    return typedBuffer
  }

  static from (buffer) {
    const typedBuffer = new TypedBuffer()
    typedBuffer.buffer = Buffer.from(buffer)
    return typedBuffer
  }

  trim () {
    if (this.buffer.length > (this.offset + 1)) {
      this.buffer = this.buffer.slice(0, this.offset)
      return this.buffer
    }
    return this.buffer
  }

  writeByte (value) {
    if (this.buffer && value !== undefined) {
      this.buffer.writeInt8(value, this.offset)
      this.offset += 1
    }
  }

  writeShort (value) {
    if (this.buffer && value !== undefined) {
      this.buffer.writeInt16BE(value, this.offset)
      this.offset += 2
    }
  }

  writeInt (value) {
    if (this.buffer && value !== undefined) {
      this.buffer.writeInt32BE(value, this.offset)
      this.offset += 4
    }
  }

  writeLong (value) {
    const byteArray = new Int64BE(value).toArray()
    byteArray.forEach(byte => {
      this.buffer.writeUInt8(byte, this.offset)
      this.offset += 1
    })
  }

  writeString (value) {
    if (this.buffer && value !== undefined) {
      this.offset += this.buffer.write(value, this.offset)
    }
  }

  writeChar (value) {
    if (this.buffer && value !== undefined) {
      this.writeByte(value.charCodeAt())
    }
  }

  readByte () {
    if (this.buffer) {
      const value = this.buffer.readInt8(this.offset)
      this.offset += 1
      return value
    }
  }

  readShort () {
    if (this.buffer) {
      const value = this.buffer.readInt16BE(this.offset)
      this.offset += 2
      return value
    }
  }

  readInt () {
    if (this.buffer) {
      const value = this.buffer.readInt32BE(this.offset)
      this.offset += 4
      return value
    }
  }

  readBytes (length) {
    if (this.buffer) {
      const lastOffset = Math.min(this.offset + length, this.buffer.length - 1)
      const buffer = this.buffer.slice(this.offset, lastOffset)
      this.offset += (lastOffset - this.offset)
      return buffer
    }
  }
}

module.exports = TypedBuffer
