const net = require('net')

class TcpClient {
  constructor (host, port) {
    this.host = host
    this.port = port
    this.client = null
  }

  connect (send) {
    this.client = new net.Socket()
    this.client.connect(this.port, this.host, () => {
      console.log('tcp connected')
      send()
    })
    this.client.on('data', (data) => {
      console.log('tcp data received', data)
    })
    this.client.on('end', () => {
      console.log('tcp disconnected')
    })
  }

  send (msg) {
    try {
      this.connect(() => {
        this.client.write(msg)
        console.log('tcp sent successfully')
      })
    } catch (e) {
      console.log('tcp sending error',  e)
    }
  }

  close () {
    if (this.client) {
      this.client.end()
    }
  }
}

module.exports = TcpClient
