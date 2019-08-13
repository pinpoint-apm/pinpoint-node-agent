'use strict'

const net = require('net')
const log = require('../utils/logger')
const deserialize = require('../data/serialization-util').deserialize

const DEFAULT_TIMEOUT = 3000

const DEFAULT_RETRY_MAX_COUNT = 1
const DEFAULT_RETRY_INTERVAL = 5000

class TcpClient {
  constructor (host, port) {
    this.host = host
    this.port = port
    this.socket = null
    this.messageHandler = null
    this.isConnected = false

    this.init()
  }

  init () {
    if (this.socket) {
      this.close()
    }
    this.socket = this.getSocketConnection()
  }

  setMessageHandler (messageHandler) {
    this.messageHandler = messageHandler
  }

  getSocketConnection (errorCallback) {
    const socket = new net.Socket()
    socket.setTimeout(DEFAULT_TIMEOUT)
    socket.on('data', (data) => {
      log.debug('[TCP] Data Received', data)
      if (this.messageHandler) {
        this.messageHandler.handle(deserialize(data))
      }
    })
    socket.on('error', (e) => {
      log.debug('[TCP] Error Occurred', e)
      errorCallback &&  errorCallback()
    })
    socket.on('close', () => {
      this.isConnected = false
      log.debug('[TCP] Socket Closed')
    })
    socket.connect(this.port, this.host, () => {
      this.isConnected = true
      log.info('[TCP] Socket Created')
    })
    return socket
  }

  send (msg, callback) {
    try {
      if (!this.socket && !this.isConnected) {
        this.init()
      }
      this.socket.write(msg, () => {
        log.debug('[TCP] Sent Successfully')
        callback && callback.apply()
      })
    } catch (err) {
      log.error('[TCP] Data Send Error', err)
    }
  }

  sendRetryable (msg, callback, retryMaxCount= DEFAULT_RETRY_MAX_COUNT, retryInterval = DEFAULT_RETRY_INTERVAL) {
    this.sendWithNewSocket(msg, callback, retryMaxCount, retryInterval, 1)
  }

  sendWithNewSocket (msg, callback, retryMaxCount= DEFAULT_RETRY_MAX_COUNT, retryInterval = DEFAULT_RETRY_INTERVAL, retryCount) {
    const socket = this.getSocketConnection(() => {
      if (retryCount <= retryMaxCount) {
        setTimeout(() => {
          log.debug('[TCP] Retry At', retryCount)
          this.sendWithNewSocket(msg, callback, retryMaxCount, retryInterval, ++retryCount)
        }, retryInterval)
      }
    })
    socket.write(msg, () => {
      log.debug('[TCP] Sent Successfully')
      callback && callback()
    })
  }

  close () {
    if (this.socket) {
      this.socket.end()
    }
  }
}

module.exports = TcpClient
