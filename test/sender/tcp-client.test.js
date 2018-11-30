const net = require('net')

const test = require('tape')
const TcpClient = require('sender/tcp-client')

const HOST = '127.0.0.1'
const PORT = 5000

let server = null
const createServer = () => {
  console.log('start creating server !!')
  server = net.createServer((socket) => {
    socket.on('data', (chunk) => {
      console.log('received chunk :', chunk.toString())
    })
  })

  server.on('listening', () => {
    console.log('listening')
  })

  server.on('error', (err) => {
    console.log('error', err)
    server.close()
  })

  server.on('close', () => {
    console.log('close')
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


