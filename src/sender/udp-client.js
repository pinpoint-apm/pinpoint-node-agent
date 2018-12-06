const dgram = require('dgram')


class UdpClient {
  constructor (host, port) {
    this.client= dgram.createSocket('udp4')
    this.host = host
    this.port = port
  }

  send (msg) {
    this.client.send(msg, this.port, this.host, (err) => {
      if (err)  {
        console.log('udp send error', err)
        return
      }
      console.log('udp sent successfully')
    })
  }

  close () {
    if (this.client) {
      this.client.close()
    }
  }
}

module.exports = UdpClient
