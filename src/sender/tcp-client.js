const net = require('net')

class TcpClient {
  constructor (host, port) {
    this.host = host
    this.port = port
    this.connect()
  }

  async connect () {
    this.client = new net.Socket()
    const conn = new Promise((resolve, reject) => {
      this.client.connect(this.port, this.host, () => {
        console.log('connected')
        resolve()
      })
    })
    await Promise.resolve(conn)
  }

  send (msg) {
    this.client.write(msg)
    console.log('success')
  }

  close () {
    this.client.destroy()
  }
}

module.exports = TcpClient
