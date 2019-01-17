const test = require('tape')
const dgram = require('dgram')

const { log, fixture, util, enableDataSending } = require('../test-helper')
enableDataSending()

const UdpClient = require('../../src/sender/udp-client')

const HOST = '127.0.0.1'
const PORT = 5000

let server = null
const createServer = () => {
  log.debug('start creating server !!')
  server = dgram.createSocket('udp4')

  server.on('listening', () => {
    log.debug('listening')
  })

  server.on('message', (msg, info) => {
    log.debug('message : ', msg.toString())
    log.debug('message info : ', info)
  })

  server.on('error', (err) => {
    log.debug('error', err)
    server.close()
  })

  server.on('close', () => {
    log.debug('close')
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


