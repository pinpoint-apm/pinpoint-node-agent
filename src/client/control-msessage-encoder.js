'use strict'

const TypedBuffer = require('../utils/typed-buffer')

const ControlMessageProtocol = {
  TYPE_CHARACTER_NULL : 'N',
  TYPE_CHARACTER_BOOL_TRUE : 'T',
  TYPE_CHARACTER_BOOL_FALSE : 'F',
  TYPE_CHARACTER_INT : 'I',
  TYPE_CHARACTER_LONG : 'L',
  TYPE_CHARACTER_DOUBLE : 'D',
  TYPE_CHARACTER_STRING : 'S',
  CONTROL_CHARACTER_LIST_START : 'V',
  CONTROL_CHARACTER_LIST_END : 'z',
  CONTROL_CHARACTER_MAP_START : 'M',
  CONTROL_CHARACTER_MAP_END : 'z',
}

const encode = (message) => {
  if (!message) {
    return null
  }
  if (typeof message === 'object') {
    return encodeObject(message)
  }
}

const encodeObject = (message) => {
  const buffer = TypedBuffer.alloc(512)
  write(message, buffer)
  return buffer.trim()
}

const write = (value, buffer) => {
  switch (typeof value) {
    case 'boolean':
      return writeBoolean(value, buffer)
    case 'number':
      if (value > 0xffffff) {
        return writeLong(value, buffer)
      }
      return writeInt(value, buffer)
    case 'string':
      return writeString(value, buffer)
    case 'object':
      if (value === null) {
        return writeString('', buffer)
      }
      if (Array.isArray(value)) {
        return writeArray(value, buffer)
      }
      return writeObject(value, buffer)
    default:
      return writeString('', buffer)
  }
}

const writeObject = (value, buffer) => {
  buffer.writeChar(ControlMessageProtocol.CONTROL_CHARACTER_MAP_START)
  Object.keys(value).forEach(key => {
    write(key, buffer)
    write(value[key], buffer)
  })
  buffer.writeChar(ControlMessageProtocol.CONTROL_CHARACTER_MAP_END)
}

const writeArray = (value, buffer) => {
  buffer.writeChar(ControlMessageProtocol.CONTROL_CHARACTER_LIST_START)
  value.forEach(v=> write(v, buffer))
  buffer.writeChar(ControlMessageProtocol.CONTROL_CHARACTER_LIST_END)
}

const writeBoolean = (value, buffer) => {
  if (value) {
    buffer.writeString(ControlMessageProtocol.TYPE_CHARACTER_BOOL_TRUE)
  } else {
    buffer.writeString(ControlMessageProtocol.TYPE_CHARACTER_BOOL_FALSE)
  }
}

const writeString = (value, buffer) => {
  buffer.writeChar(ControlMessageProtocol.TYPE_CHARACTER_STRING)
  buffer.writeByte(value.length)
  buffer.writeString(value)
}

const writeLong = (value, buffer) => {
  buffer.writeChar(ControlMessageProtocol.TYPE_CHARACTER_LONG)
  buffer.writeLong(value)
}

const writeInt = (value, buffer) => {
  buffer.writeChar(ControlMessageProtocol.TYPE_CHARACTER_INT)
  buffer.writeInt(value)
}

module.exports = {
  encode
}
