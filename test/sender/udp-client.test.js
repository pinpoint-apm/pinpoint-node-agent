const dgram = require('dgram')

const test = require('tape')
const UdpClient = require('sender/udp-client')

const HOST = '127.0.0.1'
const PORT = 5000

let server = null
const createServer = () => {
  console.log('start creating server !!')
  server = dgram.createSocket('udp4')

  server.on('listening', () => {
    console.log('listening')
  })

  server.on('message', (msg, info) => {
    console.log('message : ', msg.toString())
    console.log('message info : ', info)
  })

  server.on('error', (err) => {
    console.log('error', err)
    server.close()
  })

  server.on('close', () => {
    console.log('close')
  })

  server.bind(PORT)
}

const closeServer = () => {
  server.close()
}

test('Should send udp message', function (t) {
  t.plan(1)

  createServer()

  const udpClient = new UdpClient(HOST, PORT)

  const buffer = new Buffer('test message')
  udpClient.send(buffer)

  t.ok(udpClient)

  setTimeout(() => {
    udpClient.close()
    closeServer()
  }, 2000)
})


