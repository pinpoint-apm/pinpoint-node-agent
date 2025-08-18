/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const axios = require('axios')
const express = require('express')

const TEST_ENV = {
  host: 'localhost',
  port: 5006,
}
const getServerUrl = (path) => `http://${TEST_ENV.host}:${TEST_ENV.port}${path}`

test(`Should send stats in every 1 sec`, function (t) {
  const PATH = '/active-trace'
  const app = new express()

  app.get(PATH, async (req, res) => {
    res.send('ok get')
  })

  const server = app.listen(TEST_ENV.port, async function () {
    await axios.get(getServerUrl(PATH))
    server.close()
    t.end()
  })
})
