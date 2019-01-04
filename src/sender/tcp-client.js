'use strict'

const net = require('net')
const log = require('utils/logger')

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
    this.socket.connect(this.port, this.host, () => {
      log.info('[TDP] Socket Created')
    })
    this.socket.on('data', (data) => {
      log.debug('[TDP] Data Received', data)
    })
  }

  send (msg, callback) {
    try {
      if (!this.socket) {
        this.init()
      }
      this.socket.write(msg)
      log.debug('[TDP] Sent Successfully')
      callback && callback.apply()
    } catch (err) {
      log.error('[TDP] Data Send Error')
    }
  }

  close () {
    if (this.socket) {
      this.socket.end()
      this.socket = null
      log.info('[TDP] Socket closed')
    }
  }
}

module.exports = TcpClient
