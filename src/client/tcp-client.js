'use strict'

const net = require('net')
const log = require('../utils/logger')
const deserialize = require('../data/serialization-util').deserialize

const DEFAULT_TIMEOUT = 3000

class TcpClient {
  constructor (host, port) {
    this.host = host
    this.port = port
    this.socket = null

    this.init()
  }

  init () {
    if (this.socket) {
      this.close()
    }
    this.socket = new net.Socket()
    this.socket.setTimeout(DEFAULT_TIMEOUT)
    this.socket.connect(this.port, this.host, (data) => {
      log.info('[TCP] Socket Created')
    })
    this.socket.on('data', (data) => {
      log.debug('[TCP] Data Received', data)
      deserialize(data)
    })
    this.socket.on('error', (e) => {
      log.debug('[TCP] Error Occurred', e)
    })
  }

  send (msg, callback) {
    try {
      if (!this.socket) {
        this.init()
      }
      this.socket.write(msg)
      log.debug('[TCP] Sent Successfully')
      callback && callback.apply()
    } catch (err) {
      log.error('[TCP] Data Send Error', err)
    }
  }

  close () {
    if (this.socket) {
      this.socket.end()
      log.info('[TCP] Socket ended')
    }
  }
}

module.exports = TcpClient
