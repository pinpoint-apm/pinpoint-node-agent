const test = require('tape')
const net = require('net')

const { log, fixture, util, enableDataSending } = require('../test-helper')
enableDataSending()

const TcpClient = require('sender/tcp-client')

const HOST = '127.0.0.1'
const PORT = 5000

let server = null
const createServer = () => {
  log.debug('start creating server !!')
  server = net.createServer((socket) => {
    socket.on('data', (chunk) => {
      log.debug('received chunk :', chunk.toString())
    })
  })

  server.on('listening', () => {
    log.debug('listening')
  })

  server.on('error', (err) => {
    log.debug('error', err)
    server.close()
  })

  server.on('close', () => {
    log.debug('close')
  })

  server.listen(PORT)
}

const closeServer = () => {
  server.close()
}

test('Should send tcp message', function (t) {
  t.plan(1)

  createServer()

  const tcpClient = new TcpClient(HOST, PORT)
  tcpClient.send('test message')

  t.ok(tcpClient)

  setTimeout(() => {
    tcpClient.close()
    closeServer()
  }, 2000)
})


