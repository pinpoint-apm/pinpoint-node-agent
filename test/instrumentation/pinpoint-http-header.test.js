/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const axios = require('axios')
const express = require('express')

const agent = require('../support/agent-singleton-mock')

const TEST_ENV = {
    host: 'localhost',
    port: 5006,
  }
const getServerUrl = (path) => `http://${TEST_ENV.host}:${TEST_ENV.port}${path}`

test('continue trace', (t) => {
    agent.bindHttp()

    t.plan(1)
    const PATH = '/outgoingrequest'
    const app = new express()

    app.get(PATH, async (req, res) => {
      res.send('ok get')
    })

    const server = app.listen(TEST_ENV.port, async () => {
      const result1 = await axios.get(getServerUrl(PATH))
      t.ok(result1.status, 200)

      server.close()
    })
})