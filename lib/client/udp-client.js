'use strict'

const dgram = require('dgram')
const log = require('../utils/logger')

class UdpClient {
  constructor (host, port) {
    this.socket = null
    this.host = host
    this.port = port

    this.init()
  }

  init () {
    if (this.socket) {
      this.close()
    }
    this.socket = dgram.createSocket('udp4')
    log.info('[UDP] Socket Created')
  }

  send (msg, callback) {
    if (!this.socket) {
      this.init()
    }
    this.socket.send(msg, this.port, this.host, (err) => {
      if (err)  {
        log.error('[UDP] Data Send Error')
        return
      }
      log.debug('[UDP] Sent Successfully')
      callback && callback.apply()
    })
  }

  close () {
    if (this.socket) {
      this.socket.close()
      this.socket = null
      log.info('[UDP] Socket Closed')
    }
  }
}

module.exports = UdpClient
