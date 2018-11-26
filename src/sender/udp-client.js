const dgram = require('dgram')


class UdpClient {
  constructor (host, port) {
    this.client= dgram.createSocket('udp4')
    this.host = host
    this.port = port
  }

  send (str) {
    const msg = new Buffer(str)
    console.log('host and port', this.host, this.port)
    this.client.send(msg, this.port, this.host, (err) => {
      if (err)  {
        console.log('udp send error', err)
        return
      }
      console.log('success')
    })
  }

  close () {
    this.client.close()
  }
}

module.exports = UdpClient
