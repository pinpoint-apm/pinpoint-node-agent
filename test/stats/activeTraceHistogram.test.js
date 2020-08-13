/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const axios = require('axios')
const { util, log } = require('../test-helper')
const activeTrace = require('../../lib/metric/active-trace')
const AgentStatsMonitor = require('../../lib/metric/agent-stats-monitor')
const agent = require('./agent-mock')()
const express = require('express')

const TEST_ENV = {
    host: 'localhost',
    port: 5005,
}
const getServerUrl = (path) => `http://${TEST_ENV.host}:${TEST_ENV.port}${path}`
  
test(`Should get histogram`, function (t) {
    t.plan(1)
  
    const PATH = '/active-trace'
    const LASTONE_PATH = '/active-trace/lastone'
    const app = new express()
  
    app.get(PATH, async (req, res) => {
      res.send('ok get')
    })

    app.get(LASTONE_PATH, async (req, res) => {
      await util.sleep(500)
      const histogram = activeTrace.getCurrentActiveTraceHistogram()
      t.equals(histogram.fastCount, 1, 'should fastCount 1 is LASTONE_PATH')
      res.send('ok get')
    })
  
    const server = app.listen(TEST_ENV.port, async function () {
      await Promise.all([
        axios.get(getServerUrl(PATH)),
        axios.get(getServerUrl(PATH)),
        axios.get(getServerUrl(PATH)),
        axios.get(getServerUrl(LASTONE_PATH))
      ])
      server.close()
    })
})