const net = require('net')

class TcpClient {
  constructor (host, port) {
    this.host = host
    this.port = port
    // this.connect()
  }

  connect (send) {
    this.client = new net.Socket()
    this.client.connect(this.port, this.host, () => {
      console.log('tcp connected')
      send()
    })
  }

  send (msg) {
    this.connect(() => {
      this.client.write(msg)
      console.log('sent successfully')
    })
  }

  close () {
    this.client.destroy()
  }
}

module.exports = TcpClient
